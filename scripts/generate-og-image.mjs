import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");

const WIDTH = 1200;
const HEIGHT = 630;

const wordmarkBase64 = readFileSync(join(root, "src/assets/solupair-wordmark.png")).toString(
  "base64",
);
const fontBase64 = readFileSync(
  join(root, "node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2"),
).toString("base64");

// Brand tokens from src/styles.css — hardcoded here since this runs outside
// the app's own CSS pipeline (no CSS custom properties available).
const BG_DEEP = "#07051c";
const BG_MAIN = "#10083a";
const BRAND_CYAN = "#22e6f2";
const BRAND_PINK = "#ff4fd8";
const BRAND_PURPLE = "#6b35ff";

const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<style>
  @font-face {
    font-family: "Geist";
    src: url(data:font/woff2;base64,${fontBase64}) format("woff2");
    font-weight: 100 900;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: ${WIDTH}px;
    height: ${HEIGHT}px;
    background: ${BG_DEEP};
    font-family: "Geist", ui-sans-serif, system-ui, sans-serif;
    overflow: hidden;
  }
  .card {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, ${BG_DEEP} 0%, ${BG_MAIN} 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 88px;
  }
  .glow {
    position: absolute;
    border-radius: 50%;
    filter: blur(90px);
    opacity: 0.55;
  }
  .glow--cyan { width: 520px; height: 520px; left: -140px; top: -160px; background: ${BRAND_CYAN}; }
  .glow--pink { width: 480px; height: 480px; right: -120px; bottom: -140px; background: ${BRAND_PINK}; }
  .glow--purple { width: 360px; height: 360px; right: 260px; top: -120px; background: ${BRAND_PURPLE}; opacity: 0.35; }
  .wordmark { position: relative; height: 56px; margin-bottom: 48px; }
  .headline {
    position: relative;
    font-weight: 800;
    font-size: 66px;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: #ffffff;
    text-transform: uppercase;
    max-width: 920px;
  }
  .headline .accent {
    background: linear-gradient(92deg, ${BRAND_CYAN} 0%, ${BRAND_PINK} 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  .eyebrow {
    position: relative;
    margin-top: 32px;
    font-size: 22px;
    font-weight: 600;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.68);
  }
  .eyebrow .sep { margin: 0 14px; color: rgba(34,230,242,0.55); }
</style>
</head>
<body>
  <div class="card">
    <div class="glow glow--cyan"></div>
    <div class="glow glow--pink"></div>
    <div class="glow glow--purple"></div>
    <img class="wordmark" src="data:image/png;base64,${wordmarkBase64}" />
    <div class="headline">BOOKINGS <span class="accent">HANDLED</span><br />WHILE YOU TREAT</div>
    <div class="eyebrow">WhatsApp<span class="sep">·</span>Automation<span class="sep">·</span>Websites<span class="sep">·</span>Dashboards</div>
  </div>
</body>
</html>`;

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH || "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  args: ["--no-sandbox"],
});
const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
await page.setContent(html);
await page.waitForTimeout(150); // let the embedded font settle before capture
const buffer = await page.screenshot({ type: "png" });
writeFileSync(join(root, "public/og-image.png"), buffer);
await browser.close();

console.log(`Wrote public/og-image.png (${WIDTH}x${HEIGHT})`);
