"""
DisasterIQ — PDF Report Generator
Creates professional field reports using ReportLab.
"""

import base64
import io
import traceback
from datetime import datetime
from typing import Any, Dict

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm, mm
from reportlab.platypus import (
    Image as RLImage,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

from config import REPORT_FOOTER, REPORT_TITLE


# ─── Color palette matching the frontend ────────────────────────
_BG_DARK = colors.HexColor("#0a0f1e")
_SURFACE = colors.HexColor("#111827")
_BORDER = colors.HexColor("#1f2937")
_PRIMARY = colors.HexColor("#3b82f6")
_TEAL = colors.HexColor("#06b6d4")
_AMBER = colors.HexColor("#f59e0b")
_PURPLE = colors.HexColor("#8b5cf6")
_GREEN = colors.HexColor("#10b981")
_TEXT = colors.HexColor("#f9fafb")
_TEXT_SEC = colors.HexColor("#9ca3af")
_WHITE = colors.white
_BLACK = colors.black


def _header_style():
    return ParagraphStyle(
        "DIQHeader",
        fontName="Helvetica-Bold",
        fontSize=20,
        leading=26,
        textColor=_PRIMARY,
        spaceAfter=4 * mm,
    )


def _sub_header_style():
    return ParagraphStyle(
        "DIQSubHeader",
        fontName="Helvetica-Bold",
        fontSize=13,
        leading=18,
        textColor=_TEAL,
        spaceAfter=3 * mm,
        spaceBefore=5 * mm,
    )


def _body_style():
    return ParagraphStyle(
        "DIQBody",
        fontName="Helvetica",
        fontSize=10,
        leading=14,
        textColor=_BLACK,
    )


def _small_style():
    return ParagraphStyle(
        "DIQSmall",
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=colors.grey,
    )


def generate_pdf(data: Dict[str, Any]) -> bytes:
    """
    Build a multi-page PDF field report.

    `data` should contain:
        disaster_type, location, damage_score, severity_level,
        detection_method, zones (critical/moderate/low each with resources),
        totals, annotated_image_base64 (optional)
    """
    buf = io.BytesIO()

    doc = SimpleDocTemplate(
        buf,
        pagesize=A4,
        leftMargin=2 * cm,
        rightMargin=2 * cm,
        topMargin=2 * cm,
        bottomMargin=2 * cm,
    )

    elements = []
    header = _header_style()
    sub_header = _sub_header_style()
    body = _body_style()
    small = _small_style()

    now = datetime.now().strftime("%B %d, %Y  %H:%M")

    # ── Page 1: Title & Summary ──────────────────────────────────
    elements.append(Paragraph(REPORT_TITLE, header))
    elements.append(Spacer(1, 2 * mm))
    elements.append(Paragraph(f"Generated: {now}", small))
    elements.append(Spacer(1, 6 * mm))

    info_data = [
        ["Disaster Type", data.get("disaster_type", "N/A")],
        ["Location", data.get("location", "N/A")],
        ["Damage Score", f'{data.get("damage_score", 0):.2f}'],
        ["Severity Level", data.get("severity_level", "N/A")],
        ["Detection Method", data.get("detection_method", "N/A")],
        ["Total Population", str(data.get("totals", {}).get("population", "N/A"))],
    ]
    info_table = Table(info_data, colWidths=[5 * cm, 10 * cm])
    info_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TEXTCOLOR", (0, 0), (0, -1), _PRIMARY),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 4),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, _BORDER),
    ]))
    elements.append(info_table)
    elements.append(Spacer(1, 8 * mm))

    # ── Annotated image (if available) ───────────────────────────
    ann_b64 = data.get("annotated_image_base64")
    if ann_b64:
        try:
            img_bytes = base64.b64decode(ann_b64)
            img_buf = io.BytesIO(img_bytes)
            rl_img = RLImage(img_buf, width=14 * cm, height=14 * cm, kind="proportional")
            elements.append(Paragraph("AI Detection Result", sub_header))
            elements.append(rl_img)
            elements.append(Spacer(1, 6 * mm))
        except Exception:
            pass  # Skip image if decoding fails

    # ── Page 2: Zone-wise Resource Table ─────────────────────────
    elements.append(Paragraph("Zone-wise Resource Allocation", sub_header))

    zones = data.get("zones", {})
    table_header = [
        "Resource",
        "Critical (A)",
        "Moderate (B)",
        "Low (C)",
        "Total",
    ]
    resource_keys = [
        ("population", "Population"),
        ("food_packets", "Food Packets"),
        ("water_litres", "Water (Litres)"),
        ("medical_kits", "Medical Kits"),
        ("rescue_personnel", "Rescue Personnel"),
        ("shelter_tents", "Shelter Tents"),
    ]
    table_data = [table_header]
    totals_data = data.get("totals", {})

    for key, label in resource_keys:
        row = [
            label,
            str(zones.get("critical", {}).get(key, 0)),
            str(zones.get("moderate", {}).get(key, 0)),
            str(zones.get("low", {}).get(key, 0)),
            str(totals_data.get(key, 0)),
        ]
        table_data.append(row)

    res_table = Table(table_data, colWidths=[4 * cm, 3 * cm, 3 * cm, 3 * cm, 3 * cm])
    res_table.setStyle(TableStyle([
        # Header row
        ("BACKGROUND", (0, 0), (-1, 0), _PRIMARY),
        ("TEXTCOLOR", (0, 0), (-1, 0), _WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 10),
        ("ALIGN", (1, 0), (-1, -1), "CENTER"),
        # Body
        ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
        ("FONTSIZE", (0, 1), (-1, -1), 9),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        # Alternating row colors
        *[
            ("BACKGROUND", (0, i), (-1, i), colors.HexColor("#f0f4ff") if i % 2 == 0 else _WHITE)
            for i in range(1, len(table_data))
        ],
        # Grid
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d1d5db")),
        # Total column bold
        ("FONTNAME", (-1, 1), (-1, -1), "Helvetica-Bold"),
    ]))
    elements.append(res_table)
    elements.append(Spacer(1, 8 * mm))

    # ── Priority Timeline ────────────────────────────────────────
    elements.append(Paragraph("Priority Timeline & Access Routes", sub_header))

    timeline_data = [["Zone", "Priority", "Access Route"]]
    for zone_key in ("critical", "moderate", "low"):
        z = zones.get(zone_key, {})
        timeline_data.append([
            z.get("name", zone_key.title()),
            z.get("priority_timeline", "N/A"),
            z.get("access_type", "N/A"),
        ])

    tl_table = Table(timeline_data, colWidths=[6 * cm, 4 * cm, 6 * cm])
    tl_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), _TEAL),
        ("TEXTCOLOR", (0, 0), (-1, 0), _WHITE),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d1d5db")),
        ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
    ]))
    elements.append(tl_table)
    elements.append(Spacer(1, 15 * mm))

    # ── Footer ───────────────────────────────────────────────────
    footer_style = ParagraphStyle(
        "Footer",
        fontName="Helvetica",
        fontSize=8,
        textColor=colors.grey,
        alignment=1,  # center
    )
    elements.append(Paragraph(REPORT_FOOTER, footer_style))
    elements.append(Paragraph(f"Report generated on {now}", footer_style))

    # ── Build PDF ────────────────────────────────────────────────
    try:
        doc.build(elements)
    except Exception as exc:
        traceback.print_exc()
        raise RuntimeError(f"PDF generation failed: {exc}")

    return buf.getvalue()
