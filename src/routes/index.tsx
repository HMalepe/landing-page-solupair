import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { LEGAL_NAME, SITE_TAGLINE, pageHead } from "@/lib/site";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () =>
    pageHead({
      title: `${LEGAL_NAME} — ${SITE_TAGLINE}`,
      description: `${LEGAL_NAME} — Design & software rooted in South Africa. Product UI, brand, and code from R5k.`,
      path: "/",
    }),
});

const NAV = [
  { label: "Services", to: "/services" },
  { label: "Work", to: "/work" },
  { label: "About", to: "/about" },
  { label: "Process", to: "/process" },
] as const;

/* ─── Brand mark ─────────────────────────────────────────────────── */
function SolupairMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
      <rect width="28" height="28" rx="8" fill="#111" />
      {/* Two arcs = "pairing" / growth metaphor */}
      <path
        d="M8.5 20C8.5 20 9 9.5 14 9.5C19 9.5 19.5 20 19.5 20"
        stroke="white"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M11.5 20C11.5 20 12 14.5 14 14.5C16 14.5 16.5 20 16.5 20"
        stroke="white"
        strokeOpacity="0.4"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ─── Partner / tool logo SVGs ───────────────────────────────────── */
function FigmaIcon() {
  return (
    <svg width="12" height="18" viewBox="0 0 10 15" fill="none" aria-hidden="true">
      <path d="M2.5 15C3.88 15 5 13.88 5 12.5V10H2.5C1.12 10 0 11.12 0 12.5C0 13.88 1.12 15 2.5 15Z" fill="white" fillOpacity="0.9" />
      <path d="M0 7.5C0 6.12 1.12 5 2.5 5H5V10H2.5C1.12 10 0 8.88 0 7.5Z" fill="white" fillOpacity="0.7" />
      <path d="M0 2.5C0 1.12 1.12 0 2.5 0H5V5H2.5C1.12 5 0 3.88 0 2.5Z" fill="white" fillOpacity="0.55" />
      <path d="M5 0H7.5C8.88 0 10 1.12 10 2.5C10 3.88 8.88 5 7.5 5H5V0Z" fill="white" fillOpacity="0.75" />
      <path d="M10 7.5C10 8.88 8.88 10 7.5 10C6.12 10 5 8.88 5 7.5C5 6.12 6.12 5 7.5 5C8.88 5 10 6.12 10 7.5Z" fill="white" fillOpacity="0.9" />
    </svg>
  );
}

function VercelIcon() {
  return (
    <svg width="16" height="14" viewBox="0 0 76 65" fill="white" fillOpacity="0.9" aria-hidden="true">
      <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
    </svg>
  );
}

function SupabaseIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 109 113" fill="none" aria-hidden="true">
      <path
        d="M63.7 110.3c-2.9 3.6-8.7 1.6-8.7-3L54 40h45.2c8.2 0 12.8 9.5 7.7 15.9L63.7 110.3z"
        fill="white"
        fillOpacity="0.85"
      />
      <path
        d="M45.3 2.1c2.9-3.6 8.7-1.6 8.7 3l.4 67.3H9.3C1.1 72.4-3.5 62.9 1.6 56.5L45.3 2.1z"
        fill="white"
        fillOpacity="0.55"
      />
    </svg>
  );
}

function TailwindIcon() {
  return (
    <svg width="20" height="13" viewBox="0 0 54 33" fill="white" fillOpacity="0.85" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M27 0C19.8 0 15.3 3.6 13.5 10.8C16.2 7.2 19.35 5.85 22.95 6.75C25 7.26 26.47 8.75 28.1 10.4C30.74 13.09 33.81 16.2 40.5 16.2C47.7 16.2 52.2 12.6 54 5.4C51.3 9 48.15 10.35 44.55 9.45C42.5 8.94 41.03 7.45 39.4 5.8C36.76 3.11 33.69 0 27 0ZM13.5 16.2C6.3 16.2 1.8 19.8 0 27C2.7 23.4 5.85 22.05 9.45 22.95C11.5 23.46 12.97 24.95 14.6 26.6C17.24 29.29 20.31 32.4 27 32.4C34.2 32.4 38.7 28.8 40.5 21.6C37.8 25.2 34.65 26.55 31.05 25.65C29 25.14 27.53 23.65 25.9 22C23.26 19.31 20.19 16.2 13.5 16.2Z"
      />
    </svg>
  );
}

