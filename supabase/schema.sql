-- Run this in Supabase: Dashboard > SQL Editor > New Query
-- Updated for the self-hosted signing system (no DocuSign/Autenti dependency)

-- Every "Get the Full Story" submission, signed or not.
create table if not exists nda_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  status text not null default 'requested', -- requested | signed
  session_id text unique,
  source text,
  created_at timestamptz not null default now(),
  signed_at timestamptz
);

-- The durable, gating record — full signature audit trail.
create table if not exists nda_signatures (
  email text primary key,
  name text not null,
  typed_name text not null,       -- exact name the signer typed
  ip_address text,
  user_agent text,
  nda_hash text not null,          -- sha256 of the exact NDA text agreed to
  nda_version text not null,       -- human-readable version label
  signed_at timestamptz not null default now()
);

alter table nda_requests enable row level security;
alter table nda_signatures enable row level security;

create policy "public can submit access requests"
  on nda_requests for insert
  to anon
  with check (true);

create policy "users can check their own access"
  on nda_signatures for select
  to authenticated
  using (email = auth.jwt() ->> 'email');
