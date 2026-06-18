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
draw.rectangle((0, 0, WIDTH, 160), fill=green_100)

card = (70, 72, WIDTH - 70, HEIGHT - 72)
shadow = (card[0] + 14, card[1] + 14, card[2] + 14, card[3] + 14)
draw.rounded_rectangle(shadow, radius=18, fill=green_500)
draw.rounded_rectangle(card, radius=18, fill=white, outline=ink, width=3)

mark = (104, 112, 204, 212)
draw.rounded_rectangle(mark, radius=18, fill=white, outline=green_900, width=4)
draw.text((137, 126), "B", fill=green_900, font=font(56, bold=True))
draw.line((154, 126, 154, 112), fill=orange, width=5)
draw.line((154, 212, 154, 226), fill=orange, width=5)

draw.text((232, 112), "Square Bitcoin", fill=ink, font=font(56, bold=True))
draw.text((104, 236), "Savings", fill=green_900, font=font(124, bold=True))
draw.text((104, 350), "Calculator", fill=green_900, font=font(124, bold=True))

draw.text(
    (108, 492),
    "Card fees vs Bitcoin fees",
    fill=ink,
    font=font(36, bold=True),
)

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
image.save(OUTPUT)
print(f"Wrote {OUTPUT}")