const PARTNERS = [
  { icon: <FigmaIcon />, name: "Figma", cls: "font-bold text-[15px]" },
  { icon: <VercelIcon />, name: "Vercel", cls: "font-semibold text-[15px]" },
  { icon: <SupabaseIcon />, name: "Supabase", cls: "font-medium text-[16px]" },
  { icon: <TailwindIcon />, name: "Tailwind CSS", cls: "font-medium text-[15px]" },
];

/* ─── Floating navbar ─────────────────────────────────────────────── */
function FloatingNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="absolute inset-x-0 top-6 z-50 flex justify-center px-4">
      <div className="relative w-full max-w-[800px]">

        {/* Pill */}
        <div className="flex items-center justify-between rounded-full bg-white/95 pl-5 pr-2 py-1.5 backdrop-blur-md shadow-[0_4px_32px_rgba(0,0,0,0.14)]">

          {/* Left — brand */}
          <Link to="/" className="flex shrink-0 items-center gap-2.5">
            <SolupairMark />
            <span className="text-[15px] font-bold tracking-tight text-black">solupair</span>
          </Link>

          {/* Center — links (desktop) */}
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="text-[13px] font-medium text-gray-700 transition-colors duration-150 hover:text-black"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          {/* Right — CTAs */}
          <div className="flex items-center gap-1">
            <Link
              to="/contact"
              className="hidden items-center px-3 py-2 text-[13px] font-medium text-gray-700 transition-colors hover:text-black md:inline-flex"
            >
              Log in
            </Link>
            <Link
              to="/contact"
              className="rounded-full bg-[#111111] px-5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-black"
            >
              Sign up
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              className="ml-1.5 flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
            >
              {open
                ? <X size={15} className="text-gray-800" />
                : <Menu size={15} className="text-gray-800" />}
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        {open && (
          <div className="absolute inset-x-0 top-[calc(100%+8px)] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
            <div className="p-2">
              {NAV.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className="flex items-center rounded-xl px-4 py-3.5 text-[14px] font-medium text-gray-800 transition-colors hover:bg-gray-50"
                >
                  {n.label}
                </Link>
              ))}
              <div className="mx-1 my-2 h-px bg-gray-100" />
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center rounded-xl bg-[#111111] py-3 text-[13px] font-medium text-white"
              >
                Get started →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Page ────────────────────────────────────────────────────────── */
function HomePage() {
  return (
    <div className="h-screen w-full relative overflow-hidden bg-[#050505]">

      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
        src="https://cdn.sceneai.art/Hero%20Section%20Video/e0756960-0a98-42df-a9ff-bc871a4ddf34.mov"
      />

      {/* Gradient overlay — bright top, dark readable bottom */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/20 to-black/60" />

      {/* Floating navbar */}
      <FloatingNav />

      {/* Bottom anchor — text + logos */}
      <div className="absolute bottom-8 inset-x-0 flex flex-col items-center">

        {/* Headline block — separated 100px from logos */}
        <div className="mb-[100px] flex flex-col items-center px-4 text-center">
          <h1 className="text-white text-[clamp(2rem,6vw,56px)] font-semibold tracking-tight leading-tight">
            Scale with Solupair
          </h1>
          <p className="mt-4 max-w-[420px] text-[15px] leading-relaxed text-[#D1D1D1]">
            Empower your business with design and software that grows with you —
            seamless craft for forward-thinking South African teams.
          </p>
          <Link
            to="/contact"
            className="mt-6 rounded-xl bg-white px-6 py-2.5 text-[13px] font-medium text-black transition-colors hover:bg-gray-100"
          >
            Get Started
          </Link>
        </div>

        {/* Partner logos ribbon */}
        <div className="flex flex-wrap items-center justify-center gap-10 px-6 opacity-70">
          {PARTNERS.map((p) => (
            <div key={p.name} className={`flex items-center gap-2 text-white ${p.cls}`}>
              {p.icon}
              <span>{p.name}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
