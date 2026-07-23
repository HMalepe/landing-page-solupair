import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "..");

/** Upscale small brand assets for crisp retina header display. */
const WORDMARK_UPSCALE = 4;
const LOGO_MIN_LONG_EDGE = 1536;
/** Keep the full SOLUPAIR row (letters end ~46% down); everything below is the tagline. */
const WORDMARK_ROW_RATIO = 0.465;
/** Small horizontal-only breathing room (source px) so S and R never hug an edge. */
const WORDMARK_PAD_X = 5;

function knockOutPixels(data, threshold) {
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    if (luma < threshold) {
      data[i + 3] = 0;
      continue;
    }

    if (luma < threshold + 28) {
      const t = (luma - threshold) / 28;
      data[i + 3] = Math.round(255 * t);
    }
  }
}

async function exportPng(pipeline, output, { minWidth, minHeight } = {}) {
  let img = pipeline.trim({ threshold: 12 });

  if (minWidth || minHeight) {
    img = img.resize({
      width: minWidth,
      height: minHeight,
      fit: "inside",
      withoutEnlargement: false,
      kernel: sharp.kernel.lanczos3,
    });
  }

  const png = await img
    .sharpen({ sigma: 0.65, m1: 0.55, m2: 0.3, x1: 2, y2: 10, y3: 20 })
    .png({ compressionLevel: 6, effort: 10, palette: false })
    .toBuffer();

  writeFileSync(output, png);
  const meta = await sharp(png).metadata();
  console.log(`Wrote ${output} (${png.length} bytes, ${meta.width}x${meta.height}, alpha: ${meta.hasAlpha})`);
}

/** Knock out black/near-black background; keep neon strokes and white type. */
async function knockOutBackground(input, output, { threshold = 36, minWidth, minHeight } = {}) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  knockOutPixels(data, threshold);

  await exportPng(
    sharp(data, {
      raw: { width: info.width, height: info.height, channels: 4 },
    }),
    output,
    { minWidth, minHeight },
  );
}

/**
 * Build the "SOLUPAIR" wordmark. Unlike the logo, an aggressive trim here ate
 * the thin neon end-strokes (the S and the R's leg), so this crops just the
 * name row, knocks out the background, then pads with transparent margin and
 * only trims truly-empty border — nothing can clip a glyph.
 */
async function buildWordmark(input, output, { threshold = 30 } = {}) {
  const meta = await sharp(input).metadata();
  const srcW = meta.width ?? 1;
  const srcH = meta.height ?? 1;
  const up = WORDMARK_UPSCALE;
  const cW = srcW * up;
  const cropBot = Math.round(srcH * WORDMARK_ROW_RATIO) * up;

  const { data } = await sharp(input)
    .resize({ width: cW, height: srcH * up, kernel: sharp.kernel.lanczos3 })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Crop the name band (drop the tagline below it), keeping the FULL width.
  const cropped = Buffer.alloc(cW * cropBot * 4);
  data.copy(cropped, 0, 0, cW * cropBot * 4);
  knockOutPixels(cropped, threshold);

  const padX = WORDMARK_PAD_X * up;
  const transparent = { r: 0, g: 0, b: 0, alpha: 0 };
  const png = await sharp(cropped, { raw: { width: cW, height: cropBot, channels: 4 } })
    // Gentle trim clears only truly-empty border — it never eats the thin neon
    // end-strokes the way the old aggressive trim did — keeping letters full height.
    .trim({ threshold: 6 })
    .extend({ top: 0, bottom: 0, left: padX, right: padX, background: transparent })
    .sharpen({ sigma: 0.6 })
    .png({ compressionLevel: 6, effort: 10, palette: false })
    .toBuffer();

  writeFileSync(output, png);
  const m = await sharp(png).metadata();
  const summary = `${png.length} bytes, ${m.width}x${m.height}, alpha: ${m.hasAlpha}`;
  console.log(`Wrote ${output} (${summary})`);
}

const logoSource = join(root, "src/assets/solupair-logo-source.png");
if (existsSync(logoSource)) {
  await knockOutBackground(logoSource, join(root, "src/assets/solupair-logo.png"), {
    minWidth: LOGO_MIN_LONG_EDGE,
    minHeight: LOGO_MIN_LONG_EDGE,
  });
} else {
  console.warn(`Skip missing source: ${logoSource}`);
}

const wordmarkSource = join(root, "src/assets/solupair-wordmark-source.png");
if (existsSync(wordmarkSource)) {
  await buildWordmark(wordmarkSource, join(root, "src/assets/solupair-wordmark.png"));
} else {
  console.warn(`Skip missing source: ${wordmarkSource}`);
}
