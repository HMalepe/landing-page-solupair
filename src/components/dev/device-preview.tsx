import { useEffect, useMemo, useState } from "react";

/**
 * Dev-only device preview. Renders the current route inside an accurately sized
 * <iframe> for each device so real viewport-driven behaviour (Tailwind
 * breakpoints, matchMedia, the hero ball physics that read window.innerWidth)
 * responds correctly — unlike a CSS width hack.
 *
 * Visible when running the dev server, or on any build after visiting
 * `?devtools=1` once (persisted per-browser via localStorage; `?devtools=0`
 * turns it back off). Never shown to normal visitors, and it hides itself
 * inside its own preview iframe.
 */

type Device = {
  id: string;
  label: string;
  short: string;
  w: number;
  h: number;
};

const DEVICES: Device[] = [
  { id: "iphone-se", label: "iPhone SE", short: "SE", w: 375, h: 667 },
  { id: "iphone-15", label: "iPhone 15", short: "15", w: 393, h: 852 },
  { id: "pixel-8", label: "Pixel 8", short: "Px", w: 412, h: 915 },
  { id: "ipad-mini", label: "iPad mini", short: "mini", w: 768, h: 1024 },
  { id: "ipad-pro", label: "iPad Pro", short: "Pro", w: 1024, h: 1366 },
  { id: "laptop", label: "Laptop", short: "13″", w: 1280, h: 800 },
  { id: "desktop", label: "Desktop", short: "HD", w: 1440, h: 900 },
];

const TOOLBAR_H = 56;
const PAD = 24;
const STORAGE_KEY = "solupair:devtools";

export function DevicePreview() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [landscape, setLandscape] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [vp, setVp] = useState({ w: 1280, h: 800 });

  useEffect(() => {
    // Never surface inside our own preview iframe.
    if (window.self !== window.top) return;

    const params = new URLSearchParams(window.location.search);
    let on = Boolean(import.meta.env.DEV);
    if (params.has("devtools")) {
      on = params.get("devtools") !== "0";
      try {
        localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
      } catch {
        /* private mode */
      }
    } else {
      try {
        if (localStorage.getItem(STORAGE_KEY) === "1") on = true;
      } catch {
        /* private mode */
      }
    }

    setEnabled(on);
    setMounted(true);

    const onResize = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const device = useMemo(() => DEVICES.find((d) => d.id === deviceId) ?? null, [deviceId]);

  useEffect(() => {
    if (!device) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDeviceId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [device]);

  const src = useMemo(() => {
    if (!mounted) return "";
    // Reload the current route in the frame; strip the devtools flag so the
    // frame's own toggle stays hidden (the iframe guard already handles that).
    const url = new URL(window.location.href);
    url.searchParams.delete("devtools");
    return url.pathname + url.search + url.hash;
    // reloadKey participates so the Reload button forces a fresh document.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, reloadKey]);

  if (!mounted || !enabled) return null;

  const dims = device
    ? landscape
      ? { w: device.h, h: device.w }
      : { w: device.w, h: device.h }
    : null;

  const availW = vp.w - PAD * 2;
  const availH = vp.h - TOOLBAR_H - PAD * 2;
  const scale = dims ? Math.min(1, availW / dims.w, availH / dims.h) : 1;

  return (
    <>
      {/* Floating toggle (hidden while a device overlay is open) */}
      {!dims && (
        <div className="fixed bottom-4 right-4 z-[99998] flex flex-col items-end gap-2 font-sans">
          {open && (
            <div className="w-52 overflow-hidden rounded-2xl border border-white/12 bg-[#12131c]/95 p-1.5 shadow-2xl backdrop-blur">
              {DEVICES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDeviceId(d.id);
                    setLandscape(false);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm text-white/85 transition-colors hover:bg-white/10"
                >
                  <span>{d.label}</span>
                  <span className="text-xs tabular-nums text-white/40">
                    {d.w}×{d.h}
                  </span>
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full border border-white/15 bg-[#12131c]/95 px-4 py-2.5 text-sm font-semibold text-white shadow-2xl backdrop-blur transition-colors hover:bg-[#1b1d29]"
            aria-label="Toggle device preview"
          >
            <span aria-hidden>📱</span>
            Devices
          </button>
        </div>
      )}

      {/* Device overlay */}
      {dims && (
        <div className="fixed inset-0 z-[99999] flex flex-col bg-[#07080d]/92 font-sans backdrop-blur-sm">
          <div
            className="flex flex-none items-center gap-2 overflow-x-auto border-b border-white/10 px-3"
            style={{ height: TOOLBAR_H }}
          >
            <div className="flex items-center gap-1">
              {DEVICES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => {
                    setDeviceId(d.id);
                    setLandscape(false);
                  }}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                    d.id === deviceId
                      ? "bg-white/15 text-white"
                      : "text-white/55 hover:bg-white/8 hover:text-white/85"
                  }`}
                  title={`${d.label} · ${d.w}×${d.h}`}
                >
                  {d.short}
                </button>
              ))}
            </div>

            <div className="mx-1 h-6 w-px flex-none bg-white/12" />

            <button
              onClick={() => setLandscape((l) => !l)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              title="Rotate"
            >
              ⟳ Rotate
            </button>
            <button
              onClick={() => setReloadKey((k) => k + 1)}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              title="Reload frame"
            >
              ↻ Reload
            </button>

            <div className="ml-auto flex flex-none items-center gap-3 pr-1">
              <span className="text-xs tabular-nums text-white/45">
                {dims.w} × {dims.h} · {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setDeviceId(null)}
                className="rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/85 transition-colors hover:bg-white/10"
              >
                ✕ Close
              </button>
            </div>
          </div>

          <div
            className="flex flex-1 items-start justify-center overflow-auto"
            style={{ padding: PAD }}
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setDeviceId(null);
            }}
          >
            <div
              className="relative overflow-hidden rounded-[28px] shadow-[0_30px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/12"
              style={{ width: dims.w * scale, height: dims.h * scale }}
            >
              <iframe
                key={reloadKey}
                src={src}
                title="Device preview"
                style={{
                  width: dims.w,
                  height: dims.h,
                  border: 0,
                  background: "#000",
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
