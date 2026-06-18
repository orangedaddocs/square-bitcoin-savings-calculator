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
green_900 = "#063d2f"
green_500 = "#21a66b"
white = "#ffffff"

draw.rectangle((0, 0, WIDTH, HEIGHT), fill=green_900)
draw.rectangle((0, 0, WIDTH, 24), fill=green_500)

topline = "#dff4e6"
soft_green = "#9bdcba"
box_fill = "#0b4a38"

draw.text(
    (72, 72),
    "Square Bitcoin Savings Calculator",
    fill=topline,
    font=font(38, bold=True),
)
draw.text((72, 148), "Skip credit", fill=white, font=font(102, bold=True))
draw.text((72, 250), "card fees.", fill=white, font=font(118, bold=True))
draw.text((72, 418), "Accept Bitcoin.", fill=soft_green, font=font(76, bold=True))

for top, label, value in ((128, "Card", "2.6% + 15c"), (292, "Bitcoin", "0% in 2026")):
    draw.rounded_rectangle(
        (782, top, 1086, top + 118),
        radius=14,
        fill=box_fill,
        outline=topline,
        width=3,
    )
    draw.text((818, top + 25), label, fill=topline, font=font(32, bold=True))
    draw.text((818, top + 63), value, fill=white, font=font(39, bold=True))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT)
print(f"Wrote {OUTPUT}")
