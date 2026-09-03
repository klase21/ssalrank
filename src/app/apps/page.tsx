"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type AppReview = {
  id: string;
  app_name: string;
  app_name_en: string;
  rating: number;
  payout_min_krw: number;
  payout_speed: string;
  verified: boolean;
  review_ko: string;
  review_en: string;
  store_url: string;
  referral_url?: string;
  pros: string[];
  cons: string[];
};

export default function AppsPage() {
  const [lang, setLang] = useState<"ko"|"en">("ko");
  const [apps, setApps] = useState<AppReview[]>([]);
  useEffect(()=>{ fetch("/api/apps").then(r=>r.json()).then(d=>setApps(d.apps||[])).catch(()=>{}); },[]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 border-b bg-white/80 backdrop-blur dark:bg-zinc-950/80 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="font-black">🍚 쌀먹랭킹</Link>
          <div className="flex gap-2">
            <button onClick={()=>setLang("ko")} className={`rounded-full px-3 py-1 text-xs ${lang==="ko"?"bg-black text-white":"bg-zinc-100"}`}>한국어</button>
            <button onClick={()=>setLang("en")} className={`rounded-full px-3 py-1 text-xs ${lang==="en"?"bg-black text-white":"bg-zinc-100"}`}>English</button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6">
        <h1 className="text-2xl font-black">{lang==="ko" ? "쌀먹 앱 리뷰" : "Beermoney App Reviews"}</h1>
        <p className="mt-1 text-sm text-zinc-500">{lang==="ko" ? "직접 써보고 입금 확인한 앱만. 안드로이드 앱에선 이 탭이 메인." : "Only hands-on tested. Main tab in Android app."}</p>
        <p className="mt-1 text-xs text-zinc-400">Tip: 앱 리뷰는 SEO로도 유입된다 — `캐시워크 후기` 같은 키워드로</p>
        {apps.length===0 && <div className="mt-6 rounded-2xl border border-dashed p-8 text-center text-sm text-zinc-400">아직 리뷰 없음 — Supabase에 supabase_app_reviews.sql 실행 후 /admin에서 추가 또는 시드 2개가 뜬다</div>}
        <div className="mt-6 grid gap-4">
          {apps.map(a=>(
            <div key={a.id} className="rounded-2xl border bg-white p-5 dark:bg-zinc-900 dark:border-zinc-800">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-bold">{lang==="ko"?a.app_name:a.app_name_en} <span className="ml-2 text-sm font-normal text-yellow-600">★ {Number(a.rating).toFixed(1)}</span> {a.verified && <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">검증됨</span>}</h2>
                  <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{lang==="ko"?a.review_ko:a.review_en}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">최소출금 {a.payout_min_krw.toLocaleString()}원</span>
                <span className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">{a.payout_speed}</span>
                {(a.pros||[]).slice(0,2).map(p=> <span key={p} className="rounded-full bg-green-50 px-2 py-1 text-green-700">+{p}</span>)}
                {(a.cons||[]).slice(0,2).map(c=> <span key={c} className="rounded-full bg-red-50 px-2 py-1 text-red-600">-{c}</span>)}
              </div>
              <div className="mt-4 flex gap-2">
                {a.referral_url && <a href={a.referral_url} target="_blank" className="flex-1 rounded-full bg-yellow-400 py-2 text-center text-sm font-bold">레퍼럴로 가입 →</a>}
                <a href={a.store_url} target="_blank" className="flex-1 rounded-full border py-2 text-center text-sm">스토어 가기</a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center text-xs text-zinc-400"><Link href="/admin" className="underline">어드민에서 앱 리뷰 추가</Link> · <Link href="/" className="underline">랭킹으로</Link></div>
      </main>
    </div>
  );
}
