-- Run this in the Supabase SQL Editor to update your existing `trips` table
-- for the expanded planner form (departure location, optional destination,
-- number of travelers, travel style, preferred season) — replaces group_type/pace.

alter table public.trips
  alter column destination drop not null;

alter table public.trips
  add column if not exists departure_location text,
  add column if not exists number_of_travelers integer,
  add column if not exists travel_style text,
  add column if not exists preferred_season text;

alter table public.trips
  drop column if exists group_type,
  drop column if exists pace;
