# ssalrank

[![CI](https://github.com/klase21/ssalrank/actions/workflows/ci.yml/badge.svg)](https://github.com/klase21/ssalrank/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

ssalrank is a KR + EN beermoney ranking service. Every finding is ranked by hourly wage (reward ÷ time × 60), translated for free, and disclosed transparently for referral.

Money first, category second — apptech, surveys, finance cashback, and gig jobs compete on the same hourly ranking.

## Live Demo

https://ssalrank-bt8bro5fr-klase21s-projects.vercel.app

The hosted demo is live on Vercel with Supabase. `MOCK` badge means no env, `LIVE DB` means Supabase is connected. Filters, hourly ranking, bilingual toggle, detail pages, and referral/source click tracking are available.

Local dev falls back to `src/data/posts.ts` mock when `NEXT_PUBLIC_SUPABASE_URL` is not set, so the project runs with zero config.

> ssalrank is not an official partner of Toss, Prolific, Swagbucks, or any listed service. Earnings are estimates and deadlines change. Source terms, eligibility, and referral policies remain the user's responsibility.

## Highlights

- Hourly-wage ranking as primary sort — `(reward / time_minutes) * 60` with KRW normalization for EN rewards (`USD × 1350`).
- Bilingual KR/EN with free Google Translate (`translate.googleapis.com/translate_a/single?client=gtx`) — no API key, no cost. Same method as `QuantTerminal/lib/news/translateNews.ts`.
- URL-bilingual posts (`title_ko`, `title_en`, `desc_ko`, `desc_en`, `steps_ko`, `steps_en`) with `AI번역` badge when display lang differs from `lang_original`.
- Filters: `5분컷`, `30분컷`, `집에서 가능`, `검증됨만` + keyword search; rank-aware after filtering.
- Transparent referrals — `referral_url` and `source_url` shown side-by-side, click intent logged separately.
- Admin write + auto hourly preview + one-click free translation (KO→EN / EN→KO via `/api/translate`).
- Click dashboard in `/admin` — `referral_clicks` vs `source_clicks` per post, sorted by referral.

## Supported sources

### KR

Toss Bank, CashWalk, and other apptech/finance events; Danggeun gig posts; community finds (Ppomppu, Clien) via manual curation. All KR originals are translated to EN on demand.

### EN

r/beermoney patterns, Prolific, UserTesting, Swagbucks, Amazon Influencer — curated manually for MVP. All EN originals are translated to KO on demand via the same free endpoint.

No scheduler or scraper is enabled by default. Collection is manual in MVP; `vercel cron` + RSS fetch is the planned next layer.

## Translation (zero-cost)

- `src/lib/translate.ts:1` — ported from `https://github.com/klase21/QuantTerminal/blob/main/lib/news/translateNews.ts`
- Endpoint: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl={ko|en}&dt=t&q=...`
- `src/app/api/translate/route.ts:1` — server proxy to avoid CORS, truncates at 4500 chars, caches in-memory
- Admin uses `POST /api/translate { text, target }` to fill opposite language; detail toggle is instant client-side

No ChatGPT API, no billing.

## Ranking and verification

- Each post stores `reward_krw`, `reward_usd`, `time_minutes`; display and sort both normalize to KRW.
- `verified` means deposit-proof checked; `미검증` is shown with caution copy and amber notice.
- `deadline` drives `D-{n} 마감임박` when `n ≤ 3`; expired posts stay visible but sink on hourly sort if low wage.
- Tags (`#5분컷`, `#선착순` etc.) are display-only; filtering is driven by `time_minutes`, `is_home`, `verified`.

## Referral and click tracking

- `posts.referral_url` (nullable) + `posts.source_url` (required) — detail page renders both
- `supabase_clicks.sql:1` — `clicks(post_id, kind, created_at)` with RLS `insert/select true` + `click_stats` view
- `src/app/api/click/route.ts:1` — `POST /api/click { post_id, kind }` and `GET /api/click` (view or fallback aggregation)
- Detail page calls `track("referral"|"source")` on click; admin dashboard reads `GET /api/click` sorted by `referral_clicks`

If the clicks table is not created, writes are mocked and the dashboard shows empty state.

## Safety boundaries

- No login automation, no private endpoint use, no invented rewards — rewards are operator-entered estimates
- `미검증` posts require user-side small-amount testing; `선입금`/`개인정보 과도 요구` → stop
- Referral is disclosed per-post; no hidden affiliate injection
- `.env.local` and `.env*.local` are gitignored; Vercel env must be set separately (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- Deployment Protection should be `Disabled` for public access (Vercel → Settings → Deployment Protection)

## Architecture

- Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS
- Supabase (Postgres + RLS) for `posts` and `clicks`; no auth yet (MVP RLS allows public read/write, to be tightened)
- `src/data/posts.ts:1` — mock fallback and wage helpers (`hourlyWage`, `displayReward`, `displayHourly`)
- `src/lib/supabase.ts:1` — `getSupabase()` with env guard; `src/app/api/posts/route.ts:1` handles live/mock switch
- `src/components/PostCard.tsx:1`, `src/components/LangToggle.tsx:1` — ranking card and bilingual toggle
- `supabase.sql:1` + `supabase_clicks.sql:1` — full schema + indexes + seed

See `src/lib/translate.ts:1` for the free translation port.

## Requirements

- Windows 10 or Windows 11
- PowerShell 5.1 or PowerShell 7
- Node.js 20.9 or newer
- npm 10 or newer

## Quick start

```powershell
git clone https://github.com/klase21/ssalrank.git
Set-Location ssalrank
npm.cmd ci
Copy-Item .env.example .env.local
# fill NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from Supabase → Settings → Data API / API Keys
npm.cmd run build
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
```

Open http://127.0.0.1:3000 — `MOCK` badge means Supabase env missing; `LIVE DB` means connected.

Supabase setup:

1. Create free project at supabase.com
2. SQL Editor → paste `supabase.sql` → Run
3. SQL Editor → paste `supabase_clicks.sql` → Run (for click dashboard)
4. Project Settings → Data API / API Keys → copy URL + anon key → `.env.local` and Vercel → Settings → Environment Variables → Redeploy

Manual npm setup already covers `npm.cmd ci`; `npm.cmd run dev` is enough for local mock.

## Validation

```powershell
npm.cmd run build
npm.cmd run dev -- --hostname 127.0.0.1 --port 3000
# check http://127.0.0.1:3000/api/posts → {"source":"mock"} or {"source":"supabase"}
# check http://127.0.0.1:3000/api/translate?q=hello&target=ko → {"translated":"안녕하세요"}
# check http://127.0.0.1:3000/api/click → {"stats":[...]}
```

No cloud billing is required for core flows; translation and hosting both use free tiers.

## License and contributing

Licensed under the [MIT License](LICENSE). See `CONTRIBUTING.md`, `SECURITY.md` if present.

