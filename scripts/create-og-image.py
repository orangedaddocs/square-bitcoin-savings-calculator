from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "og-image.png"
WIDTH = 1200
HEIGHT = 630


def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    candidates = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial Bold.ttf" if bold else "/Library/Fonts/Arial.ttf",
    ]
    for path in candidates:
        if Path(path).exists():
            return ImageFont.truetype(path, size=size)
    return ImageFont.load_default()


image = Image.new("RGB", (WIDTH, HEIGHT), "#f8faf6")
draw = ImageDraw.Draw(image)

ink = "#080b09"
muted = "#5e6760"
green_900 = "#063d2f"
green_500 = "#21a66b"
green_100 = "#e4f5e9"
orange = "#f7931a"
white = "#ffffff"
line = "#dce5dd"

draw.rectangle((0, 0, WIDTH, HEIGHT), fill="#f8faf6")
draw.rectangle((0, 0, WIDTH, 170), fill=green_100)

card = (70, 72, WIDTH - 70, HEIGHT - 72)
shadow = (card[0] + 14, card[1] + 14, card[2] + 14, card[3] + 14)
draw.rounded_rectangle(shadow, radius=18, fill=green_500)
draw.rounded_rectangle(card, radius=18, fill=white, outline=ink, width=3)

mark = (112, 118, 220, 226)
draw.rounded_rectangle(mark, radius=18, fill=white, outline=green_900, width=4)
draw.text((146, 136), "B", fill=green_900, font=font(58, bold=True))
draw.line((169, 132, 169, 118), fill=orange, width=5)
draw.line((169, 226, 169, 240), fill=orange, width=5)

draw.text((250, 118), "Square Bitcoin", fill=ink, font=font(44, bold=True))
draw.text((250, 170), "Savings Calculator", fill=green_900, font=font(76, bold=True))

draw.text(
    (112, 300),
    "Show merchants what they save",
    fill=ink,
    font=font(38),
)
draw.text(
    (112, 350),
    "when they turn on Bitcoin payments.",
    fill=ink,
    font=font(38),
)

badge_y = 438
badges = [("0% in 2026", 112), ("1% in 2027", 352), ("No chargebacks", 582)]
for text, x in badges:
    text_bbox = draw.textbbox((0, 0), text, font=font(30, bold=True))
    badge_w = text_bbox[2] - text_bbox[0] + 46
    draw.rounded_rectangle(
        (x, badge_y, x + badge_w, badge_y + 62),
        radius=31,
        fill=green_100,
        outline=line,
        width=2,
    )
    draw.text((x + 23, badge_y + 14), text, fill=green_900, font=font(30, bold=True))

draw.text(
    (112, 516),
    "orangedaddocs.github.io/square-bitcoin-savings-calculator",
    fill=muted,
    font=font(24, bold=True),
)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT)
print(f"Wrote {OUTPUT}")
