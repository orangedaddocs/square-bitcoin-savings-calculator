from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
PUBLIC_DIR = ROOT / "public"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
PUBLIC_DIR.mkdir(parents=True, exist_ok=True)

output_pdf = OUTPUT_DIR / "why-turn-on-bitcoin.pdf"
public_pdf = PUBLIC_DIR / "why-turn-on-bitcoin.pdf"

styles = getSampleStyleSheet()
title = ParagraphStyle(
    "Title",
    parent=styles["Title"],
    fontName="Helvetica-Bold",
    fontSize=28,
    leading=30,
    textColor=colors.HexColor("#063d2f"),
    spaceAfter=10,
)
subtitle = ParagraphStyle(
    "Subtitle",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=12,
    leading=16,
    textColor=colors.HexColor("#38413b"),
    spaceAfter=12,
)
section = ParagraphStyle(
    "Section",
    parent=styles["Heading2"],
    fontName="Helvetica-Bold",
    fontSize=13,
    leading=15,
    textColor=colors.HexColor("#080b09"),
    spaceBefore=8,
    spaceAfter=5,
)
body = ParagraphStyle(
    "Body",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=9.7,
    leading=12.4,
    textColor=colors.HexColor("#202923"),
    spaceAfter=6,
)
small = ParagraphStyle(
    "Small",
    parent=styles["BodyText"],
    fontName="Helvetica",
    fontSize=8.2,
    leading=10,
    textColor=colors.HexColor("#5e6760"),
    spaceBefore=6,
)

story = []
story.append(Paragraph("Why Turn On Bitcoin Payments?", title))
story.append(
    Paragraph(
        "A one-page handout for Square sellers comparing Bitcoin Payments with standard in-person card fees.",
        subtitle,
    )
)
story.append(Paragraph("The fee difference is easy to see", section))
story.append(
    Paragraph(
        "Square lists Bitcoin Payments at 0% through 2026, then a flat 1% starting in 2027. "
        "Square's standard in-person card rate is 2.6% plus 15 cents. That fixed 15 cents matters most on small everyday tickets like coffee, burritos, quick lunches, beer tabs, and retail add-ons.",
        body,
    )
)

table_data = [
    ["Ticket", "Card fee", "Bitcoin 2026", "Save now", "Bitcoin 2027+", "Save then"],
    ["$5", "$0.28", "$0.00", "$0.28", "$0.05", "$0.23"],
    ["$15", "$0.54", "$0.00", "$0.54", "$0.15", "$0.39"],
    ["$25", "$0.80", "$0.00", "$0.80", "$0.25", "$0.55"],
    ["$50", "$1.45", "$0.00", "$1.45", "$0.50", "$0.95"],
    ["$100", "$2.75", "$0.00", "$2.75", "$1.00", "$1.75"],
    ["$600 max", "$15.75", "$0.00", "$15.75", "$6.00", "$9.75"],
]
table = Table(
    table_data,
    colWidths=[0.72 * inch, 0.78 * inch, 0.9 * inch, 0.82 * inch, 0.98 * inch, 0.86 * inch],
)
table.setStyle(
    TableStyle(
        [
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#063d2f")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
            ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
            ("FONTSIZE", (0, 0), (-1, -1), 8.3),
            ("LEADING", (0, 0), (-1, -1), 10),
            ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#dce5dd")),
            ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#f8faf6")),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("TOPPADDING", (0, 0), (-1, -1), 5),
            ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ]
    )
)
story.append(table)

story.append(Paragraph("Why merchants care", section))
story.append(
    Paragraph(
        "The calculator is meant to make one customer example concrete: one ticket size, one repeat-visit pattern, and the processing fees attached to that habit. If a regular customer spends $15 weekly, the merchant saves about 54 cents on each Bitcoin sale through 2026 and about 39 cents on each similar sale after the 1% fee begins.",
        body,
    )
)
story.append(
    Paragraph(
        "Bitcoin Payments can settle in seconds, and payments are final, so the merchant avoids the chargeback path that exists with cards. It does not replace cards or cash. It adds a lower-fee option for customers who want to use it.",
        body,
    )
)
story.append(Paragraph("What to remember", section))
story.append(
    Paragraph(
        "0% in 2026. 1% in 2027. No card-style chargebacks. Current Square Bitcoin Payments transactions are capped at $600. Larger purchases need another payment method.",
        body,
    )
)
story.append(Spacer(1, 4))
story.append(
    Paragraph(
        "Sources: squareup.com/us/en/bitcoin and squareup.com/us/en/payments/our-fees. Verify current fees and availability with Square before relying on this handout.",
        small,
    )
)

doc = SimpleDocTemplate(
    str(output_pdf),
    pagesize=letter,
    rightMargin=0.52 * inch,
    leftMargin=0.52 * inch,
    topMargin=0.48 * inch,
    bottomMargin=0.48 * inch,
)
doc.build(story)
public_pdf.write_bytes(output_pdf.read_bytes())
print(f"Wrote {output_pdf}")
print(f"Wrote {public_pdf}")
