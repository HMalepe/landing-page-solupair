-- Solupair studio: lead capture scaffolding

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  source text,
  created_at timestamptz not null default now(),
  unique (email)
);

alter table public.newsletter_subscribers enable row level security;

create policy "anyone can subscribe"
  on public.newsletter_subscribers
  for insert
  to anon, authenticated
  with check (true);

create table public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_inquiries enable row level security;

create policy "anyone can submit inquiry"
  on public.contact_inquiries
  for insert
  to anon, authenticated
  with check (true);
