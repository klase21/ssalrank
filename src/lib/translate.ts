// src/lib/translate.ts
// QuantTerminal/lib/news/translateNews.ts 방식 그대로 이식
// https://github.com/klase21/QuantTerminal/blob/main/lib/news/translateNews.ts
// 무료 구글 번역 엔드포인트 - API 키 불필요, 무자본 운영용

export type TranslateTarget = "ko" | "en";

// 메모리 캐시 (서버에서는 요청 단위로 유지, 클라이언트에서는 메모리 유지)
const cache = new Map<string, string>();

export async function translateText(text: string, target: TranslateTarget = "ko"): Promise<string> {
  if (!text || !text.trim()) return "";
  const key = `${target}:${text}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const url =
    `https://translate.googleapis.com/translate_a/single` +
    `?client=gtx` +
    `&sl=auto` +
    `&tl=${target}` +
    `&dt=t` +
    `&q=${encodeURIComponent(text)}`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.error("GOOGLE TRANSLATE ERROR:", res.status);
      return text;
    }
    const data = await res.json();
    const translated = data?.[0]?.map((t: any) => t[0])?.join("") as string;
    const result = translated || text;
    cache.set(key, result);
    return result;
  } catch (err) {
    console.error("TRANSLATE FAILED:", err);
    return text;
  }
}

export function getCachedTranslation(key: string) {
  return cache.get(key);
}
export function setCachedTranslation(key: string, value: string) {
  cache.set(key, value);
}
