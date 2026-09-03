-- supabase_app_reviews.sql — 쌀먹 앱 리뷰 + 동적 소스 (무자본)
create table if not exists app_reviews (
  id uuid primary key default gen_random_uuid(),
  app_name text not null,
  app_name_en text not null,
  icon_url text,
  rating numeric not null default 3.0 check (rating >=0 and rating <=5),
  payout_min_krw int not null default 5000,
  payout_speed text not null default '3일 이내', -- 예: 즉시, 3일, 7일
  verified boolean not null default false,
  review_ko text not null,
  review_en text not null,
  referral_url text,
  store_url text not null,
  pros text[] not null default '{}',
  cons text[] not null default '{}',
  created_at timestamp with time zone default now()
);
alter table app_reviews enable row level security;
drop policy if exists "public read apps" on app_reviews; create policy "public read apps" on app_reviews for select using (true);
drop policy if exists "public insert apps" on app_reviews; create policy "public insert apps" on app_reviews for insert with check (true);
drop policy if exists "public update apps" on app_reviews; create policy "public update apps" on app_reviews for update using (true);
create index if not exists idx_apps_rating on app_reviews(rating desc);

-- 매일 새로운 곳 소싱 — 동적 소스 테이블 (어드민에서 추가, 크론이 매일 순회)
create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null, -- 예: r/beermoney, ppomppu_event, 신규앱_캐시닥
  url text not null unique,
  kind text not null default 'rss' check (kind in ('rss','html','manual')),
  enabled boolean not null default true,
  last_fetched_at timestamp with time zone,
  created_at timestamp with time zone default now()
);
alter table sources enable row level security;
drop policy if exists "public read sources" on sources; create policy "public read sources" on sources for select using (true);
drop policy if exists "public insert sources" on sources; create policy "public insert sources" on sources for insert with check (true);
drop policy if exists "public update sources" on sources; create policy "public update sources" on sources for update using (true);
-- FEEDS 초기 시드 (코드 FEEDS와 중복돼도 cron이 중복 제거함)
insert into sources (name, url, kind) values
('r/beermoney','https://www.reddit.com/r/beermoney/new/.rss','rss'),
('r/SideHustle','https://www.reddit.com/r/SideHustle/new/.rss','rss'),
('r/PaidSurveys','https://www.reddit.com/r/PaidSurveys/new/.rss','rss'),
('r/swagbucks','https://www.reddit.com/r/Swagbucks/new/.rss','rss'),
('ppomppu_event','https://www.ppomppu.co.kr/rss.php?id=event','rss'),
('ppomppu_p4','https://www.ppomppu.co.kr/rss.php?id=free4','rss')
on conflict (url) do nothing;

-- 샘플 앱 리뷰 2개
insert into app_reviews (app_name, app_name_en, rating, payout_min_krw, payout_speed, verified, review_ko, review_en, store_url, referral_url, pros, cons) values
('캐시워크','CashWalk',4.2,5000,'7일','true','만보기+퀴즈로 하루 300~500원. 출금 5000원부터, 7일 내 입금. 검증됨.','Pedometer+quiz 300-500 KRW/day. Payout from 5000 KRW within 7 days. Verified.','https://cashwalk.com','https://cashwalk.com/ref/YOUR_CODE','{무료,매일가능,초보쉬움}','{단가낮음,광고많음}'),
('Prolific','Prolific',4.8,13500,'2일','true','영국 대학 설문, 건당 $8~12, PayPal 2일 출금. 번역기로 가능.','UK survey panel, $8-12 per study, PayPal in 2 days. Translator OK.','https://www.prolific.com','https://www.prolific.com?ref=YOUR_CODE','{고단가,승인빠름,신뢰높음}','{대기시간,영어필요}')
on conflict do nothing;
