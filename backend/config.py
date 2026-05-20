"""
DisasterIQ Configuration
All constants, thresholds, and resource multipliers.
"""

# ─── Image Processing ───────────────────────────────────────────
IMAGE_SIZE = (640, 640)
YOLO_MODEL_NAME = "yolov8n.pt"
YOLO_CONFIDENCE_THRESHOLD = 0.25
HSV_FALLBACK_THRESHOLD = 0.5  # If YOLO avg confidence < this, use HSV

# ─── HSV Color Ranges for Disaster Detection ────────────────────
# Each range is (lower_bound, upper_bound) in HSV space
HSV_RANGES = {
    "flood": {
        "lower": (90, 30, 50),
        "upper": (130, 255, 200),
        "label": "Flooded Area",
        "color_bgr": (255, 150, 0),      # Blue in BGR
        "color_hex": "#3b82f6",
    },
    "fire": {
        "lower": (0, 0, 0),
        "upper": (180, 80, 60),
        "label": "Burnt/Destroyed",
        "color_bgr": (0, 165, 245),       # Amber in BGR
        "color_hex": "#f59e0b",
    },
    "rubble": {
        "lower": (0, 0, 80),
        "upper": (180, 50, 180),
        "label": "Rubble/Debris",
        "color_bgr": (108, 92, 139),      # Purple in BGR
        "color_hex": "#8b5cf6",
    },
    "vegetation": {
        "lower": (35, 40, 40),
        "upper": (85, 255, 255),
        "label": "Open Ground",
        "color_bgr": (129, 185, 16),      # Green in BGR
        "color_hex": "#10b981",
    },
}

# ─── Zone Classification Thresholds ─────────────────────────────
ZONE_THRESHOLDS = {
    "critical": 0.6,   # score >= 0.6
    "moderate": 0.3,   # 0.3 <= score < 0.6
    # low: score < 0.3
}

# ─── Population Distribution ────────────────────────────────────
POPULATION_SPLIT = {
    "critical": 0.60,
    "moderate": 0.30,
    "low": 0.10,
}

# ─── Resource Multipliers per Person ────────────────────────────
RESOURCE_MULTIPLIERS = {
    "food_packets": 3,
    "water_litres": 20,
    "medical_kits": 0.20,
    "rescue_personnel": 1 / 50,
    "shelter_tents": 1 / 4,
}

# ─── Zone Metadata ──────────────────────────────────────────────
ZONE_METADATA = {
    "critical": {
        "name": "Zone A — Critical",
        "severity": "Critical",
        "priority_timeline": "0 – 6 Hours",
        "access_type": "Helicopter + Emergency Road",
        "badge_color": "#f59e0b",
    },
    "moderate": {
        "name": "Zone B — Moderate",
        "severity": "Moderate",
        "priority_timeline": "6 – 24 Hours",
        "access_type": "Road Transport",
        "badge_color": "#8b5cf6",
    },
    "low": {
        "name": "Zone C — Low",
        "severity": "Low",
        "priority_timeline": "24 – 48 Hours",
        "access_type": "Road Transport",
        "badge_color": "#10b981",
    },
}

# ─── Default Map Center (India)──────────────────────────────────
DEFAULT_COORDINATES = {"lat": 20.5937, "lon": 78.9629}

# ─── Geocoding ──────────────────────────────────────────────────
GEOCODE_USER_AGENT = "DisasterIQ/1.0 (college-project)"
GEOCODE_TIMEOUT = 10

# ─── Report ─────────────────────────────────────────────────────
REPORT_TITLE = "DisasterIQ Field Report"
REPORT_FOOTER = "DisasterIQ | MLRIT Hyderabad"
REPORT_FONT = "Helvetica"

# ─── CORS Origins ───────────────────────────────────────────────
CORS_ORIGINS = ["*"]
