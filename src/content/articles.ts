import type { ShelfLevel } from "@/components/brand/Badges";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string; id?: string }
  | { type: "quote"; text: string }
  | { type: "callout"; variant: "tip" | "fact"; title: string; text: string }
  | { type: "stat"; value: string; label: string; numeric: number; suffix?: string; prefix?: string }
  | { type: "calculator" }
  | { type: "list"; items: string[] };

export type Article = {
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  category: string;
  categorySlug: string;
  level: ShelfLevel;
  lastVerified: string; // ISO
  publishedAt: string; // ISO
  readMinutes: number;
  hasAudio: boolean;
  author: { name: string; role: string; bio: string; initials: string };
  body: ArticleBlock[];
  glossary?: Record<string, string>;
  featured?: boolean;
};

export const CATEGORIES = [
  { slug: "stock-rotation", label: "Stock Rotation", emoji: "📦" },
  { slug: "expiry-management", label: "Expiry Dates", emoji: "🗓️" },
  { slug: "fifo-fefo", label: "FIFO & FEFO", emoji: "🧮" },
  { slug: "waste-reduction", label: "Waste Reduction", emoji: "💸" },
  { slug: "purchasing", label: "Purchasing", emoji: "🛒" },
  { slug: "retail-ops", label: "Retail Ops", emoji: "🏪" },
  { slug: "cold-chain", label: "Cold Chain", emoji: "❄️" },
  { slug: "zero-waste", label: "Zero Waste", emoji: "🌱" },
];

const sarah = {
  name: "Sarah Lindqvist",
  role: "Floor Operations Lead",
  bio: "Twelve years on the floor. Now writes about the systems that actually work in real warehouses.",
  initials: "SL",
};
const marcus = {
  name: "Marcus Chen",
  role: "Inventory Strategist",
  bio: "Former retail ops director. Builds inventory frameworks for grocery chains across three continents.",
  initials: "MC",
};
const elena = {
  name: "Elena Rossi",
  role: "Cold Chain Specialist",
  bio: "Refrigeration engineer turned inventory consultant. Knows where the temperature went wrong.",
  initials: "ER",
};

