"""
DisasterIQ — Geocoding & Map Coordinates
Uses Nominatim (OpenStreetMap) to geocode user-provided locations.
"""

import random
import traceback
from typing import Any, Dict, List

from config import DEFAULT_COORDINATES, GEOCODE_TIMEOUT, GEOCODE_USER_AGENT


def geocode_location(location: str) -> Dict[str, float]:
    """
    Convert a location string to lat/lon using Nominatim.
    Falls back to India center if geocoding fails.
    """
    if not location or not location.strip():
        return dict(DEFAULT_COORDINATES)

    try:
        from geopy.geocoders import Nominatim

        geolocator = Nominatim(user_agent=GEOCODE_USER_AGENT, timeout=GEOCODE_TIMEOUT)
        result = geolocator.geocode(location)

        if result:
            return {"lat": round(result.latitude, 6), "lon": round(result.longitude, 6)}
        else:
            print(f"[DisasterIQ] Geocoding returned no results for '{location}'. Using default.")
            return dict(DEFAULT_COORDINATES)

    except Exception as exc:
        print(f"[DisasterIQ] Geocoding error: {exc}")
        traceback.print_exc()
        return dict(DEFAULT_COORDINATES)


def generate_zone_markers(
    center: Dict[str, float],
    zones: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """
    Create map markers for each zone around the center point.
    Each marker includes zone info and resources for map popups.

    Returns a list of marker dicts:
        { lat, lon, zone_name, severity, badge_color, population,
          food_packets, water_litres, medical_kits, rescue_personnel,
          shelter_tents, priority_timeline, access_type, marker_type }
    """
    markers: List[Dict[str, Any]] = []
    offsets = {
        "critical": (0.008, -0.008),
        "moderate": (-0.012, 0.012),
        "low": (0.015, 0.015),
    }

    for zone_key, zone_data in zones.items():
        d_lat, d_lon = offsets.get(zone_key, (0, 0))
        # Add small random jitter so markers don't overlap
        jitter_lat = random.uniform(-0.002, 0.002)
        jitter_lon = random.uniform(-0.002, 0.002)

        markers.append({
            "lat": center["lat"] + d_lat + jitter_lat,
            "lon": center["lon"] + d_lon + jitter_lon,
            "zone_name": zone_data["name"],
            "severity": zone_data["severity"],
            "badge_color": zone_data["badge_color"],
            "population": zone_data["population"],
            "food_packets": zone_data["food_packets"],
            "water_litres": zone_data["water_litres"],
            "medical_kits": zone_data["medical_kits"],
            "rescue_personnel": zone_data["rescue_personnel"],
            "shelter_tents": zone_data["shelter_tents"],
            "priority_timeline": zone_data["priority_timeline"],
            "access_type": zone_data["access_type"],
            "marker_type": "zone",
        })

    # Supply depot marker at center
    markers.append({
        "lat": center["lat"],
        "lon": center["lon"],
        "zone_name": "Supply Depot",
        "severity": "Depot",
        "badge_color": "#3b82f6",
        "population": 0,
        "food_packets": 0,
        "water_litres": 0,
        "medical_kits": 0,
        "rescue_personnel": 0,
        "shelter_tents": 0,
        "priority_timeline": "Immediate",
        "access_type": "Central Hub",
        "marker_type": "depot",
    })

    return markers
