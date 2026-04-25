import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { slug, title, subtitle, body } = await req.json();
    if (!slug || !body) {
      return new Response(JSON.stringify({ error: "Missing slug or body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Cache check
    const { data: cached } = await supabase
      .from("article_quick_takes")
      .select("bullets")
      .eq("slug", slug)
      .maybeSingle();
    if (cached?.bullets) {
      return new Response(JSON.stringify({ bullets: cached.bullets, cached: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not set");

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an editor for Shelf Life Wisdom, an editorial inventory blog. Summarize articles into exactly 3 sharp, operator-focused bullet points. Each bullet: under 22 words, plain language, no fluff, no preamble. Return only via the tool call.",
          },
          {
            role: "user",
            content: `Article: "${title}"\nSubtitle: ${subtitle ?? ""}\n\n${body}`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_quick_take",
              description: "Return exactly 3 bullet point summaries.",
              parameters: {
                type: "object",
                properties: {
                  bullets: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 3,
                    maxItems: 3,
                  },
                },
                required: ["bullets"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_quick_take" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit. Try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway:", aiResp.status, t);
      throw new Error("AI gateway error");
    }

    const data = await aiResp.json();
    const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    const parsed = args ? JSON.parse(args) : null;
    const bullets: string[] = parsed?.bullets ?? [];
    if (bullets.length === 0) throw new Error("Empty bullets");

    await supabase.from("article_quick_takes").upsert({ slug, bullets });

    return new Response(JSON.stringify({ bullets }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("quick-take error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
