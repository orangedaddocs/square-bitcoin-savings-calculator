from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
qr_path = ROOT / "public" / "qr-why-bitcoin.png"
logo_path = ROOT / "public" / "assets" / "bitcoin.png"

qr = Image.open(qr_path).convert("RGBA")
logo = Image.open(logo_path).convert("RGBA")

size = qr.size[0]
badge_size = int(size * 0.27)
badge_left = (size - badge_size) // 2
badge_top = (size - badge_size) // 2

draw = ImageDraw.Draw(qr)
ring_padding = int(size * 0.018)
ring_box = (
    badge_left - ring_padding,
    badge_top - ring_padding,
    badge_left + badge_size + ring_padding,
    badge_top + badge_size + ring_padding,
)
draw.ellipse(ring_box, fill="#ffffff")

logo = logo.resize((badge_size, badge_size), Image.Resampling.LANCZOS)
qr.alpha_composite(logo, (badge_left, badge_top))

qr.save(qr_path)
print(f"Embedded Wikimedia Bitcoin logo in {qr_path}")
