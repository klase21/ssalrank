import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { posts as mockPosts } from "@/data/posts";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) {
    // Mock fallback — ENV 없으면 Mock 반환
    return NextResponse.json({ posts: mockPosts, source: "mock" });
  }
  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("supabase fetch error", error);
    return NextResponse.json({ posts: mockPosts, source: "mock_fallback", error: error.message });
  }
  // DB 컬럼 → Post 타입 매핑 (DB는 snake_case 그대로)
  return NextResponse.json({ posts: data, source: "supabase" });
}

export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL/KEY in .env.local" }, { status: 503 });
  const body = await req.json();
  // 필수 필드 검증
  const required = ["title_ko","title_en","desc_ko","desc_en","reward_krw","reward_usd","time_minutes","source_url"];
  for (const f of required) if (!body[f] && body[f] !== 0) return NextResponse.json({ error: `missing ${f}` }, { status: 400 });

  const payload = {
    title_ko: body.title_ko,
    title_en: body.title_en,
    desc_ko: body.desc_ko,
    desc_en: body.desc_en,
    reward_krw: Number(body.reward_krw),
    reward_usd: Number(body.reward_usd),
    time_minutes: Number(body.time_minutes),
    category: body.category || "앱테크",
    category_en: body.category_en || "AppTech",
    source_url: body.source_url,
    referral_url: body.referral_url || null,
    lang_original: body.lang_original || "ko",
    verified: !!body.verified,
    deadline: body.deadline || new Date(Date.now()+7*86400000).toISOString().slice(0,10),
    tags: body.tags || [],
    steps_ko: body.steps_ko || [],
    steps_en: body.steps_en || [],
    is_home: body.is_home ?? true,
    investment_required: body.investment_required ?? false,
  };

  const { data, error } = await supabase.from("posts").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ post: data });
}
