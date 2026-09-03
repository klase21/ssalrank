import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { post_id, kind } = await req.json();
    if (!post_id || !["referral","source"].includes(kind)) {
      return NextResponse.json({ error: "post_id and kind(referral|source) required" }, { status: 400 });
    }
    const supabase = getSupabase();
    if (!supabase) return NextResponse.json({ ok: true, mocked: true }); // Mock 모드면 그냥 성공
    const { error } = await supabase.from("clicks").insert({ post_id, kind });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ stats: [], source: "mock" });
  // 뷰가 있으면 뷰에서, 없으면 직접 집계
  const { data, error } = await supabase.from("click_stats").select("*");
  if (!error && data) return NextResponse.json({ stats: data, source: "view" });
  // fallback 직접 집계
  const { data: clicks } = await supabase.from("clicks").select("post_id, kind");
  const { data: posts } = await supabase.from("posts").select("id, title_ko");
  const map = new Map<string, { referral: number; source: number }>();
  (clicks||[]).forEach((c:any)=> {
    const m = map.get(c.post_id) || { referral:0, source:0 };
    if (c.kind==="referral") m.referral++; else m.source++;
    map.set(c.post_id, m);
  });
  const stats = (posts||[]).map((p:any)=> ({
    id: p.id, title_ko: p.title_ko,
    referral_clicks: map.get(p.id)?.referral||0,
    source_clicks: map.get(p.id)?.source||0,
    total_clicks: (map.get(p.id)?.referral||0)+(map.get(p.id)?.source||0),
  })).sort((a:any,b:any)=>b.referral_clicks-a.referral_clicks);
  return NextResponse.json({ stats, source: "fallback" });
}
