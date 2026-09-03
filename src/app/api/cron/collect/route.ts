import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { FEEDS, fetchFeed, RawItem } from "@/lib/rss";
import { translateText } from "@/lib/translate";

// Vercel Cron은 Authorization: Bearer <CRON_SECRET> 으로 올 수 있음 — 없으면 공개지만 내부에서는 secret 체크
function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return true; // MVP: secret 없으면 누구나 수동 트리거 가능 (무자본)
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

// 간단 수익 추정 — 제목에서 $ 또는 원 숫자 뽑기, 없으면 기본값
function estimateReward(title: string): { krw: number; usd: number } {
  const mUsd = title.match(/\$(\d+(?:\.\d+)?)/);
  if (mUsd) {
    const usd = Number(mUsd[1]);
    return { usd, krw: Math.round(usd * 1350) };
  }
  const mKrw = title.match(/(\d{3,6})\s*원/);
  if (mKrw) {
    const krw = Number(mKrw[1]);
    return { krw, usd: Math.round((krw / 1350) * 10) / 10 };
  }
  return { krw: 5000, usd: 4 }; // 기본값 — 미검증, 어드민이 수정
}

export async function GET(req: NextRequest) {
  return handle(req);
}
export async function POST(req: NextRequest) {
  return handle(req);
}

async function handle(req: NextRequest) {
  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";
  const limit = Math.min(Number(url.searchParams.get("limit") || "5"), 10);

  // if (!isAuthorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const supabase = getSupabase();

  // 1) 수집 — 코드 FEEDS + DB sources(매일 새로운 곳) 합치기
  const all: RawItem[] = [];
  const errors: string[] = [];
  let feeds = [...FEEDS];
  if (supabase) {
    try {
      const { data: dbSources } = await supabase.from("sources").select("name, url").eq("enabled", true);
      if (dbSources) {
        const existingUrls = new Set(feeds.map(f=>f.url));
        for (const s of dbSources as any[]) if (!existingUrls.has(s.url)) feeds.push({ source: s.name, url: s.url });
      }
    } catch {}
  }
  for (const f of feeds) {
    try {
      const items = await fetchFeed(f.url, f.source);
      all.push(...items.slice(0, Math.ceil(limit / Math.max(1, feeds.length)) + 1));
    } catch (e:any) {
      errors.push(`${f.source}: ${e.message}`);
    }
  }

  // 2) 중복 제거 (link 기준) + DB 중복 체크
  const seen = new Map<string, RawItem>();
  for (const it of all) if (!seen.has(it.link)) seen.set(it.link, it);
  let unique = [...seen.values()].slice(0, limit * 2);

  let existingLinks = new Set<string>();
  if (supabase) {
    const { data } = await supabase.from("posts").select("source_url").in("source_url", unique.map(u=>u.link));
    existingLinks = new Set((data||[]).map((d:any)=>d.source_url));
    unique = unique.filter(u=>!existingLinks.has(u.link));
  }
  unique = unique.slice(0, limit);

  // 3) 번역 + DB 삽입
  const toInsert: any[] = [];
  for (const it of unique) {
    const reward = estimateReward(it.title);
    // 무료 구글 번역 — 실패해도 원문 유지
    let title_ko = it.title;
    let title_en = it.title;
    let desc_ko = it.description || it.title;
    let desc_en = it.description || it.title;
    try {
      // r/beermoney는 EN → KO 번역이 핵심
      if (it.source.startsWith("r/")) {
        const ko = await translateText(it.title, "ko");
        const koDesc = it.description ? await translateText(it.description.slice(0,400), "ko") : ko;
        title_ko = ko; desc_ko = koDesc; title_en = it.title; desc_en = it.description || it.title;
      } else {
        const en = await translateText(it.title, "en");
        title_en = en; title_ko = it.title;
      }
    } catch {}

    toInsert.push({
      title_ko, title_en,
      desc_ko, desc_en,
      reward_krw: reward.krw,
      reward_usd: reward.usd,
      time_minutes: 20, // 추정 — 어드민이 검증 시 수정
      category: it.source.startsWith("r/") ? "해외싸이트" : "이벤트",
      category_en: it.source.startsWith("r/") ? "Overseas" : "Event",
      source_url: it.link,
      referral_url: null,
      lang_original: it.source.startsWith("r/") ? "en" : "ko",
      verified: false, // 자동 수집은 무조건 미검증
      deadline: new Date(Date.now()+7*86400000).toISOString().slice(0,10),
      tags: ["자동수집","미검증","번역됨"],
      steps_ko: ["원문 링크에서 조건 확인", "요구사항 충족 후 참여", "입금/보상 확인 후 어드민에 제보"],
      steps_en: ["Check conditions on source link", "Complete requirements", "Confirm payout"],
      is_home: true,
      investment_required: false,
    });
  }

  if (dry) {
    return NextResponse.json({ dry: true, fetched: all.length, unique: unique.length, errors, preview: toInsert });
  }

  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase not configured — set env and redeploy. Preview only.", fetched: all.length, preview: toInsert, errors });
  }

  if (toInsert.length===0) return NextResponse.json({ ok: true, inserted: 0, fetched: all.length, errors, message: "No new items (duplicates or empty)" });

  const { data, error } = await supabase.from("posts").insert(toInsert).select("id, title_ko, source_url");
  if (error) return NextResponse.json({ error: error.message, fetched: all.length, errors }, { status: 500 });

  return NextResponse.json({ ok: true, inserted: data?.length||0, fetched: all.length, errors, data });
}
