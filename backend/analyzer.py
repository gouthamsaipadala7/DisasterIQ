"""
DisasterIQ — Image Analyzer
Handles YOLOv8 detection with HSV color-analysis fallback.
"""

import base64
import io
import math
import traceback
from typing import Any, Dict, List, Tuple

import cv2
import numpy as np
from PIL import Image

from config import (
    HSV_FALLBACK_THRESHOLD,
    HSV_RANGES,
    IMAGE_SIZE,
    YOLO_CONFIDENCE_THRESHOLD,
    YOLO_MODEL_NAME,
    ZONE_THRESHOLDS,
)

# ─── Lazy-load YOLO so import doesn't crash if ultralytics is missing ───
_yolo_model = None


def _get_yolo_model():
    """Lazily load the YOLOv8 model (downloads automatically on first use)."""
    global _yolo_model
    if _yolo_model is None:
        try:
            from ultralytics import YOLO
            _yolo_model = YOLO(YOLO_MODEL_NAME)
            print("[DisasterIQ] YOLOv8n model loaded successfully.")
        except Exception as exc:
            print(f"[DisasterIQ] YOLOv8 load failed: {exc}")
            _yolo_model = "FAILED"
    return _yolo_model


# ─── Utility helpers ────────────────────────────────────────────


def _image_from_bytes(raw_bytes: bytes) -> np.ndarray:
    """Convert raw image bytes to an OpenCV BGR image, resized to 640×640."""
    nparr = np.frombuffer(raw_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode uploaded image.")
    img = cv2.resize(img, IMAGE_SIZE)
    return img


def _image_to_base64(img: np.ndarray) -> str:
    """Encode an OpenCV image to a base64 JPEG string."""
    _, buf = cv2.imencode(".jpg", img, [cv2.IMWRITE_JPEG_QUALITY, 90])
    return base64.b64encode(buf.tobytes()).decode("utf-8")


# ─── YOLOv8 Detection ──────────────────────────────────────────


def _run_yolo(img: np.ndarray) -> Tuple[float, List[Dict[str, Any]], str]:
    """
    Run YOLOv8n on image.
    Returns (damage_score, detections_list, detection_method).
    Each detection: {label, confidence, bbox:[x1,y1,x2,y2], color_hex}
    """
    model = _get_yolo_model()
    if model == "FAILED" or model is None:
        return 0.0, [], "hsv_fallback"

    try:
        results = model.predict(img, conf=YOLO_CONFIDENCE_THRESHOLD, verbose=False)
        detections: List[Dict[str, Any]] = []
        total_conf = 0.0

        for r in results:
            boxes = r.boxes
            if boxes is None or len(boxes) == 0:
                continue
            for box in boxes:
                x1, y1, x2, y2 = box.xyxy[0].cpu().numpy().tolist()
                conf = float(box.conf[0].cpu().numpy())
                cls_id = int(box.cls[0].cpu().numpy())
                label = model.names.get(cls_id, f"class_{cls_id}")
                total_conf += conf
                detections.append({
                    "label": label,
                    "confidence": round(conf, 3),
                    "bbox": [int(x1), int(y1), int(x2), int(y2)],
                    "color_hex": "#f59e0b",
                })

        if len(detections) == 0:
            return 0.0, [], "hsv_fallback"

        avg_conf = total_conf / len(detections)
        if avg_conf < HSV_FALLBACK_THRESHOLD:
            return 0.0, [], "hsv_fallback"

        # Damage score: combination of # detections and avg confidence
        damage_score = min(1.0, round(avg_conf * min(len(detections) / 5, 1.0), 3))
        return damage_score, detections, "yolov8"

    except Exception as exc:
        print(f"[DisasterIQ] YOLO inference error: {exc}")
        traceback.print_exc()
        return 0.0, [], "hsv_fallback"


# ─── HSV Color-Analysis Fallback ────────────────────────────────


def _run_hsv_analysis(img: np.ndarray, disaster_type: str) -> Tuple[float, List[Dict[str, Any]]]:
    """
    Analyze image using HSV color ranges.
    Returns (damage_score, synthetic_detections).
    """
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, w = img.shape[:2]
    total_pixels = h * w
    detections: List[Dict[str, Any]] = []
    damage_pixels = 0

    # Decide which HSV keys to focus on based on disaster type
    key_map = {
        "Flood": ["flood", "rubble"],
        "Earthquake": ["rubble", "fire"],
        "Fire": ["fire", "rubble"],
        "Cyclone": ["flood", "rubble", "vegetation"],
    }
    keys_to_check = key_map.get(disaster_type, list(HSV_RANGES.keys()))

    for key in keys_to_check:
        cfg = HSV_RANGES.get(key)
        if cfg is None:
            continue
        lower = np.array(cfg["lower"], dtype=np.uint8)
        upper = np.array(cfg["upper"], dtype=np.uint8)
        mask = cv2.inRange(hsv, lower, upper)
        pixel_count = int(cv2.countNonZero(mask))

        if pixel_count < total_pixels * 0.01:
            continue

        # Find contours to create bounding boxes
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        # Keep largest contours
        contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]
        for cnt in contours:
            area = cv2.contourArea(cnt)
            if area < total_pixels * 0.005:
                continue
            x, y, bw, bh = cv2.boundingRect(cnt)
            detections.append({
                "label": cfg["label"],
                "confidence": round(min(area / total_pixels * 3, 0.95), 3),
                "bbox": [x, y, x + bw, y + bh],
                "color_hex": cfg["color_hex"],
            })
        damage_pixels += pixel_count

    # Overall damage score from pixel coverage
    raw_score = damage_pixels / total_pixels
    damage_score = min(1.0, round(raw_score * 1.5, 3))

    # If very few detections, add a synthetic one covering center
    if len(detections) == 0:
        cx, cy = w // 4, h // 4
        detections.append({
            "label": "Affected Region",
            "confidence": round(max(damage_score, 0.3), 3),
            "bbox": [cx, cy, cx + w // 2, cy + h // 2],
            "color_hex": "#f59e0b",
        })
        damage_score = max(damage_score, 0.25)

    return damage_score, detections


# ─── Annotate Image ─────────────────────────────────────────────


def _annotate_image(img: np.ndarray, detections: List[Dict[str, Any]]) -> np.ndarray:
    """Draw bounding boxes on a copy of the image."""
    annotated = img.copy()
    color_map = {
        "#f59e0b": (0, 165, 245),     # amber → BGR
        "#3b82f6": (246, 130, 59),     # blue → BGR
        "#8b5cf6": (246, 92, 139),     # purple → BGR
        "#10b981": (129, 185, 16),     # green → BGR
    }
    default_color = (0, 165, 245)

    for det in detections:
        x1, y1, x2, y2 = det["bbox"]
        hex_c = det.get("color_hex", "#f59e0b")
        bgr = color_map.get(hex_c, default_color)

        cv2.rectangle(annotated, (x1, y1), (x2, y2), bgr, 2)

        label_text = f'{det["label"]} {det["confidence"]:.0%}'
        (tw, th), _ = cv2.getTextSize(label_text, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
        cv2.rectangle(annotated, (x1, y1 - th - 8), (x1 + tw + 4, y1), bgr, -1)
        cv2.putText(
            annotated, label_text, (x1 + 2, y1 - 4),
            cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA,
        )

    return annotated


# ─── Classify Severity ──────────────────────────────────────────


def classify_severity(damage_score: float) -> str:
    """Return 'Critical', 'Moderate', or 'Low' based on thresholds."""
    if damage_score >= ZONE_THRESHOLDS["critical"]:
        return "Critical"
    elif damage_score >= ZONE_THRESHOLDS["moderate"]:
        return "Moderate"
    return "Low"


# ─── Public Entry Point ─────────────────────────────────────────


def analyze_image(
    raw_bytes: bytes,
    disaster_type: str,
) -> Dict[str, Any]:
    """
    Full analysis pipeline.
    Returns dict with damage_score, severity, detections, both images as b64.
    """
    img = _image_from_bytes(raw_bytes)
    original_b64 = _image_to_base64(img)

    # Step 1 — Try YOLO
    damage_score, detections, method = _run_yolo(img)

    # Step 2 — HSV fallback if needed
    if method == "hsv_fallback":
        damage_score, detections = _run_hsv_analysis(img, disaster_type)
        method = "Color Analysis (HSV)"
    else:
        method = "YOLOv8 AI Detection"

    # Ensure minimum score
    if damage_score < 0.05:
        damage_score = 0.15

    # Step 3 — Annotate
    annotated = _annotate_image(img, detections)
    annotated_b64 = _image_to_base64(annotated)

    severity = classify_severity(damage_score)

    return {
        "damage_score": damage_score,
        "severity_level": severity,
        "detection_method": method,
        "detections": detections,
        "original_image_base64": original_b64,
        "annotated_image_base64": annotated_b64,
    }
