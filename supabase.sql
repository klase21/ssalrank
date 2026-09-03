-- supabase.sql — Supabase SQL Editor에 그대로 붙여넣기
-- Mock 탈출용 테이블 + RLS (읽기 전체 허용, 쓰기는 anon도 허용 — MVP용, 나중에 auth 추가)

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title_ko text not null,
  title_en text not null,
  desc_ko text not null,
  desc_en text not null,
  reward_krw int not null default 0,
  reward_usd numeric not null default 0,
  time_minutes int not null default 5,
  category text not null default '앱테크',
  category_en text not null default 'AppTech',
  source_url text not null,
  referral_url text,
  lang_original text not null default 'ko' check (lang_original in ('ko','en')),
  verified boolean not null default false,
  deadline date not null default (current_date + interval '7 days'),
  tags text[] not null default '{}',
  steps_ko text[] not null default '{}',
  steps_en text[] not null default '{}',
  is_home boolean not null default true,
  investment_required boolean not null default false,
  created_at timestamp with time zone default now()
);

-- RLS 끄고 싶으면 아래 주석 해제, 켜둘거면 아래 정책 사용
alter table posts enable row level security;

drop policy if exists "public read" on posts;
create policy "public read" on posts for select using (true);

drop policy if exists "public insert" on posts;
create policy "public insert" on posts for insert with check (true);

drop policy if exists "public update" on posts;
create policy "public update" on posts for update using (true);

drop policy if exists "public delete" on posts;
create policy "public delete" on posts for delete using (true);

-- 인덱스
create index if not exists idx_posts_verified on posts(verified);
create index if not exists idx_posts_created on posts(created_at desc);

-- Mock 데이터 시드 (선택)
-- 아래는 src/data/posts.ts 7개 중 2개 예시, 필요하면 전체 넣기
insert into posts (title_ko, title_en, desc_ko, desc_en, reward_krw, reward_usd, time_minutes, category, category_en, source_url, referral_url, lang_original, verified, deadline, tags, steps_ko, steps_en, is_home)
values
('Prolific 설문 1건 - 고단가 영어 설문','Prolific Survey - High Paying English Survey','영국 대학 리서치 플랫폼. 영어 설문 하나당 $8~12. 번역기 돌려도 가능.','UK university research platform. $8-12 per survey. Use translator.','15000','11','18','설문','Survey','https://www.prolific.com','https://www.prolific.com?ref=YOUR_CODE','en',true,'2026-09-10','{집에서가능,영어번역필요}', '{Prolific 가입,프로필 설문 10개 작성,PayPal 출금}', '{Sign up,Complete 10 profile surveys,PayPal payout}', true),
('토스뱅크 모임통장 개설 2만원 페이백','Toss Bank Group Account - 20,000 KRW Cashback','토스뱅크 신규 모임통장 개설 시 2만원 즉시 지급. 5분컷.','Open Toss Bank group account, get 20,000 KRW instantly. 5 min.','20000','15','5','금융','Finance','https://www.tossbank.com','https://tossbank.com/ref/YOUR_CODE','ko',true,'2026-09-05','{5분컷,0원투자}', '{토스 앱 개설,친구 1명 초대,2만원 입금}', '{Open group account,Invite 1 friend,Get 20k}', true)
on conflict do nothing;
