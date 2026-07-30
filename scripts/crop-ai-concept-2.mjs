import sharp from "sharp";

const SRC = process.argv[2];
const OUT = process.argv[3];

// { file, gridW, gridH, quadrant, name, extraTop, extraBottom, extraLeft }
// extra* trims additional % of the cell dimension beyond the standard inset,
// to cut off the fabricated tray-rim engravings where they fall within a
// given quadrant (some wrap around two edges of the plate's rim at once).
const jobs = [
  { file: "image_2.webp", gridW: 1215, gridH: 864, quadrant: "tr", name: "fish-whole", extraBottom: 0.26 },
  { file: "image_2.webp", gridW: 1215, gridH: 864, quadrant: "bl", name: "bar-bowls-wine-2" },
  // extraRight: trims the small watermark-style sparkle icon out of the bottom-right corner.
  { file: "image_2.webp", gridW: 1215, gridH: 864, quadrant: "br", name: "lamb-kadai-naan", extraRight: 0.2 },
  { file: "image_3.webp", gridW: 1215, gridH: 864, quadrant: "tl", name: "aloo-gobi", extraTop: 0.15 },
  { file: "image_3.webp", gridW: 1215, gridH: 864, quadrant: "bl", name: "dal-makhani" },
  { file: "image_3.webp", gridW: 1215, gridH: 864, quadrant: "br", name: "cocktail-samosas-bar" },
  // extraTop/extraLeft/extraBottom: the "RANI MA[HAL]" engraved plank corner
  // wraps this quadrant's top-left AND bottom-left, needs all three trimmed.
  {
    file: "image_4.webp",
    gridW: 2000,
    gridH: 1422,
    quadrant: "tl",
    name: "butter-chicken-kadai",
    extraTop: 0.14,
    extraLeft: 0.14,
    extraBottom: 0.14,
  },
  {
    file: "image_4.webp",
    gridW: 2000,
    gridH: 1422,
    quadrant: "tr",
    name: "tandoori-chicken-c",
    extraTop: 0.22,
    extraLeft: 0.16,
    extraBottom: 0.16,
  },
  { file: "image_4.webp", gridW: 2000, gridH: 1422, quadrant: "bl", name: "veg-curry-beans" },
  // extraRight: same watermark sparkle icon as lamb-kadai-naan, bottom-right corner.
  { file: "image_4.webp", gridW: 2000, gridH: 1422, quadrant: "br", name: "saag-paneer-closeup", extraRight: 0.18 },
];

const INSET = 10;

for (const job of jobs) {
  const halfW = job.gridW / 2;
  const halfH = job.gridH / 2;
  const extraTopPx = (job.extraTop ?? 0) * halfH;
  const extraBottomPx = (job.extraBottom ?? 0) * halfH;
  const extraLeftPx = (job.extraLeft ?? 0) * halfW;
  const extraRightPx = (job.extraRight ?? 0) * halfW;

  const left = (job.quadrant.includes("l") ? INSET : halfW + INSET) + extraLeftPx;
  const top = (job.quadrant.includes("t") ? INSET : halfH + INSET) + extraTopPx;
  const width = halfW - INSET * 2 - extraLeftPx - extraRightPx;
  const height = halfH - INSET * 2 - extraTopPx - extraBottomPx;

  await sharp(`${SRC}/${job.file}`)
    .extract({
      left: Math.round(left),
      top: Math.round(top),
      width: Math.round(width),
      height: Math.round(height),
    })
    .png({ compressionLevel: 9, quality: 88 })
    .toFile(`${OUT}/${job.name}.png`);
  console.log(`${job.name}.png  <-  ${job.file} ${job.quadrant}`);
}

// image_5.webp: the wide full tablescape, used as-is for a full-bleed band.
await sharp(`${SRC}/image_5.webp`)
  .png({ compressionLevel: 9, quality: 88 })
  .toFile(`${OUT}/thali-tray-wide.png`);
console.log("thali-tray-wide.png  <-  image_5.webp (full)");
