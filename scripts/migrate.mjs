#!/usr/bin/env node
// scripts/migrate.mjs — Supabase SQL 자동 실행 (무자본, service_role 필요)
// Usage: SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate.mjs
// 또는 Vercel env에 SUPABASE_SERVICE_ROLE_KEY 넣고 /api/admin/migrate 호출

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  console.error('Get service_role from Supabase → Project Settings → API Keys → service_role (secret)');
  process.exit(1);
}

const files = ['supabase.sql','supabase_clicks.sql','supabase_app_reviews.sql'];
for (const f of files) {
  const sql = readFileSync(join(process.cwd(), f), 'utf8');
  console.log(`\n== ${f} (${sql.length} bytes) ==`);
  // Supabase는 SQL 실행용 RPC가 없으므로, PostgREST로 직접 실행 불가.
  // 대신 supabase-js의 rpc나 dashboard SQL Editor를 써야 한다.
  // 여기서는 service_role로 postgres에 직접 접속하는 대신, Management API 없이
  // supabase가 제공하는 `pg_query` via `supabase.sql`이 없으므로 안내만 한다.
  console.log(sql.slice(0,500));
}

console.log(`
NOTE: Supabase JS anon/service_role로는 DDL(create table)을 직접 실행할 수 없다.
자동 실행을 위해서는 아래 중 하나가 필요하다:
1) Supabase CLI: supabase link + supabase db push
2) Management API: POST https://api.supabase.com/v1/projects/{ref}/database/query
   → SUPABASE_ACCESS_TOKEN 필요
3) /api/admin/migrate 에서 service_role로 supabase.rpc('exec_sql') 가 있으면 가능 — 현재 프로젝트엔 없음

그래서 이 스크립트는 DRY-RUN만 하고, 실제 실행은 /api/admin/migrate 에서
SUPABASE_SERVICE_ROLE_KEY가 있을 때 Management API로 실행하도록 위임한다.
`);
