from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "og-image.png"
LOGO_PATH = ROOT / "public" / "assets" / "bitcoin.png"
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

green_900 = "#063d2f"
green_500 = "#21a66b"
white = "#ffffff"
orange = "#f7931a"

draw.rectangle((0, 0, WIDTH, HEIGHT), fill=green_900)
draw.rectangle((0, 0, WIDTH, 24), fill=green_500)

topline = "#dff4e6"
soft_green = "#9bdcba"
box_fill = "#0b4a38"


def paste_logo(center: tuple[int, int], size: int) -> None:
    logo = Image.open(LOGO_PATH).convert("RGBA").resize((size, size), Image.Resampling.LANCZOS)
    left = int(center[0] - size / 2)
    top = int(center[1] - size / 2)
    image.paste(logo, (left, top), logo)

draw.text(
    (72, 72),
    "Square Bitcoin Savings Calculator",
    fill=topline,
    font=font(38, bold=True),
)
draw.text((72, 148), "Skip credit", fill=white, font=font(102, bold=True))
draw.text((72, 250), "card fees.", fill=white, font=font(118, bold=True))
draw.text((72, 418), "Accept Bitcoin.", fill=soft_green, font=font(76, bold=True))

draw.rounded_rectangle(
    (736, 110, 1112, 260),
    radius=18,
    fill=box_fill,
    outline=topline,
    width=4,
)
draw.text((778, 138), "Card", fill=topline, font=font(38, bold=True))
draw.text((778, 185), "2.6% + $0.15", fill=white, font=font(46, bold=True))

draw.rounded_rectangle(
    (736, 300, 1112, 450),
    radius=18,
    fill=box_fill,
    outline=orange,
    width=4,
)
paste_logo((790, 375), 82)
draw.text((850, 328), "Bitcoin", fill=topline, font=font(38, bold=True))
draw.text((850, 375), "0% in 2026", fill=white, font=font(46, bold=True))

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT)
print(f"Wrote {OUTPUT}")
