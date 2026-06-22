"""
DisasterIQ — FastAPI Backend
Main entry point with /analyze, /sample, and /report endpoints.
Serves the React frontend as static files in production.
"""

import base64
import io
import os
import traceback
from pathlib import Path
from typing import Optional

import cv2
import numpy as np
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse, Response
from fastapi.staticfiles import StaticFiles

from allocator import allocate_resources
from analyzer import analyze_image
from config import CORS_ORIGINS
from mapper import geocode_location, generate_zone_markers
from reporter import generate_pdf

from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://disaster-iq-six.vercel.app"}})

# ─── App Initialization ─────────────────────────────────────────

app = FastAPI(
    title="DisasterIQ API",
    description="AI-Powered Disaster Response and Resource Allocation System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Health Check ────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "DisasterIQ"}


# ─── Analyze Endpoint ───────────────────────────────────────────

@app.post("/api/analyze")
async def analyze(
    image: UploadFile = File(...),
    disaster_type: str = Form("Flood"),
    location: str = Form("India"),
    population: int = Form(10000),
):
    """
    Main analysis pipeline:
    1. Read & preprocess image
    2. Run YOLO / HSV analysis
    3. Allocate resources across zones
    4. Geocode location for map
    5. Return full results JSON
    """
    try:
        # Read image bytes
        raw_bytes = await image.read()
        if len(raw_bytes) < 100:
            raise HTTPException(status_code=400, detail="Uploaded file is too small or empty.")

        # Step 1-3: Analyze image
        analysis = analyze_image(raw_bytes, disaster_type)

        # Step 4: Allocate resources
        allocation = allocate_resources(population, analysis["damage_score"])

        # Step 5: Geocode
        coordinates = geocode_location(location)

        # Step 6: Map markers
        markers = generate_zone_markers(coordinates, allocation["zones"])

        # Build response
        result = {
            "damage_score": analysis["damage_score"],
            "severity_level": analysis["severity_level"],
            "detection_method": analysis["detection_method"],
            "disaster_type": disaster_type,
            "location": location,
            "population": population,
            "zones": allocation["zones"],
            "totals": allocation["totals"],
            "coordinates": coordinates,
            "markers": markers,
            "original_image_base64": analysis["original_image_base64"],
            "annotated_image_base64": analysis["annotated_image_base64"],
            "detections": analysis["detections"],
        }

        return JSONResponse(content=result)

    except HTTPException:
        raise
    except Exception as exc:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(exc)}")


# ─── Sample Endpoint ────────────────────────────────────────────

@app.get("/api/sample")
async def sample():
    """
    Returns a pre-built sample analysis result so the app can demo
    without uploading an image.
    """
    try:
        # Generate a synthetic disaster image
        img = _generate_sample_image()
        raw_bytes = cv2.imencode(".jpg", img)[1].tobytes()

        analysis = analyze_image(raw_bytes, "Flood")
        allocation = allocate_resources(25000, analysis["damage_score"])
        coordinates = geocode_location("Kerala, India")
        markers = generate_zone_markers(coordinates, allocation["zones"])

        result = {
            "damage_score": analysis["damage_score"],
            "severity_level": analysis["severity_level"],
            "detection_method": analysis["detection_method"],
            "disaster_type": "Flood",
            "location": "Kerala, India",
            "population": 25000,
            "zones": allocation["zones"],
            "totals": allocation["totals"],
            "coordinates": coordinates,
            "markers": markers,
            "original_image_base64": analysis["original_image_base64"],
            "annotated_image_base64": analysis["annotated_image_base64"],
            "detections": analysis["detections"],
        }

        return JSONResponse(content=result)

    except Exception as exc:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"Sample generation failed: {str(exc)}",
        )


def _generate_sample_image() -> np.ndarray:
    """Create a synthetic disaster-zone image for demo purposes."""
    img = np.zeros((640, 640, 3), dtype=np.uint8)

    # Sky gradient (top)
    for y in range(200):
        ratio = y / 200
        b = int(140 - ratio * 60)
        g = int(120 - ratio * 40)
        r = int(90 - ratio * 30)
        img[y, :] = [max(b, 0), max(g, 0), max(r, 0)]

    # Water/flood area (blue-grey)
    cv2.rectangle(img, (0, 200), (640, 420), (130, 100, 60), -1)
    # Add noise for realism
    noise = np.random.randint(0, 30, (220, 640, 3), dtype=np.uint8)
    img[200:420, :] = cv2.add(img[200:420, :], noise)

    # Ground / rubble (grey-brown)
    cv2.rectangle(img, (0, 420), (640, 640), (80, 90, 100), -1)
    noise2 = np.random.randint(0, 25, (220, 640, 3), dtype=np.uint8)
    img[420:640, :] = cv2.add(img[420:640, :], noise2)

    # Damaged structures (dark rectangles)
    cv2.rectangle(img, (50, 300), (180, 400), (40, 40, 50), -1)
    cv2.rectangle(img, (50, 300), (180, 400), (60, 60, 70), 2)

    cv2.rectangle(img, (220, 280), (350, 410), (45, 40, 40), -1)
    cv2.rectangle(img, (220, 280), (350, 410), (70, 60, 60), 2)

    cv2.rectangle(img, (400, 320), (560, 420), (50, 45, 45), -1)
    cv2.rectangle(img, (400, 320), (560, 420), (65, 65, 70), 2)

    # Vegetation patches (green)
    cv2.rectangle(img, (450, 440), (600, 560), (50, 120, 40), -1)
    cv2.rectangle(img, (30, 450), (150, 540), (40, 100, 35), -1)

    # Road (dark line)
    cv2.line(img, (0, 430), (640, 425), (60, 60, 65), 8)

    # Slight blur for realism
    img = cv2.GaussianBlur(img, (3, 3), 0)

    return img


# ─── Report Endpoint ────────────────────────────────────────────

@app.post("/api/report")
async def report(data: dict):
    """
    Generate a PDF field report from analysis results.
    Accepts the full analysis JSON and returns a PDF file.
    """
    try:
        pdf_bytes = generate_pdf(data)
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": 'attachment; filename="DisasterIQ_Field_Report.pdf"'
            },
        )
    except Exception as exc:
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"PDF generation failed: {str(exc)}",
        )


# ─── Serve Frontend Static Files (production) ───────────────────

FRONTEND_DIR = Path(__file__).parent.parent / "frontend" / "dist"

if FRONTEND_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        """Serve the React SPA for any non-API route."""
        file_path = FRONTEND_DIR / full_path
        if file_path.is_file():
            return FileResponse(str(file_path))
        return FileResponse(str(FRONTEND_DIR / "index.html"))


# ─── Entry point for direct execution ───────────────────────────

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)


if __name__ == "__main__":
    import uvicorn

    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)

from flask_cors import CORS

CORS(app, origins=["https://disaster-iq-six.vercel.app"])

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json

    result = {
        "success": True,
        "message": "Analysis working",
        "input": data
    }

    return jsonify(result)
