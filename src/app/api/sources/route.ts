import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ sources: [], source: "mock" });
  const { data } = await supabase.from("sources").select("*").order("created_at", { ascending: false });
  return NextResponse.json({ sources: data });
}
export async function POST(req: NextRequest) {
  const supabase = getSupabase();
  if (!supabase) return NextResponse.json({ error: "Supabase not configured" }, { status: 503 });
  const body = await req.json();
  if (!body.name || !body.url) return NextResponse.json({ error: "name, url required" }, { status: 400 });
  const { data, error } = await supabase.from("sources").insert({ name: body.name, url: body.url, kind: body.kind||'rss' }).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ source: data });
}
