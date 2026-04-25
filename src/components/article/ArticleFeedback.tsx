import { useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export function ArticleFeedback({ slug }: { slug: string }) {
  const [voted, setVoted] = useState<1 | -1 | null>(null);

  const vote = async (v: 1 | -1) => {
    if (voted) return;
    setVoted(v);
    await supabase.from("article_feedback").insert({ article_slug: slug, vote: v });
  };

  return (
    <div className="my-12 rounded-md border border-border bg-surface p-6 text-center">
      {voted ? (
        <p className="font-mono text-[11px] uppercase tracking-wider text-teal">
          Thanks for the feedback.
        </p>
      ) : (
        <>
          <p className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            Was this useful?
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              onClick={() => vote(1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-teal hover:text-teal"
              aria-label="Useful"
            >
              <ThumbsUp className="h-4 w-4" />
            </button>
            <button
              onClick={() => vote(-1)}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all hover:border-teal hover:text-teal"
              aria-label="Not useful"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
