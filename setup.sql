-- Run this SQL code in your Supabase SQL Editor to create the required table and permissions.

-- 1. Create table (Updated: Removed 'status' column)
create table if not exists students (
  id bigint primary key generated always as identity,
  student_name text not null,
  class_name text not null,
  parent_mobile text not null,
  last_called_at timestamptz
);

-- 2. Enable Realtime for the students table
alter publication supabase_realtime add table students;

-- 3. IMPORTANT: Permissions (Row Level Security)
-- By default, Supabase blocks all access. We must explicitly allow it.
alter table students enable row level security;

-- Policy: Allow everyone to read data (Fixes Teacher View "No students found")
create policy "Allow public read access"
on students for select
to anon
using (true);

-- Policy: Allow everyone to update data (Fixes "Call Student" button)
create policy "Allow public update access"
on students for update
to anon
using (true);

-- 4. Create the RPC function for flexible mobile matching
-- Added 'security definer' to ensure it runs with ample permissions
create or replace function match_parent_mobile(search_number text)
returns setof students
language plpgsql
security definer
as $$
begin
  return query
  select *
  from students
  where right(parent_mobile, 9) = right(search_number, 9);
end;
$$;