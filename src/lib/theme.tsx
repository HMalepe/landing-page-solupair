import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: (e?: React.MouseEvent) => void };

const ThemeContext = createContext<Ctx>({ theme: "dark", toggle: () => {} });

function getInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("solupair-theme");
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const t = getInitial();
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  const apply = (next: Theme) => {
    setTheme(next);
    localStorage.setItem("solupair-theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const toggle = (e?: React.MouseEvent) => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    const doc = typeof document !== "undefined" ? (document as Document & { startViewTransition?: (cb: () => void) => void }) : null;
    if (doc?.startViewTransition) {
      doc.startViewTransition(() => apply(next));
    } else {
      apply(next);
    }
  };

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);