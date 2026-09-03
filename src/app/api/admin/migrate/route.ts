import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

// POST /api/admin/migrate — Supabase SQL 자동 실행 (무자본)
// ENV 필요: SUPABASE_DB_URL (postgres://postgres.[ref]:[password]@aws-0-... .supabase.co:5432/postgres)
// 얻는 법: Supabase → Project Settings → Database → Connection string → URI

export async function POST(req: NextRequest) {
  const dbUrl = process.env.SUPABASE_DB_URL || process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({
      ok: false,
      error: "SUPABASE_DB_URL not set",
      hint: "Supabase → Project Settings → Database → Connection string (URI) 복사 → Vercel env SUPABASE_DB_URL에 넣고 Redeploy. 로컬은 .env.local에 넣고 POST /api/admin/migrate 호출",
      files: ["supabase.sql","supabase_clicks.sql","supabase_app_reviews.sql"],
    }, { status: 503 });
  }

  // 동적 import로 pg가 없을 때도 빌드 안깨지게
  let Client: any;
  try {
    const pg = await import("pg");
    Client = pg.Client;
  } catch {
    return NextResponse.json({ ok: false, error: "pg not installed" }, { status: 500 });
  }

  const files = ["supabase.sql","supabase_clicks.sql","supabase_app_reviews.sql"];
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  const results: any[] = [];
  try {
    await client.connect();
    for (const f of files) {
      try {
        const sql = readFileSync(join(process.cwd(), f), "utf8");
        await client.query(sql);
        results.push({ file: f, ok: true });
      } catch (e:any) {
        // 이미 테이블 있으면 에러 나도 ok (IF NOT EXISTS로 처리되지만 view는 실패할 수 있음)
        const msg = e.message?.slice(0,500);
        const isAlreadyExists = /already exists/i.test(msg);
        results.push({ file: f, ok: isAlreadyExists, error: isAlreadyExists ? null : msg });
        if (!isAlreadyExists) throw e;
      }
    }
    await client.end();
    return NextResponse.json({ ok: true, results });
  } catch (e:any) {
    try { await client.end(); } catch {}
    return NextResponse.json({ ok: false, error: e.message?.slice(0,1000), results }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    hint: "POST /api/admin/migrate 로 실행. ENV SUPABASE_DB_URL 필요",
    files: ["supabase.sql","supabase_clicks.sql","supabase_app_reviews.sql"],
    howToGetDbUrl: "Supabase → Project Settings → Database → Connection string → URI (password 포함) → Vercel env SUPABASE_DB_URL",
  });
}
