import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Article } from "@/content/articles";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Summarise the key takeaway",
  "What's the most actionable step?",
  "How does this apply to small operations?",
];

function articleToText(a: Article): string {
  return a.body
    .map((b) => {
      if (b.type === "p") return b.text;
      if (b.type === "h2" || b.type === "h3") return `## ${b.text}`;
      if (b.type === "quote") return `"${b.text}"`;
      if (b.type === "callout") return `${b.title}: ${b.text}`;
      if (b.type === "stat") return `${b.value} — ${b.label}`;
      if (b.type === "list") return b.items.map((i) => `- ${i}`).join("\n");
      return "";
    })
    .filter(Boolean)
    .join("\n\n");
}

export function ArticleChat({ article }: { article: Article }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const ask = async (text: string) => {
    if (!text.trim() || loading) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput("");
    setLoading(true);

    const { data, error } = await supabase.functions.invoke("article-chat", {
      body: {
        articleTitle: article.title,
        articleText: articleToText(article),
        messages: next,
      },
    });

    setLoading(false);
    if (error) {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "I'm having a moment. Try again in a few seconds." },
      ]);
      return;
    }
    setMessages((m) => [
      ...m,
      { role: "assistant", content: `${data.reply}\n\nBased on: ${article.title}` },
    ]);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-teal/40 bg-surface/90 px-4 py-3 font-mono text-[11px] uppercase tracking-wider text-teal backdrop-blur-xl shadow-teal-faint transition-all hover:bg-teal hover:text-background ${
          open ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <MessageCircle className="h-4 w-4" />
        Ask about this article
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm md:hidden"
            onClick={() => setOpen(false)}
          />
          <div className="fixed bottom-0 right-0 z-50 flex h-[80vh] w-full flex-col rounded-t-xl border border-border bg-surface shadow-2xl md:bottom-6 md:right-6 md:h-[600px] md:max-h-[85vh] md:w-[420px] md:rounded-xl">
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-teal">
                  <Sparkles className="h-3.5 w-3.5" />
                  Shelf Life Wisdom AI
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-wider text-text-tertiary">
                  Scoped to this article only
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-full p-2 text-muted-foreground hover:text-teal">
                <X className="h-4 w-4" />
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Ask anything about <span className="font-serif italic text-foreground">{article.title}</span>.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => ask(s)}
                        className="rounded-full border border-teal/30 bg-teal/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-teal hover:bg-teal hover:text-background"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "ml-auto bg-teal text-background"
                      : "bg-background text-foreground/90"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="max-w-[85%] rounded-lg bg-background px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Thinking…
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                ask(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this article…"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm focus:border-teal focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-teal text-background disabled:opacity-50"
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}
