-- onoff_config : credentials OnOff par utilisateur
create table if not exists public.onoff_config (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  auth_token text not null default '',
  instance_id text not null default '',
  sender_number text not null default '',
  updated_at timestamptz not null default now(),
  unique(user_id)
);

alter table public.onoff_config enable row level security;

create policy "admin only onoff_config" on public.onoff_config
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- sms_campaigns : campagnes d'envoi
create table if not exists public.sms_campaigns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  status text not null default 'pending',
  total_contacts integer not null default 0,
  sent_count integer not null default 0,
  failed_count integer not null default 0,
  current_index integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.sms_campaigns enable row level security;

create policy "admin only sms_campaigns" on public.sms_campaigns
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- sms_contacts : contacts d'une campagne
create table if not exists public.sms_contacts (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.sms_campaigns(id) on delete cascade,
  name text not null default '',
  phone text not null,
  status text not null default 'pending',
  error_message text,
  sent_at timestamptz,
  sort_order integer not null default 0
);

alter table public.sms_contacts enable row level security;

create policy "admin only sms_contacts" on public.sms_contacts
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- sms_logs : logs en temps réel
create table if not exists public.sms_logs (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.sms_campaigns(id) on delete cascade,
  message text not null,
  type text not null default 'info',
  created_at timestamptz not null default now()
);

alter table public.sms_logs enable row level security;

create policy "admin only sms_logs" on public.sms_logs
  using (
    exists (
      select 1 from public.user_roles
      where user_id = auth.uid() and role = 'admin'
    )
  );

-- Realtime pour les logs et campagnes
alter publication supabase_realtime add table public.sms_campaigns;
alter publication supabase_realtime add table public.sms_logs;
