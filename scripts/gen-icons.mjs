import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const SRC = "src/assets/logo-mark.png";
const PUB = "public";
const APP = "src/assets";

const NAVY = { r: 26, g: 29, b: 33, alpha: 1 };
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };

const alphaBBox = async () => {
  const { data, info } = await sharp(SRC)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H, channels: C } = info;
  let minX = W, minY = H, maxX = 0, maxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (data[(y * W + x) * C + 3] > 16) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  return { left: minX, top: minY, width: maxX - minX + 1, height: maxY - minY + 1 };
};

const makeIcon = async (size, ratio, background, out) => {
  const content = Math.round(size * ratio);
  const mark = await sharp(SRC)
    .extract(bbox)
    .resize(content, content, { fit: "inside", background: CLEAR })
    .png()
    .toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: mark, gravity: "center" }])
    .png({ compressionLevel: 9 })
    .toFile(out);
  console.log("  ", out, `${size}x${size}`);
};

const bbox = await alphaBBox();
console.log("mark bbox:", bbox);

await mkdir(PUB, { recursive: true });
await mkdir(APP, { recursive: true });

console.log("transparent icons:");
await makeIcon(16, 0.94, CLEAR, `${PUB}/favicon-16.png`);
await makeIcon(32, 0.94, CLEAR, `${PUB}/favicon-32.png`);
await makeIcon(96, 0.9, CLEAR, `${PUB}/favicon-96.png`);
await makeIcon(192, 0.88, CLEAR, `${PUB}/icon-192.png`);
await makeIcon(512, 0.88, CLEAR, `${PUB}/icon-512.png`);

console.log("solid-background icons (#1a1d21):");
await makeIcon(180, 0.72, NAVY, `${PUB}/apple-touch-icon.png`);
await makeIcon(512, 0.66, NAVY, `${PUB}/maskable-512.png`);

console.log("in-app mark:");
await makeIcon(512, 0.9, CLEAR, `${APP}/mark.png`);

console.log("done.");
