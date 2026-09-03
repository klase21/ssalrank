-- supabase_clicks.sql — Supabase SQL Editor에 붙여넣기 (무자본 클릭 추적)
create table if not exists clicks (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references posts(id) on delete cascade,
  kind text not null check (kind in ('referral','source')),
  created_at timestamp with time zone default now()
);
alter table clicks enable row level security;
drop policy if exists "public insert clicks" on clicks;
create policy "public insert clicks" on clicks for insert with check (true);
drop policy if exists "public read clicks" on clicks;
create policy "public read clicks" on clicks for select using (true);
create index if not exists idx_clicks_post on clicks(post_id);
create index if not exists idx_clicks_created on clicks(created_at desc);
create index if not exists idx_clicks_kind on clicks(kind);

-- 어드민 통계 뷰 (클릭 랭킹)
create or replace view click_stats as
select
  p.id, p.title_ko, p.title_en,
  count(*) filter (where c.kind='referral') as referral_clicks,
  count(*) filter (where c.kind='source') as source_clicks,
  count(*) as total_clicks
from posts p
left join clicks c on c.post_id = p.id
group by p.id
order by referral_clicks desc;
