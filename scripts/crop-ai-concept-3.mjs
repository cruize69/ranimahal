import sharp from "sharp";

const SRC = process.argv[2];
const OUT = process.argv[3];

// Third pass: picks up quadrants missed by the first two crop scripts —
// image_2's "tl" and image_3's "tr" (fabricated rim text needed extra trim
// that was worked out after those files' other quadrants were already
// cropped), plus image_6, a bordered/matted 2x2 grid that was never
// processed at all. image_6's mat/border needs a much bigger base inset
// than the plain grids, hence the per-job `inset` override.
const jobs = [
  { file: "image_2.webp", gridW: 1215, gridH: 864, quadrant: "tl", name: "thali-tray-bowls", extraTop: 0.22 },
  { file: "image_3.webp", gridW: 1215, gridH: 864, quadrant: "tr", name: "tandoori-chicken-d", extraTop: 0.25, extraLeft: 0.12, extraBottom: 0.3 },
  { file: "image_6.webp", gridW: 2000, gridH: 1422, quadrant: "tr", name: "bar-table-spread", inset: 70 },
  { file: "image_6.webp", gridW: 2000, gridH: 1422, quadrant: "bl", name: "table-fish-tandoori", inset: 70 },
  // extraRight: same watermark sparkle icon seen elsewhere, bottom-right corner.
  { file: "image_6.webp", gridW: 2000, gridH: 1422, quadrant: "br", name: "lamb-kadai-table", inset: 70, extraTop: 0.28, extraRight: 0.15 },
];

for (const job of jobs) {
  const INSET = job.inset ?? 10;
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
