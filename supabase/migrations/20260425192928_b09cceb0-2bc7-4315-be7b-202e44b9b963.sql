
create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now(),
  unique (email)
);
alter table public.newsletter_subscribers enable row level security;
create policy "anyone can subscribe" on public.newsletter_subscribers
  for insert to anon, authenticated with check (true);

create table public.article_feedback (
  id uuid primary key default gen_random_uuid(),
  article_slug text not null,
  vote smallint not null check (vote in (-1, 1)),
  created_at timestamptz not null default now()
);
alter table public.article_feedback enable row level security;
create policy "anyone can vote" on public.article_feedback
  for insert to anon, authenticated with check (true);

create table public.article_quick_takes (
  slug text primary key,
  bullets jsonb not null,
  created_at timestamptz not null default now()
);
alter table public.article_quick_takes enable row level security;
create policy "anyone can read quick takes" on public.article_quick_takes
  for select to anon, authenticated using (true);
