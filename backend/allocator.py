"""
DisasterIQ — Resource Allocator
Splits population across zones and computes resource needs.
"""

import math
from typing import Any, Dict

from config import POPULATION_SPLIT, RESOURCE_MULTIPLIERS, ZONE_METADATA


def allocate_resources(population: int, damage_score: float) -> Dict[str, Any]:
    """
    Given total affected population and a damage score,
    allocate resources across Critical / Moderate / Low zones.

    Returns:
        {
            "zones": { "critical": {...}, "moderate": {...}, "low": {...} },
            "totals": { "food_packets": ..., ... }
        }
    """
    zones: Dict[str, Any] = {}
    totals: Dict[str, int] = {
        "food_packets": 0,
        "water_litres": 0,
        "medical_kits": 0,
        "rescue_personnel": 0,
        "shelter_tents": 0,
        "population": 0,
    }

    for zone_key in ("critical", "moderate", "low"):
        meta = ZONE_METADATA[zone_key]
        pop_fraction = POPULATION_SPLIT[zone_key]
        zone_pop = max(1, math.ceil(population * pop_fraction))

        # Scale resources by damage severity for critical zone
        severity_factor = 1.0
        if zone_key == "critical":
            severity_factor = max(1.0, damage_score * 1.5)
        elif zone_key == "moderate":
            severity_factor = max(0.8, damage_score)

        food = math.ceil(zone_pop * RESOURCE_MULTIPLIERS["food_packets"] * severity_factor)
        water = math.ceil(zone_pop * RESOURCE_MULTIPLIERS["water_litres"] * severity_factor)
        kits = math.ceil(zone_pop * RESOURCE_MULTIPLIERS["medical_kits"] * severity_factor)
        rescue = max(1, math.ceil(zone_pop * RESOURCE_MULTIPLIERS["rescue_personnel"] * severity_factor))
        tents = max(1, math.ceil(zone_pop * RESOURCE_MULTIPLIERS["shelter_tents"] * severity_factor))

        zone_data = {
            "name": meta["name"],
            "severity": meta["severity"],
            "badge_color": meta["badge_color"],
            "priority_timeline": meta["priority_timeline"],
            "access_type": meta["access_type"],
            "population": zone_pop,
            "food_packets": food,
            "water_litres": water,
            "medical_kits": kits,
            "rescue_personnel": rescue,
            "shelter_tents": tents,
        }
        zones[zone_key] = zone_data

        # Accumulate totals
        totals["population"] += zone_pop
        totals["food_packets"] += food
        totals["water_litres"] += water
        totals["medical_kits"] += kits
        totals["rescue_personnel"] += rescue
        totals["shelter_tents"] += tents

    return {"zones": zones, "totals": totals}
