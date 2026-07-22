create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  departure_location text,
  destination text,
  start_date date not null,
  end_date date not null,
  budget numeric,
  number_of_travelers integer,
  travel_style text,
  interests text[] not null default '{}',
  preferred_season text,
  additional_info text,
  itinerary jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.trips enable row level security;

create policy "Users can view own trips" on public.trips for select using (auth.uid() = user_id);
create policy "Users can insert own trips" on public.trips for insert with check (auth.uid() = user_id);
create policy "Users can update own trips" on public.trips for update using (auth.uid() = user_id);
create policy "Users can delete own trips" on public.trips for delete using (auth.uid() = user_id);
