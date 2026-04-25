import { useEffect, useState } from "react";
import { Link2, Linkedin, Twitter, MessageCircle, Check } from "lucide-react";
import { toast } from "sonner";

export function SocialRail({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const footer = document.querySelector("footer");
      if (!footer) return;
      const top = footer.getBoundingClientRect().top;
      setHide(top < window.innerHeight + 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Link copied");
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  const enc = encodeURIComponent;
  const items = [
    { icon: Link2, label: "Copy link", onClick: copy, href: undefined },
    { icon: Linkedin, label: "Share to LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { icon: Twitter, label: "Share to X", href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { icon: MessageCircle, label: "Share to WhatsApp", href: `https://wa.me/?text=${enc(`${title} — ${url}`)}` },
  ];

  return (
    <aside
      className={`hidden xl:block transition-opacity duration-300 ${hide ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="sticky top-28 flex flex-col gap-2">
        {items.map((it, i) => {
          const Icon = i === 0 && copied ? Check : it.icon;
          const cls =
            "group relative flex h-10 w-10 items-center justify-center rounded-full border border-border bg-surface text-muted-foreground transition-all hover:border-teal hover:bg-teal/10 hover:text-teal";
          const Inner = (
            <>
              <Icon className="h-4 w-4" />
              <span className="pointer-events-none absolute left-12 whitespace-nowrap rounded-md border border-border bg-surface px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                {it.label}
              </span>
            </>
          );
          if (it.href) {
            return (
              <a key={it.label} href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {Inner}
              </a>
            );
          }
          return (
            <button key={it.label} onClick={it.onClick} className={cls}>
              {Inner}
            </button>
          );
        })}
      </div>
    </aside>
  );
}
