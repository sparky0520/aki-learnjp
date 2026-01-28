-- Create a table to store subscription details
create table if not exists public.subscriptions (
  id uuid default gen_random_uuid() primary key,
  user_id text not null, -- references Clerk user ID
  subscription_id text not null unique, -- Razorpay Subscription ID
  plan_id text not null,
  status text not null, -- 'active', 'authentication_pending', 'halted', etc.
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add an index on user_id for faster lookups
create index if not exists idx_subscriptions_user_id on public.subscriptions(user_id);

-- Enable Row Level Security (RLS)
alter table public.subscriptions enable row level security;

-- Policy: Users can view their own subscriptions
create policy "Users can view own subscriptions"
  on public.subscriptions for select
  using (auth.uid()::text = user_id);

-- Policy: Service role (admin/webhooks) can manage all
create policy "Service role can manage all"
  on public.subscriptions for all
  using (true)
  with check (true);
