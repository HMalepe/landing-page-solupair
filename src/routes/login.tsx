import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, MessageCircle, Mail } from "lucide-react";
import { AuroraBackground } from "@/components/dashboard/AuroraBackground";
import { ThemeToggle } from "@/components/dashboard/ThemeToggle";
import { Logo } from "@/components/dashboard/Logo";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Solupair" },
      { name: "description", content: "Your salon, in one place." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [mode, setMode] = useState<"whatsapp" | "email">("whatsapp");
  const [show, setShow] = useState(false);
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <AuroraBackground />
      <div className="absolute right-6 top-6 z-10"><ThemeToggle /></div>

      <div className="relative grid min-h-screen place-items-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="mb-6 flex flex-col items-center">
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-border bg-card/80 shadow-glow backdrop-blur">
              <Logo size={40} />
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold tracking-tight">
              Welcome to <span className="text-gradient-brand">Solupair</span>
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Your salon, in one place.</p>
          </div>

          <div className="rounded-3xl border border-border bg-card/80 p-6 shadow-elegant backdrop-blur-xl">
            <div className="relative grid grid-cols-2 rounded-xl border border-border bg-background/40 p-1">
              <div
                className="absolute top-1 bottom-1 w-1/2 rounded-lg bg-gradient-brand shadow-glow transition-transform duration-300 ease-out"
                style={{ transform: mode === "whatsapp" ? "translateX(0%)" : "translateX(100%)" }}
              />
              <button onClick={() => setMode("whatsapp")} className={`relative z-10 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium ${mode === "whatsapp" ? "text-white" : "text-muted-foreground"}`}>
                <MessageCircle className="h-4 w-4" /> WhatsApp
              </button>
              <button onClick={() => setMode("email")} className={`relative z-10 inline-flex items-center justify-center gap-2 py-2 text-sm font-medium ${mode === "email" ? "text-white" : "text-muted-foreground"}`}>
                <Mail className="h-4 w-4" /> Email
              </button>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  {mode === "whatsapp" ? "WhatsApp business number" : "Email address"}
                </label>
                {mode === "whatsapp" ? (
                  <div className="mt-2 flex overflow-hidden rounded-xl border border-border bg-background/60 focus-within:border-primary/60 focus-within:shadow-glow">
                    <span className="grid place-items-center bg-muted px-3 font-mono text-sm text-muted-foreground">+27</span>
                    <input className="flex-1 bg-transparent px-3 py-3 text-sm outline-none" defaultValue="62 476 0899" />
                  </div>
                ) : (
                  <input className="mt-2 w-full rounded-xl border border-border bg-background/60 px-3 py-3 text-sm outline-none focus:border-primary/60 focus:shadow-glow" placeholder="you@salon.com" />
                )}
                <p className="mt-2 text-xs text-muted-foreground">
                  {mode === "whatsapp"
                    ? "Enter the WhatsApp business number assigned to your salon on MarineFlow. First visit? You'll set a password — no Meta account needed."
                    : "Use the email address linked to your Solupair account."}
                </p>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Password</label>
                <div className="mt-2 flex items-center overflow-hidden rounded-xl border border-border bg-background/60 focus-within:border-primary/60 focus-within:shadow-glow">
                  <input type={show ? "text" : "password"} defaultValue="••••••••••" className="flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
                  <button type="button" onClick={() => setShow((s) => !s)} className="px-3 text-muted-foreground hover:text-foreground">
                    {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Required each time you sign in. Your browser can save it if you'd like.</p>
              </div>

              <Link to="/" className="block w-full">
                <button className="w-full rounded-xl bg-gradient-brand py-3.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]">
                  Sign in
                </button>
              </Link>

              <div className="flex items-center justify-between text-xs">
                <a className="text-muted-foreground hover:text-foreground" href="#">Forgot password?</a>
                <a className="text-primary hover:underline" href="#">Need help?</a>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Solupair · MarineFlow · WhatsApp business automation
          </p>
        </div>
      </div>
    </div>
  );
}