// src/lib/rss.ts — 무료 RSS 수집 (무자본)
// Reddit r/beermoney + Ppomppu 등 공개 RSS만 사용 — 로그인/쿠키/프록시 없음

export type RawItem = {
  title: string;
  link: string;
  pubDate?: string;
  description?: string;
  source: string;
};

// 아주 단순한 XML 파서 — fast-xml-parser 없이 정규식으로 처리 (무자본, 의존성 최소화)
function extractTag(xml: string, tag: string): string[] {
  const re = new RegExp(`<${tag}(?:[^>]*)>([\\s\\S]*?)<\\/${tag}>`, "gi");
  const out: string[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml))) out.push(m[1].trim());
  return out;
}
function unescapeXml(s: string) {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'");
}

export function parseRss(xml: string, source: string): RawItem[] {
  // RSS 2.0: <item>, Atom: <entry>
  const items: RawItem[] = [];
  const isAtom = xml.includes("<entry");
  const blocks = isAtom ? extractTag(xml, "entry") : extractTag(xml, "item");
  for (const b of blocks) {
    const title = unescapeXml(extractTag(b, "title")[0] || "").replace(/<[^>]+>/g,"").trim();
    let link = "";
    if (isAtom) {
      const linkTag = b.match(/<link[^>]*href="([^"]+)"/i);
      link = linkTag ? linkTag[1] : unescapeXml(extractTag(b, "id")[0]||"");
    } else {
      link = unescapeXml(extractTag(b, "link")[0] || "").replace(/<[^>]+>/g,"").trim();
    }
    const desc = unescapeXml(extractTag(b, isAtom ? "summary" : "description")[0] || "").replace(/<[^>]+>/g,"").slice(0,500).trim();
    const pubDate = unescapeXml(extractTag(b, isAtom ? "updated" : "pubDate")[0] || "").trim();
    if (title && link) items.push({ title, link, description: desc, pubDate, source });
  }
  return items;
}

export const FEEDS: { source: string; url: string }[] = [
  { source: "r/beermoney", url: "https://www.reddit.com/r/beermoney/new/.rss" },
  { source: "r/SideHustle", url: "https://www.reddit.com/r/SideHustle/new/.rss" },
  // KR: 뽐뿌/클리앙은 RSS가 불안정해서 MVP에서는 reddit 2개만, 확장은 아래 추가
  // { source: "ppomppu", url: "https://www.ppomppu.co.kr/rss.php?forum=event" },
];

export async function fetchFeed(url: string, source: string): Promise<RawItem[]> {
  const res = await fetch(url, {
    headers: { "User-Agent": "ssalrank/1.0 (beermoney ranking; +https://ssalrank.vercel.app)" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`fetch ${source} failed ${res.status}`);
  const xml = await res.text();
  return parseRss(xml, source);
}
