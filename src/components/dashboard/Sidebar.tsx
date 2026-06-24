import { Link, useLocation } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard, CalendarDays, Activity, MessageSquare, Users, LifeBuoy,
  Scissors, UsersRound, GitBranch, Bot, BarChart3, Search, LogOut, Power,
} from "lucide-react";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { owner } from "@/lib/mock-data";

const groups = [
  {
    label: "",
    items: [{ to: "/", label: "Today at a glance", icon: LayoutDashboard }],
  },
  {
    label: "Run the day",
    items: [
      { to: "/appointments", label: "Bookings", icon: CalendarDays },
      { to: "/live-pulse", label: "Live pulse", icon: Activity },
      { to: "/conversations", label: "Inbox", icon: MessageSquare },
      { to: "/customers", label: "Clients", icon: Users },
      { to: "/tickets", label: "Help requests", icon: LifeBuoy, badge: 19 },
    ],
  },
  {
    label: "Set up your salon",
    items: [
      { to: "/services", label: "Services", icon: Scissors },
      { to: "/staff", label: "Staff roster", icon: UsersRound },
      { to: "/branches", label: "Branches", icon: GitBranch },
      { to: "/faqs", label: "Bot FAQs", icon: Bot },
    ],
  },
  {
    label: "Marketing & insights",
    items: [{ to: "/insights", label: "Insights", icon: BarChart3 }],
  },
];

export function Sidebar() {
  const { pathname } = useLocation();
  return (
    <aside className="hidden md:flex md:w-72 lg:w-80 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex items-center gap-3 p-5">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-background/40 border border-sidebar-border">
          <Logo size={28} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Owner</div>
          <div className="truncate text-sm font-semibold text-foreground">{owner.business}</div>
          <div className="truncate text-xs text-muted-foreground">{owner.name}</div>
        </div>
        <div className="flex flex-col gap-1">
          <ThemeToggle />
        </div>
      </div>
      <div className="px-5 pb-3 text-xs text-muted-foreground">{owner.phone}</div>

      <div className="px-4 pb-3">
        <div className="flex items-center gap-2 rounded-xl border border-sidebar-border bg-background/40 px-3 py-2 text-sm text-muted-foreground">
          <Search className="h-4 w-4" />
          <input className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Search pages & settings" />
          <kbd className="rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">⌘K</kbd>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {groups.map((g) => (
          <div key={g.label || "_"} className="mb-4">
            {g.label && <div className="px-3 py-2 text-[10px] uppercase tracking-widest text-muted-foreground">{g.label}</div>}
            <ul className="space-y-1">
              {g.items.map((item) => {
                const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
                const Icon = item.icon;
                return (
                  <li key={item.to}>
                    <Link to={item.to as any} className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition group">
                      {active && (
                        <motion.span
                          layoutId="sidebar-active"
                          className="absolute inset-0 rounded-xl bg-gradient-brand-soft border border-primary/30"
                          transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                        />
                      )}
                      <Icon className={`relative h-4 w-4 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                      <span className={`relative flex-1 ${active ? "text-foreground font-medium" : "text-muted-foreground group-hover:text-foreground"}`}>{item.label}</span>
                      {"badge" in item && item.badge ? (
                        <span className="relative grid h-5 min-w-5 place-items-center rounded-full bg-destructive/20 px-1.5 text-[10px] font-semibold text-destructive">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <div className="mb-3 flex items-center gap-3 rounded-xl border border-sidebar-border bg-background/40 p-3">
          <div className="relative">
            <Logo size={20} />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-sidebar" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-gradient-brand">Solupair</div>
            <div className="truncate text-[11px] text-muted-foreground">{owner.channel}</div>
          </div>
          <Power className="h-4 w-4 text-muted-foreground" />
        </div>
        <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent hover:text-foreground">
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </aside>
  );
}