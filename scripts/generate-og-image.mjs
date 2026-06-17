import sharp from "sharp";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const W = 1200;
const H = 630;

// Navy gradient background
const svgBg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0a1628"/>
      <stop offset="50%" stop-color="#0f1f3d"/>
      <stop offset="100%" stop-color="#162d5a"/>
    </linearGradient>
    <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d4a843"/>
      <stop offset="100%" stop-color="#f5d77b"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <!-- decorative circles -->
  <circle cx="1000" cy="100" r="300" fill="#d4a843" opacity="0.06"/>
  <circle cx="200" cy="500" r="250" fill="#d4a843" opacity="0.04"/>
  <circle cx="600" cy="315" r="400" fill="#d4a843" opacity="0.03"/>
</svg>`;

async function main() {
  // Resize logo to ~200px height
  const logo = sharp(path.join(root, "src/assets/1.png"));
  const logoMeta = await logo.metadata();
  const logoH = 200;
  const logoW = Math.round(logoMeta.width * (logoH / logoMeta.height));
  const logoResized = await logo.resize(logoW, logoH).png().toBuffer();

  // Create background
  const bg = await sharp(Buffer.from(svgBg)).png().toBuffer();

  // Composite logo onto background (center horizontally, upper third vertically)
  const logoX = Math.round((W - logoW) / 2);
  const logoY = 100;
  const overlay = await sharp(bg)
    .composite([{ input: logoResized, top: logoY, left: logoX }])
    .png()
    .toBuffer();

  // Now add text via SVG overlay
  const accentColor = "#d4a843";
  const textSvg = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title { fill: #ffffff; font-family: 'Arial', 'Helvetica', sans-serif; font-weight: 800; font-size: 48px; text-anchor: middle; }
    .sub { fill: ${accentColor}; font-family: 'Arial', 'Helvetica', sans-serif; font-weight: 700; font-size: 20px; text-anchor: middle; letter-spacing: 4px; }
    .tagline { fill: rgba(255,255,255,0.6); font-family: 'Arial', 'Helvetica', sans-serif; font-weight: 400; font-size: 15px; text-anchor: middle; }
  </style>
  <text x="600" y="380" class="title">FutureKeys Music Academy</text>
  <text x="600" y="430" class="sub">PREMIUM MUSIC LESSONS</text>
  <text x="600" y="470" class="tagline">Piano · Guitar · Drums · Violin · Voice | Uyo, Nigeria &amp; Worldwide</text>
</svg>`;

  const textOverlay = await sharp(Buffer.from(textSvg)).png().toBuffer();

  // Merge text overlay
  const final = await sharp(overlay)
    .composite([{ input: textOverlay, top: 0, left: 0 }])
    .jpeg({ quality: 95 })
    .toFile(path.join(root, "public/og-image.jpg"));

  console.log(`✅ Generated og-image.jpg (${final.width}x${final.height}, ${final.size} bytes)`);
}

main().catch((err) => {
  console.error("Failed to generate OG image:", err);
  process.exit(1);
});
