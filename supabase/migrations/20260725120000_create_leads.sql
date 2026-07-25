-- Solupair studio: unified lead capture for the site-wide "Book a call" CTA
-- and the ZAR quote builder.

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  business text not null,
  needs text[] not null,
  budget_band text not null,
  contact text not null,
  -- Populated only when the lead arrives via the quote builder.
  quote_project_type text,
  quote_config jsonb,
  quote_range_min integer,
  quote_range_max integer,
  -- Captured from the URL if present at submit time.
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text
);

alter table public.leads enable row level security;

-- Anonymous visitors can insert a lead...
create policy "anyone can submit a lead"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

-- ...but no select/update/delete policy exists for anon or authenticated,
-- so RLS denies those operations by default. Leads are only readable via
-- the Supabase dashboard or a service-role key on the server
-- (see src/integrations/supabase/client.server.ts) — never the public client.
