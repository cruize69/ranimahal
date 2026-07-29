/**
 * Turns the supplied apsara medallion into a web-ready logo.
 *
 * The source arrives as an opaque PNG on white. The site is near-black, so the
 * white has to go — but a plain "delete white pixels" pass would also punch
 * holes in her sari, the cloud highlights, and the pale swirls inside the
 * medallion. So the background is found by flood-filling inward from the
 * border: only white that is *connected to the edge* is removed, and white
 * enclosed by artwork is left alone.
 *
 * Usage: node scripts/prepare-logo.mjs <source.png> <out-dir>
 */

import sharp from "sharp";
import { mkdirSync } from "node:fs";
import path from "node:path";

const [, , SRC, OUT_DIR] = process.argv;
if (!SRC || !OUT_DIR) {
  console.error("usage: node scripts/prepare-logo.mjs <source.png> <out-dir>");
  process.exit(1);
}

// A pixel counts as background only if it is this bright on every channel.
// The gold rim is far darker, so the boundary lands cleanly on the rim.
const WHITE = 238;

const src = sharp(SRC).ensureAlpha();
const { width, height } = await src.metadata();
const raw = await src.raw().toBuffer();

const isWhite = (i) =>
  raw[i] >= WHITE && raw[i + 1] >= WHITE && raw[i + 2] >= WHITE;

// Flood fill from every border pixel; anything reached is outside the artwork.
const bg = new Uint8Array(width * height);
const stack = [];
for (let x = 0; x < width; x++) {
  stack.push(x, (height - 1) * width + x);
}
for (let y = 0; y < height; y++) {
  stack.push(y * width, y * width + width - 1);
}

while (stack.length) {
  const p = stack.pop();
  if (bg[p] || !isWhite(p * 4)) continue;
  bg[p] = 1;
  const x = p % width;
  const y = (p / width) | 0;
  if (x > 0) stack.push(p - 1);
  if (x < width - 1) stack.push(p + 1);
  if (y > 0) stack.push(p - width);
  if (y < height - 1) stack.push(p + width);
}

// Feather: a pixel bordering the background gets partial alpha, so the gold
// rim keeps a smooth edge instead of a stair-stepped one.
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const p = y * width + x;
    const a = p * 4 + 3;
    if (bg[p]) {
      raw[a] = 0;
      continue;
    }
    let neighbours = 0;
    let outside = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx < 0 || yy < 0 || xx >= width || yy >= height) continue;
        neighbours++;
        if (bg[yy * width + xx]) outside++;
      }
    }
    if (outside > 0) raw[a] = Math.round(255 * (1 - outside / neighbours));
  }
}

mkdirSync(OUT_DIR, { recursive: true });

const cut = sharp(raw, { raw: { width, height, channels: 4 } })
  .png()
  .trim({ threshold: 0 }); // crop away the now-transparent margin

const full = path.join(OUT_DIR, "apsara.png");
await cut.clone().toFile(full);

// A square, ink-backed version for social cards, where transparency is not
// honoured and the image is composited on whatever the platform chooses.
await sharp({
  create: {
    width: 1200,
    height: 1200,
    channels: 4,
    background: { r: 8, g: 7, b: 6, alpha: 1 },
  },
})
  .composite([{ input: await cut.clone().resize(980, 980, { fit: "inside" }).toBuffer() }])
  .png()
  .toFile(path.join(OUT_DIR, "apsara-square.png"));

const meta = await sharp(full).metadata();
console.log(`apsara.png         ${meta.width}x${meta.height} (trimmed, transparent)`);
console.log(`apsara-square.png  1200x1200 (on ink)`);