export const ARTICLES: Article[] = [
  {
    slug: "fifo-isnt-enough",
    title: "Why FIFO Isn't Enough Anymore",
    subtitle: "First-in, first-out built modern grocery. It's also why you're losing money this quarter.",
    excerpt:
      "FIFO works on paper. On the floor, it quietly bleeds margin every shift. Here's what the operators who stopped losing actually do.",
    category: "FIFO & FEFO",
    categorySlug: "fifo-fefo",
    level: "manager",
    lastVerified: "2026-04-12",
    publishedAt: "2026-04-08",
    readMinutes: 9,
    hasAudio: true,
    author: marcus,
    featured: true,
    glossary: {
      FIFO: "First-In, First-Out. Stock received first is sold first, regardless of expiry date.",
      FEFO: "First-Expiring, First-Out. Stock with the nearest expiry date is sold first.",
      shrinkage: "Inventory loss from waste, theft, damage, or administrative error.",
    },
    body: [
      { type: "p", text: "FIFO is the rotation method everyone learned in week one. Oldest stock to the front. Newest to the back. It's tidy, intuitive, and — for a startling percentage of perishable inventory — it's the wrong question entirely." },
      { type: "p", text: "The right question is FEFO. First-Expiring, First-Out. The shelf doesn't care when something arrived. The shelf cares when something dies." },
      { type: "h2", text: "The hidden cost of getting this wrong", id: "hidden-cost" },
      { type: "stat", value: "31%", label: "of perishable stock is wasted due to poor rotation", numeric: 31, suffix: "%" },
      { type: "p", text: "That number comes from operators who thought their FIFO discipline was airtight. It wasn't. Stock from a slower supplier with a shorter remaining shelf life sat behind newer stock with weeks more runway. By the time it surfaced, it was scrap." },
      { type: "callout", variant: "tip", title: "Pro Tip", text: "Audit one SKU. Compare arrival date to printed expiry on every unit. If they don't trend together, FIFO is lying to you." },
      { type: "h2", text: "What FEFO actually requires", id: "fefo-requires" },
      { type: "p", text: "FEFO is not a slogan. It requires three things most operations don't have on day one: scannable expiry data at receiving, a rotation cue at the shelf level, and a daily report that flags drift before it becomes shrinkage." },
      { type: "list", items: [
        "Capture expiry at the gate, not at the shelf.",
        "Make the closest-expiry unit physically obvious — colour, position, or signal.",
        "Review variance daily for 14 days. Patterns appear quickly.",
      ]},
      { type: "quote", text: "FIFO is what you do because it's easy. FEFO is what you do because the spreadsheet stopped lying." },
      { type: "h2", text: "Calculate what this is costing you", id: "calculator" },
      { type: "calculator" },
      { type: "p", text: "Most teams underestimate by half. The number above usually shocks the first time it's run honestly." },
      { type: "h2", text: "The 90-day shift", id: "shift" },
      { type: "p", text: "Operations that move from FIFO to FEFO see waste reduction within the first two cycles. Not because FEFO is magic, but because it forces the question: do we actually know what's about to expire? Most shops, asked truthfully, do not." },
      { type: "stat", value: "47%", label: "average waste reduction in the first 90 days of disciplined FEFO", numeric: 47, suffix: "%" },
    ],
  },
  {
    slug: "expiry-data-receiving",
    title: "The Receiving Dock Is Where Waste Begins",
    subtitle: "If expiry isn't captured at the gate, no rotation system can save you downstream.",
    excerpt:
      "Most expiry-related shrinkage is decided in the first ninety seconds a pallet is on your floor. Here's the discipline that fixes it.",
    category: "Expiry Dates",
    categorySlug: "expiry-management",
    level: "ops",
    lastVerified: "2026-03-22",
    publishedAt: "2026-03-18",
    readMinutes: 7,
    hasAudio: true,
    author: sarah,
    body: [
      { type: "p", text: "Receiving is the most under-engineered process in modern inventory. A truck arrives. Someone signs. Boxes go to the back. The clock has already started, and nobody wrote it down." },
      { type: "h2", text: "The 90-second rule", id: "rule" },
      { type: "p", text: "Capture the expiry date on every SKU within 90 seconds of the pallet hitting the floor. Not at putaway. Not at shelf-fill. At the dock." },
      { type: "stat", value: "82%", label: "of expiry-driven shrinkage is preventable at receiving", numeric: 82, suffix: "%" },
      { type: "callout", variant: "fact", title: "Quick Fact", text: "A single uncaptured expiry date on a fast-moving SKU costs an average operation $340 per week in compounding waste." },
      { type: "h2", text: "What good looks like", id: "good" },
      { type: "list", items: [
        "Scanner at the dock, not at the shelf.",
        "One person owns receiving — not whoever is free.",
        "Variance report compared to PO within 10 minutes of unload.",
      ]},
      { type: "quote", text: "You cannot rotate what you have not measured. The dock is the only place where measurement is still cheap." },
      { type: "h2", text: "Run the numbers", id: "numbers" },
      { type: "calculator" },
    ],
  },
  {
    slug: "cold-chain-handoffs",
    title: "Cold Chain Fails at the Handoffs",
    subtitle: "The freezer is fine. The truck is fine. The shelf is fine. The 4 minutes between them are not.",
    excerpt:
      "Temperature excursions almost never happen in the equipment. They happen in the gaps between equipment. Here's how to close them.",
    category: "Cold Chain",
    categorySlug: "cold-chain",
    level: "manager",
    lastVerified: "2026-02-28",
    publishedAt: "2026-02-25",
    readMinutes: 8,
    hasAudio: false,
    author: elena,
    body: [
      { type: "p", text: "Cold chain monitoring became a funded discipline because everyone assumed the failure point was the equipment. It almost never is. Modern refrigeration units fail less than 0.4% of operating hours. The chain breaks at the seams." },
      { type: "h2", text: "The four-minute window", id: "window" },
      { type: "stat", value: "4", label: "minutes is the average dwell time at every temperature handoff", numeric: 4, suffix: " min" },
      { type: "p", text: "Dock to truck. Truck to warehouse. Warehouse to display. Each handoff costs you a measurable amount of shelf life, and most operations don't track a single one of them." },
      { type: "callout", variant: "tip", title: "Pro Tip", text: "Put a logger inside one pallet for one week. The graph tells you everything procurement won't." },
      { type: "h2", text: "What changes when you measure", id: "measure" },
      { type: "p", text: "Once handoffs are timed, two things shift quickly: dock crews start moving with intent, and reefer drivers stop using cold rooms as parking spots. Both are cultural problems disguised as logistics ones." },
      { type: "stat", value: "12", label: "days of effective shelf life recovered per SKU per quarter", numeric: 12, suffix: " days" },
    ],
  },
  {
    slug: "zero-waste-isnt-virtue",
    title: "Zero Waste Isn't a Virtue. It's a P&L Line.",
    subtitle: "The most profitable operations treat waste as a leak, not a sin.",
    excerpt:
      "The language of sustainability has done waste reduction a quiet disservice. Here's how the best operators reframe it — and what it does to margin.",
    category: "Zero Waste",
    categorySlug: "zero-waste",
    level: "floor",
    lastVerified: "2026-04-02",
    publishedAt: "2026-03-30",
    readMinutes: 6,
    hasAudio: false,
    author: marcus,
    body: [
      { type: "p", text: "Walk into most operations and ask about waste. You'll get a sustainability answer. A values answer. A long sentence about the planet. None of it wrong. None of it operationally useful." },
      { type: "p", text: "The operators who actually move the number reframe it. Waste is a leak. Leaks are measured. Measured leaks are closed." },
      { type: "h2", text: "The three numbers that matter", id: "three" },
      { type: "list", items: [
        "Waste as % of cost of goods, not as a sustainability score.",
        "Waste per SKU per week, ranked.",
        "Waste recovered into discount, donation, or scrap — broken out separately.",
      ]},
      { type: "stat", value: "23%", label: "average margin recovery when waste is treated as a P&L line", numeric: 23, suffix: "%" },
      { type: "quote", text: "You don't reduce waste by caring more. You reduce it by counting better." },
      { type: "h2", text: "Try it on your numbers", id: "try" },
      { type: "calculator" },
    ],
  },
  {
    slug: "purchasing-expiry-discipline",
    title: "Buy for Velocity, Not for Volume",
    subtitle: "Bulk discounts are the most expensive thing in your purchasing playbook.",
    excerpt:
      "The case-pack discount that looked like savings is the same discount that's expiring on your shelf right now. Velocity-based purchasing changes the math.",
    category: "Purchasing",
    categorySlug: "purchasing",
    level: "manager",
    lastVerified: "2026-03-15",
    publishedAt: "2026-03-10",
    readMinutes: 7,
    hasAudio: true,
    author: marcus,
    body: [
      { type: "p", text: "Volume discounts are seductive. The vendor offers 8% off on a case-pack of 24. The buyer takes it. Six weeks later, eleven units expire on the shelf. The 8% saved is now a 22% loss, and nobody made the connection." },
      { type: "h2", text: "Velocity-based ordering", id: "velocity" },
      { type: "p", text: "Order what sells in the time it stays good. Not more. Not less. The arithmetic is brutally simple and almost nobody runs it cleanly." },
      { type: "stat", value: "$3.40", label: "lost in waste for every $1.00 saved on case-pack discounts", numeric: 3.4, prefix: "$" },
      { type: "callout", variant: "fact", title: "Quick Fact", text: "Operations that switch to velocity-based ordering see purchasing spend rise 4% — and total cost fall 11%." },
      { type: "h2", text: "What this looks like in practice", id: "practice" },
      { type: "list", items: [
        "Replace case-pack thinking with units-per-week thinking.",
        "Negotiate split-pack arrangements with key vendors.",
        "Re-forecast every two weeks for the 50 SKUs that drive 80% of waste.",
      ]},
      { type: "calculator" },
    ],
  },
  {
    slug: "shelf-as-system",
    title: "The Shelf Is a System, Not a Surface",
    subtitle: "How retail operations stopped treating the shelf as decoration and started treating it as logistics.",
    excerpt:
      "Modern retail ops treats the shelf as the most expensive square foot in the operation. Here's what that looks like in discipline.",
    category: "Retail Ops",
    categorySlug: "retail-ops",
    level: "floor",
    lastVerified: "2026-04-18",
    publishedAt: "2026-04-15",
    readMinutes: 8,
    hasAudio: false,
    author: sarah,
    body: [
      { type: "p", text: "The shelf is the most expensive square foot in the operation. Rent, lighting, refrigeration, labour, and opportunity cost all collapse onto it. Most operations treat it like decoration." },
      { type: "h2", text: "Three frames that change things", id: "frames" },
      { type: "list", items: [
        "Every facing is a forecast. Wrong facings are expensive forecasts.",
        "Every empty slot is a stockout you can see. Every full slot might be a stockout you can't.",
        "Every front-row unit is a vote. The vote is for what sells next.",
      ]},
      { type: "stat", value: "18%", label: "sales lift when facings match actual velocity within 7 days", numeric: 18, suffix: "%" },
      { type: "callout", variant: "tip", title: "Pro Tip", text: "Photograph one aisle every Monday at 9am for a month. The pattern of empties tells you what to reforecast." },
      { type: "quote", text: "The shelf doesn't lie. The reports sometimes do. Trust the shelf." },
    ],
  },
];

export const featuredArticle = ARTICLES.find((a) => a.featured) ?? ARTICLES[0];

export function articleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function articlesByCategory(slug: string): Article[] {
  return ARTICLES.filter((a) => a.categorySlug === slug);
}

export function relatedArticles(current: Article, count = 3): Article[] {
  return ARTICLES.filter((a) => a.slug !== current.slug)
    .sort((a, b) => (a.categorySlug === current.categorySlug ? -1 : 1))
    .slice(0, count);
}

export function slugifyHeading(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}
