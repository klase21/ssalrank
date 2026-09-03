"use client";
import { useState, useMemo, useEffect } from "react";
import { posts as mockPosts, hourlyWage, Post } from "@/data/posts";
import PostCard from "@/components/PostCard";
import LangToggle from "@/components/LangToggle";

type Filter = "all" | "5m" | "30m" | "home" | "verified";

export default function Home() {
  const [lang, setLang] = useState<"ko" | "en">("ko");
  const [filter, setFilter] = useState<Filter>("all");
  const [q, setQ] = useState("");
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [source, setSource] = useState<"mock"|"supabase"|"mock_fallback">("mock");
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    fetch("/api/posts").then(r=>r.json()).then(d=>{
      if (d.posts && Array.isArray(d.posts) && d.posts.length>0) {
        setPosts(d.posts);
        setSource(d.source || "supabase");
      }
    }).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const filtered = useMemo(() => {
    let list = [...posts];
    if (filter === "5m") list = list.filter(p => p.time_minutes <= 5);
    if (filter === "30m") list = list.filter(p => p.time_minutes <= 30);
    if (filter === "home") list = list.filter(p => p.is_home);
    if (filter === "verified") list = list.filter(p => p.verified);
    if (q) {
      const qq = q.toLowerCase();
      list = list.filter(p => (p.title_ko + p.title_en + p.desc_ko + p.desc_en).toLowerCase().includes(qq));
    }
    list.sort((a,b)=> hourlyWage(b, lang) - hourlyWage(a, lang));
    return list;
  }, [posts, filter, lang, q]);

  const t = lang === "ko" ? {
    title: "오늘의 쌀먹 랭킹",
    sub: "한국 + 영어권 쌀먹을 시급으로 줄세웠습니다. 번역은 구글 무료 번역으로 했습니다.",
    search: "검색 (예: 토스, Prolific, 설문)",
    filterAll: "전체",
    filter5: "5분컷",
    filter30: "30분컷",
    filterHome: "집에서 가능",
    filterVerified: "검증됨만",
    count: `총 ${filtered.length}개 · 시급 높은 순`,
    referralInfo: "레퍼럴 링크 포함 · 투명하게 공개합니다",
    admin: "어드민",
  } : {
    title: "Today's Beermoney Ranking",
    sub: "KR + US beermoney ranked by hourly wage. Free Google Translate.",
    search: "Search (e.g. Toss, Prolific, survey)",
    filterAll: "All",
    filter5: "≤5 min",
    filter30: "≤30 min",
    filterHome: "Work from home",
    filterVerified: "Verified only",
    count: `${filtered.length} items · sorted by hourly wage`,
    referralInfo: "May contain referral links · disclosed transparently",
    admin: "Admin",
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur dark:bg-zinc-950/80 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍚</span>
            <span className="font-black tracking-tight">쌀먹랭킹</span>
            <span className="hidden sm:inline text-xs text-zinc-400">BEERMONEY.RANK</span>
            {source==="mock" && <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[10px] text-zinc-500">MOCK</span>}
            {source==="supabase" && <span className="rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-bold text-green-700">LIVE DB</span>}
          </div>
          <div className="flex items-center gap-3">
            <LangToggle lang={lang} setLang={setLang} />
            <a href="/apps" className="text-xs font-medium text-zinc-600 hover:underline">앱 리뷰</a>
            <a href="/admin" className="hidden sm:block text-xs text-zinc-500 hover:underline">{t.admin} →</a>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        {source==="mock" && (
          <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed dark:bg-amber-950/30 dark:border-amber-900">
            <span className="font-bold">Mock 모드:</span> Supabase ENV가 없어서 Mock 데이터로 동작 중. <code>supabase.sql</code>을 Supabase에 붙이고 <code>.env.local</code>에 URL/KEY 넣으면 LIVE DB로 전환됨.
          </div>
        )}
        <div className="rounded-3xl bg-gradient-to-br from-yellow-400 to-orange-400 p-6 sm:p-8 text-black">
          <h1 className="text-2xl font-black sm:text-3xl">{t.title}</h1>
          <p className="mt-2 text-sm opacity-80 sm:text-base">{t.sub}</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder={t.search} className="w-full rounded-full bg-white px-4 py-2.5 text-sm outline-none placeholder:text-zinc-400" />
            <span className="shrink-0 rounded-full bg-black px-4 py-2 text-center text-xs font-bold text-white">{t.referralInfo}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {[
            ["all", t.filterAll],
            ["5m", t.filter5],
            ["30m", t.filter30],
            ["home", t.filterHome],
            ["verified", t.filterVerified],
          ].map(([k,label])=>(
            <button key={k} onClick={()=>setFilter(k as Filter)} className={`rounded-full border px-4 py-2 text-sm font-medium transition ${filter===k ? "bg-black text-white border-black dark:bg-white dark:text-black" : "bg-white dark:bg-zinc-900 dark:border-zinc-800 hover:bg-zinc-100"}`}>{label}</button>
          ))}
        </div>

        <div className="mt-3 text-xs text-zinc-500">{loading ? "불러오는 중..." : t.count} {source!=="mock" && `· ${source}`}</div>

        <div className="mt-4 flex flex-col gap-3">
          {filtered.map((p,i)=><PostCard key={p.id} post={p} lang={lang} rank={i+1} />)}
          {filtered.length===0 && <div className="rounded-2xl border border-dashed p-8 text-center text-zinc-400">검색 결과 없음</div>}
        </div>

        <div className="mt-8 rounded-2xl border bg-white p-5 dark:bg-zinc-900 dark:border-zinc-800">
          <h2 className="font-bold">{lang==="ko" ? "제보하기" : "Submit a find"}</h2>
          <p className="mt-1 text-sm text-zinc-500">{lang==="ko" ? "새로운 쌀먹을 발견하면 제보해주세요. 검증 후 랭킹에 올리고 레퍼럴은 투명하게 공개합니다." : "Found a beermoney? Submit it. We verify then rank, referral disclosed."}</p>
          <a href="mailto:tip@ssalrank.com" className="mt-3 inline-block rounded-full bg-zinc-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-black">tip@ssalrank.com</a>
        </div>

        <footer className="mt-10 text-center text-xs text-zinc-400">
          <p>© 2026 쌀먹랭킹 · {lang==="ko" ? "레퍼럴 수익으로 운영됩니다. 미검증 글은 주의하세요." : "Supported by referrals. Beware unverified posts."}</p>
          <p className="mt-1"><a href="/admin" className="underline">어드민</a> · <span>문의: tip@ssalrank.com</span></p>
        </footer>
      </main>
    </div>
  );
}
