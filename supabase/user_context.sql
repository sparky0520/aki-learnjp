-- Create a table to store user context for the chatbot
create table if not exists public.user_context (
  user_id text not null, -- References Clerk user ID
  org_id text not null,
  last_session_summary text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, org_id)
);

-- Enable RLS
alter table public.user_context enable row level security;

-- Policies
create policy "Users can view own context"
  on public.user_context for select
  using (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));

create policy "Users can update own context"
  on public.user_context for update
  using (auth.uid()::text = user_id AND org_id = (SELECT current_setting('app.current_org_id', true)));

create policy "Users can insert own context"
  on public.user_context for insert
  with check (auth.uid()::text = user_id);
create policy "Service role can manage all"
  on public.user_context for all
  to service_role
  using (true)
  with check (true);
