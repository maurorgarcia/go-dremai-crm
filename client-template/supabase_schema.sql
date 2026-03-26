-- Supabase Auth and User Profile Schema

-- 1. Create a table for public profiles linked to Auth Users
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create a generic roles table
create table public.roles (
  id uuid default uuid_generate_v4() primary key,
  name text unique not null,
  description text
);

-- Insert default roles
insert into public.roles (name, description) values
  ('admin', 'Administrator with full access'),
  ('client', 'Standard client access');

-- 3. Create a junction table for user_roles
create table public.user_roles (
  user_id uuid references public.profiles(id) on delete cascade not null,
  role_id uuid references public.roles(id) on delete cascade not null,
  assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (user_id, role_id)
);

-- Enable RLS (Row Level Security)
alter table public.profiles enable row level security;
alter table public.roles enable row level security;
alter table public.user_roles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Policies for roles (Read only for users)
create policy "Roles are viewable by everyone."
  on roles for select
  using ( true );

-- Policies for user_roles
create policy "User roles are viewable by assigned user."
  on user_roles for select
  using ( auth.uid() = user_id );

-- 4. Automatically create a profile when a new user signs up
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  
  -- Automatically assign 'client' role if exists (optional logic)
  -- insert into public.user_roles (user_id, role_id) 
  -- select new.id, id from public.roles where name = 'client';
  
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
