import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/dashboard/PageHeader";
import { conversations, thread } from "@/lib/mock-data";

export const Route = createFileRoute("/_dashboard/conversations")({
  head: () => ({
    meta: [
      { title: "Inbox — Solupair" },
      { name: "description", content: "All your WhatsApp conversations in one calm thread." },
    ],
  }),
  component: InboxPage,
});

function InboxPage() {
  const [active, setActive] = useState(conversations[0].id);
  const current = conversations.find((c) => c.id === active)!;
  return (
    <div>
      <PageHeader eyebrow="Inbox" title="Inbox" subtitle="All your WhatsApp threads, sorted by who's been waiting." />
      <div className="grid gap-0 px-0 py-6 lg:px-6 lg:grid-cols-[380px_minmax(0,1fr)]">
        <div className="space-y-1 overflow-y-auto border-r border-border px-3 pb-4">
          {conversations.map((c) => {
            const isActive = c.id === active;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={`w-full rounded-xl p-3 text-left transition ${isActive ? "bg-gradient-brand-soft border border-primary/30" : "border border-transparent hover:bg-accent/50"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-white">{c.initials}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="truncate text-sm font-medium text-foreground">{c.name}</div>
                      <div className="shrink-0 text-[10px] text-muted-foreground">{c.time}</div>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{c.last}</div>
                    <div className="mt-1 flex items-center gap-2">
                      {c.tag && <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{c.tag}</span>}
                      <span className="text-[10px] font-medium text-rose-500">Waiting {c.waited} min</span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex h-[calc(100vh-220px)] flex-col px-4 lg:px-8">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-brand text-xs font-semibold text-white">{current.initials}</div>
            <div>
              <div className="text-sm font-semibold text-foreground">{current.name}</div>
              <div className="text-xs text-muted-foreground">{current.tag || "WhatsApp · MarineFlow"}</div>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto py-6">
            <div className="text-center text-[11px] text-muted-foreground">Sunday, May 24</div>
            {thread.map((m, i) => (
              <div key={i} className={`flex ${m.from === "customer" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm whitespace-pre-line ${
                  m.from === "customer"
                    ? "bg-card border border-border text-foreground rounded-bl-sm"
                    : "bg-gradient-brand-soft border border-primary/20 text-foreground rounded-br-sm"
                }`}>
                  {m.text}
                  <div className="mt-1 text-[10px] text-muted-foreground">{m.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-4 space-y-3">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3 text-primary" /> Bot is on it — you can take over anytime
            </div>
            <button className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-brand px-4 py-3.5 text-sm font-semibold text-white shadow-glow transition hover:scale-[1.01]">
              <Send className="h-4 w-4" /> Jump in and reply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}