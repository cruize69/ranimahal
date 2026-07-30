import sharp from "sharp";

const SRC = process.argv[2];
const OUT = process.argv[3];

const jobs = [
  // image_2.webp (2000x1127): tandoori chicken / saag paneer / dining room / copper bowls
  { file: "image_2.webp", w: 2000, h: 1127, quadrant: "tl", name: "tandoori-chicken-a" },
  { file: "image_2.webp", w: 2000, h: 1127, quadrant: "tr", name: "saag-paneer-a" },
  { file: "image_2.webp", w: 2000, h: 1127, quadrant: "bl", name: "dining-room" },
  { file: "image_2.webp", w: 2000, h: 1127, quadrant: "br", name: "curry-bowls-bar" },
  // image_3.webp (2000x1422): tandoori chicken / saag paneer+naan / wine / sauce+spices
  { file: "image_3.webp", w: 2000, h: 1422, quadrant: "tl", name: "tandoori-chicken-b" },
  { file: "image_3.webp", w: 2000, h: 1422, quadrant: "tr", name: "saag-paneer-b" },
  { file: "image_3.webp", w: 2000, h: 1422, quadrant: "bl", name: "wine-bottle" },
  { file: "image_3.webp", w: 2000, h: 1422, quadrant: "br", name: "sauce-spoon-spices" },
];

const INSET = 10; // trim the thin white grid divider

for (const job of jobs) {
  const halfW = job.w / 2;
  const halfH = job.h / 2;
  const left = job.quadrant.includes("l") ? INSET : halfW + INSET;
  const top = job.quadrant.includes("t") ? INSET : halfH + INSET;
  const width = halfW - INSET * 2;
  const height = halfH - INSET * 2;

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

// image_1.webp: the full thali platter tray, used as-is (no crop needed).
await sharp(`${SRC}/image_1.webp`)
  .png({ compressionLevel: 9, quality: 88 })
  .toFile(`${OUT}/thali-platter.png`);
console.log("thali-platter.png  <-  image_1.webp (full)");
