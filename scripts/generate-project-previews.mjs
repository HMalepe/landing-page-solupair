import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, "..", "src", "assets", "projects");
await mkdir(outDir, { recursive: true });

const expirydeskHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", system-ui, sans-serif;
    background: #0b1220;
    color: #e8eef8;
    width: 1440px;
    height: 900px;
    overflow: hidden;
  }
  .shell { display: grid; grid-template-columns: 220px 1fr; height: 100%; }
  .nav {
    background: linear-gradient(180deg, #101a2e, #0b1220);
    border-right: 1px solid rgba(255,255,255,0.06);
    padding: 28px 18px;
  }
  .logo { font-weight: 800; font-size: 20px; letter-spacing: -0.03em; }
  .logo span { color: #2dd4bf; }
  .nav-item {
    margin-top: 10px; padding: 10px 12px; border-radius: 10px;
    font-size: 13px; color: #93a4bd;
  }
  .nav-item.active { background: rgba(45,212,191,0.12); color: #5eead4; }
  .main { padding: 28px 32px; background:
    radial-gradient(ellipse 60% 40% at 80% 0%, rgba(45,212,191,0.12), transparent 55%),
    #0b1220;
  }
  .top { display: flex; justify-content: space-between; align-items: end; margin-bottom: 22px; }
  .eyebrow { font-size: 11px; letter-spacing: 0.18em; text-transform: uppercase; color: #64748b; }
  h1 { font-size: 28px; font-weight: 750; letter-spacing: -0.03em; margin-top: 6px; }
  .pill {
    border: 1px solid rgba(45,212,191,0.35); color: #5eead4; background: rgba(45,212,191,0.08);
    border-radius: 999px; padding: 8px 14px; font-size: 12px; font-weight: 600;
  }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 18px; }
  .kpi {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 16px; padding: 16px 18px;
  }
  .kpi .label { font-size: 11px; color: #7c8da6; letter-spacing: 0.08em; text-transform: uppercase; }
  .kpi .value { font-size: 28px; font-weight: 750; margin-top: 8px; letter-spacing: -0.03em; }
  .kpi .sub { font-size: 12px; color: #64748b; margin-top: 4px; }
  .critical .value { color: #fb7185; }
  .risk .value { color: #fbbf24; }
  .ok .value { color: #34d399; }
  .panel {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07);
    border-radius: 18px; overflow: hidden;
  }
  .panel-h { display: flex; justify-content: space-between; align-items: center; padding: 16px 18px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .panel-h h2 { font-size: 15px; font-weight: 650; }
  .search {
    background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px; padding: 8px 12px; color: #94a3b8; font-size: 12px; min-width: 240px;
  }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; padding: 12px 18px; }
  td { padding: 14px 18px; border-top: 1px solid rgba(255,255,255,0.05); font-size: 13px; }
  .badge {
    display: inline-flex; border-radius: 999px; padding: 4px 10px; font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
  }
  .b-crit { background: rgba(251,113,133,0.15); color: #fb7185; }
  .b-risk { background: rgba(251,191,36,0.15); color: #fbbf24; }
  .b-safe { background: rgba(52,211,153,0.15); color: #34d399; }
  .muted { color: #94a3b8; }
</style>
</head>
<body>
  <div class="shell">
    <aside class="nav">
      <div class="logo">Expiry<span>Desk</span></div>
      <div class="nav-item active" style="margin-top:28px">Dashboard</div>
      <div class="nav-item">Inventory</div>
      <div class="nav-item">Alerts</div>
      <div class="nav-item">Write-offs</div>
      <div class="nav-item">Reports</div>
    </aside>
    <main class="main">
      <div class="top">
        <div>
          <div class="eyebrow">Riverside Pharmacy · 247 SKUs tracked</div>
          <h1>ExpiryDesk PRO</h1>
        </div>
        <div class="pill">Live inventory intelligence</div>
      </div>
      <div class="kpis">
        <div class="kpi critical"><div class="label">Write-offs</div><div class="value">R 2,840</div><div class="sub">3 lines this month</div></div>
        <div class="kpi risk"><div class="label">At risk</div><div class="value">R 14,920</div><div class="sub">8 lines ≤ 120 days</div></div>
        <div class="kpi ok"><div class="label">Recovered</div><div class="value">R 51,6k</div><div class="sub">12 lines saved</div></div>
        <div class="kpi"><div class="label">Inventory lines</div><div class="value">247</div><div class="sub">Critical 1 · At risk 8 · Safe 238</div></div>
      </div>
      <div class="panel">
        <div class="panel-h">
          <h2>Stock expiry board</h2>
          <div class="search">Search product, dose or batch…</div>
        </div>
        <table>
          <thead><tr><th>Product</th><th>Qty</th><th>Value</th><th>Expires</th><th>Status</th></tr></thead>
          <tbody>
            <tr><td>POLYGYNAX VAG CAPS <span class="muted">6 caps</span></td><td>14</td><td>R 4,872</td><td>12 Jun 2026</td><td><span class="badge b-crit">CRITICAL</span></td></tr>
            <tr><td>PANADO 500MG <span class="muted">Tablets</span></td><td>48</td><td>R 892</td><td>18 Aug 2026</td><td><span class="badge b-risk">AT RISK</span></td></tr>
            <tr><td>LOCOID CRELO 0.1% <span class="muted">30g</span></td><td>6</td><td>R 1,240</td><td>Nov 2027</td><td><span class="badge b-safe">SAFE</span></td></tr>
            <tr><td>SIMBRINZA EYE DROP <span class="muted">5ml</span></td><td>3</td><td>R 2,180</td><td>Mar 2028</td><td><span class="badge b-safe">SAFE</span></td></tr>
            <tr><td>ACC 200 EFF <span class="muted">25s</span></td><td>22</td><td>R 1,540</td><td>Sep 2026</td><td><span class="badge b-risk">AT RISK</span></td></tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>
</body>
</html>`;

const dashboardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: "Segoe UI", system-ui, sans-serif;
    width: 1440px; height: 900px; overflow: hidden; color: #0f172a;
    background: #f4f1ec;
  }
  .shell { display: grid; grid-template-columns: 240px 1fr; height: 100%; }
  .nav {
    background: #111827; color: #e5e7eb; padding: 28px 18px;
  }
  .brand {
    font-size: 22px; font-weight: 800; letter-spacing: -0.04em;
    background: linear-gradient(135deg, #22d3ee, #8b5cf6, #ec4899);
    -webkit-background-clip: text; background-clip: text; color: transparent;
  }
  .nav-item { margin-top: 8px; padding: 11px 12px; border-radius: 12px; font-size: 13px; color: #94a3b8; }
  .nav-item.active { background: rgba(139,92,246,0.18); color: #c4b5fd; }
  .main { padding: 28px 32px; }
  .top { display: flex; justify-content: space-between; align-items: end; margin-bottom: 22px; }
  .eyebrow { font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: #64748b; }
  h1 { font-size: 30px; font-weight: 800; letter-spacing: -0.04em; margin-top: 4px; }
  .live {
    display: inline-flex; align-items: center; gap: 8px; background: #fff; border: 1px solid #e2e8f0;
    border-radius: 999px; padding: 8px 14px; font-size: 12px; font-weight: 650;
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: #22c55e; box-shadow: 0 0 0 4px rgba(34,197,94,0.18); }
  .grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 16px; }
  .card {
    background: #fff; border: 1px solid #e8e4dc; border-radius: 18px; padding: 18px;
    box-shadow: 0 10px 30px rgba(15,23,42,0.04);
  }
  .card .label { font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #64748b; }
  .card .value { font-size: 30px; font-weight: 800; margin-top: 8px; letter-spacing: -0.03em; }
  .card .delta { margin-top: 6px; font-size: 12px; color: #059669; font-weight: 600; }
  .panel {
    background: #fff; border: 1px solid #e8e4dc; border-radius: 18px; padding: 18px;
    box-shadow: 0 10px 30px rgba(15,23,42,0.04); min-height: 420px;
  }
  .panel h2 { font-size: 15px; font-weight: 700; margin-bottom: 14px; }
  .bars { display: flex; align-items: end; gap: 10px; height: 220px; padding-top: 20px; }
  .bar { flex: 1; border-radius: 10px 10px 4px 4px; background: linear-gradient(180deg, #22d3ee, #8b5cf6); opacity: 0.9; }
  .row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-top: 1px solid #f1f5f9; }
  .row:first-of-type { border-top: 0; }
  .name { font-size: 13px; font-weight: 650; }
  .meta { font-size: 12px; color: #64748b; }
  .chip {
    font-size: 11px; font-weight: 700; border-radius: 999px; padding: 4px 10px;
    background: #ede9fe; color: #6d28d9;
  }
</style>
</head>
<body>
  <div class="shell">
    <aside class="nav">
      <div class="brand">Solupair</div>
      <div class="nav-item active" style="margin-top:28px">Live Pulse</div>
      <div class="nav-item">Bookings</div>
      <div class="nav-item">Revenue</div>
      <div class="nav-item">Staff</div>
      <div class="nav-item">Settings</div>
    </aside>
    <main class="main">
      <div class="top">
        <div>
          <div class="eyebrow">Glow Beauty Studio · MarineFlow</div>
          <h1>Live Pulse Dashboard</h1>
        </div>
        <div class="live"><span class="dot"></span> Live · updated just now</div>
      </div>
      <div class="cards">
        <div class="card"><div class="label">Today's bookings</div><div class="value">28</div><div class="delta">+18% vs last Friday</div></div>
        <div class="card"><div class="label">Revenue</div><div class="value">R 12,460</div><div class="delta">+R 1,840 recovered no-shows</div></div>
        <div class="card"><div class="label">Staff utilisation</div><div class="value">86%</div><div class="delta">4 stylists on floor</div></div>
      </div>
      <div class="grid">
        <div class="panel">
          <h2>Weekly booking rhythm</h2>
          <div class="bars">
            <div class="bar" style="height:42%"></div>
            <div class="bar" style="height:58%"></div>
            <div class="bar" style="height:51%"></div>
            <div class="bar" style="height:73%"></div>
            <div class="bar" style="height:66%"></div>
            <div class="bar" style="height:88%"></div>
            <div class="bar" style="height:47%"></div>
          </div>
        </div>
        <div class="panel">
          <h2>Next up</h2>
          <div class="row"><div><div class="name">Thandi · Balayage</div><div class="meta">14:00 · Maya</div></div><span class="chip">Confirmed</span></div>
          <div class="row"><div><div class="name">Jordan · Fade + beard</div><div class="meta">14:30 · Leo</div></div><span class="chip">WhatsApp</span></div>
          <div class="row"><div><div class="name">Priya · Gel set</div><div class="meta">15:00 · Aisha</div></div><span class="chip">Confirmed</span></div>
          <div class="row"><div><div class="name">Sam · Colour refresh</div><div class="meta">15:45 · Maya</div></div><span class="chip">Reminder sent</span></div>
          <div class="row"><div><div class="name">Alex · Consultation</div><div class="meta">16:15 · Front desk</div></div><span class="chip">New</span></div>
        </div>
      </div>
    </main>
  </div>
</body>
</html>`;

const whatsappHtml = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1440px; height: 900px; overflow: hidden;
    font-family: "Segoe UI", system-ui, sans-serif;
    background:
      radial-gradient(ellipse 50% 45% at 20% 20%, rgba(34,211,238,0.18), transparent 55%),
      radial-gradient(ellipse 45% 40% at 80% 70%, rgba(236,72,153,0.16), transparent 50%),
      #0a0a12;
    display: grid; place-items: center;
  }
  .stage {
    display: grid; grid-template-columns: 1.05fr 0.95fr; gap: 48px; align-items: center;
    width: 1200px;
  }
  .copy h1 {
    font-size: 54px; line-height: 0.95; letter-spacing: -0.05em; font-weight: 850; color: #fff;
  }
  .copy p { margin-top: 18px; color: rgba(255,255,255,0.62); font-size: 16px; line-height: 1.55; max-width: 420px; }
  .chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
  .chip {
    border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.05);
    color: #e2e8f0; border-radius: 999px; padding: 8px 14px; font-size: 12px; font-weight: 650;
  }
  .phone {
    width: 360px; height: 720px; border-radius: 42px; padding: 12px;
    background: linear-gradient(160deg, #2a2a35, #111118);
    box-shadow:
      0 40px 100px rgba(0,0,0,0.55),
      0 0 0 1px rgba(255,255,255,0.08),
      inset 0 0 0 1px rgba(255,255,255,0.05);
    justify-self: end;
  }
  .screen {
    height: 100%; border-radius: 32px; overflow: hidden; display: flex; flex-direction: column;
    background: #0b141a;
  }
  .wa-header {
    background: #1f2c34; padding: 16px 16px 14px; display: flex; align-items: center; gap: 12px;
  }
  .avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, #22d3ee, #8b5cf6, #ec4899);
  }
  .wa-header .title { color: #e9edef; font-weight: 700; font-size: 15px; }
  .wa-header .sub { color: #8696a0; font-size: 12px; margin-top: 2px; }
  .chat {
    flex: 1; padding: 18px 14px; background:
      linear-gradient(180deg, rgba(11,20,26,0.92), rgba(11,20,26,0.92)),
      repeating-linear-gradient(0deg, transparent, transparent 18px, rgba(255,255,255,0.015) 19px);
    display: flex; flex-direction: column; gap: 10px;
  }
  .bubble {
    max-width: 86%; padding: 10px 12px; border-radius: 12px; font-size: 13.5px; line-height: 1.45;
  }
  .in { align-self: flex-start; background: #202c33; color: #e9edef; border-top-left-radius: 4px; }
  .out { align-self: flex-end; background: #005c4b; color: #e9edef; border-top-right-radius: 4px; }
  .time { display: block; text-align: right; margin-top: 6px; font-size: 10px; color: rgba(233,237,239,0.55); }
  .quick {
    display: flex; flex-wrap: wrap; gap: 6px; margin-top: 2px;
  }
  .q {
    border: 1px solid #00a884; color: #00a884; border-radius: 999px; padding: 6px 10px; font-size: 11px; font-weight: 650;
    background: rgba(0,168,132,0.08);
  }
  .composer {
    background: #1f2c34; padding: 10px 12px; display: flex; gap: 8px; align-items: center;
  }
  .composer .field {
    flex: 1; background: #2a3942; border-radius: 22px; padding: 10px 14px; color: #8696a0; font-size: 13px;
  }
  .send {
    width: 40px; height: 40px; border-radius: 50%; background: #00a884; display: grid; place-items: center; color: white; font-weight: 800;
  }
</style>
</head>
<body>
  <div class="stage">
    <div class="copy">
      <h1>WhatsApp<br/>Booking Agent</h1>
      <p>Customers book, reschedule, ask FAQs and get reminders automatically — without staff living in the inbox.</p>
      <div class="chips">
        <div class="chip">24/7 booking</div>
        <div class="chip">Auto reminders</div>
        <div class="chip">FAQ answers</div>
        <div class="chip">Staff handoff</div>
      </div>
    </div>
    <div class="phone">
      <div class="screen">
        <div class="wa-header">
          <div class="avatar"></div>
          <div>
            <div class="title">Glow Beauty Studio</div>
            <div class="sub">online · booking agent</div>
          </div>
        </div>
        <div class="chat">
          <div class="bubble in">Hi! I'd like to book a balayage for Saturday afternoon ✨<div class="time">14:02</div></div>
          <div class="bubble out">Welcome to Glow Beauty Studio — I can help with that. Which stylist do you prefer?<div class="time">14:02</div></div>
          <div class="quick"><span class="q">Maya</span><span class="q">Aisha</span><span class="q">Any available</span></div>
          <div class="bubble in">Maya please<div class="time">14:03</div></div>
          <div class="bubble out">Perfect. Maya has Sat 14:00 or 15:30. Which works?<div class="time">14:03</div></div>
          <div class="bubble in">14:00 🙌<div class="time">14:04</div></div>
          <div class="bubble out">Booked — Sat 14:00 with Maya (Balayage). I'll send a reminder the day before.<div class="time">14:04</div></div>
        </div>
        <div class="composer">
          <div class="field">Type a message</div>
          <div class="send">↑</div>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
});

async function shot(name, html) {
  const page = await context.newPage();
  await page.setContent(html, { waitUntil: "load" });
  await page.waitForTimeout(200);
  const file = path.join(outDir, `${name}.jpg`);
  await page.screenshot({ path: file, type: "jpeg", quality: 88 });
  console.log("saved", file);
  await page.close();
}

await shot("expirydesk", expirydeskHtml);
await shot("dashboard", dashboardHtml);
await shot("whatsapp", whatsappHtml);

// Also try a deeper crop of the live marketing sites for authenticity.
const livePage = await context.newPage();
try {
  await livePage.goto("https://expirydesk.co.za", { waitUntil: "networkidle", timeout: 45000 });
  await livePage.waitForTimeout(1500);
  await livePage.evaluate(() => window.scrollTo(0, 520));
  await livePage.waitForTimeout(800);
  await livePage.screenshot({
    path: path.join(outDir, "expirydesk-live.jpg"),
    type: "jpeg",
    quality: 88,
  });
  console.log("saved expirydesk-live");
} catch (e) {
  console.log("live expirydesk skip", e.message);
}
await livePage.close();

await browser.close();
await writeFile(path.join(outDir, ".gitkeep"), "");
