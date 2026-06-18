import QRCode from "qrcode";

const target =
  process.env.QR_TARGET_URL ||
  "https://orangedaddocs.github.io/square-bitcoin-savings-calculator/#/why-bitcoin";

await QRCode.toFile("public/qr-why-bitcoin.png", target, {
  errorCorrectionLevel: "H",
  margin: 2,
  width: 1000,
  color: {
    dark: "#063d2f",
    light: "#ffffff"
  }
});

console.log(`Generated public/qr-why-bitcoin.png -> ${target}`);
