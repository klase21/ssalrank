import { NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/translate";

export async function POST(req: NextRequest) {
  try {
    const { text, target } = await req.json();
    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }
    const tl = target === "en" ? "en" : "ko";
    // 5000자 제한 - 구글 무료 엔드포인트는 길면 잘림
    const truncated = text.slice(0, 4500);
    const translated = await translateText(truncated, tl);
    return NextResponse.json({ translated, original: text });
  } catch (e) {
    return NextResponse.json({ error: "translate failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("q") || searchParams.get("text");
  const target = (searchParams.get("tl") || searchParams.get("target") || "ko") as "ko" | "en";
  if (!text) return NextResponse.json({ error: "q is required" }, { status: 400 });
  const translated = await translateText(text.slice(0, 4500), target);
  return NextResponse.json({ translated, original: text });
}
