"use client";
import { useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { posts, displayReward, displayHourly, hourlyWage } from "@/data/posts";
import { useState } from "react";

export default function PostDetail() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const initialLang = (search.get("lang") as "ko" | "en") || "ko";
  const [lang, setLang] = useState<"ko" | "en">(initialLang);
  const post = posts.find(p => p.id === params.id);
  if (!post) return <div className="p-10 text-center">Not found - <Link href="/" className="underline">홈으로</Link></div>;

  const title = lang === "ko" ? post.title_ko : post.title_en;
  const desc = lang === "ko" ? post.desc_ko : post.desc_en;
  const steps = lang === "ko" ? post.steps_ko : post.steps_en;
  const dday = Math.ceil((new Date(post.deadline).getTime() - Date.now()) / (1000*60*60*24));

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="sticky top-0 border-b bg-white/80 backdrop-blur dark:bg-zinc-950/80 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href={`/?lang=${lang}`} className="text-sm font-medium">← {lang==="ko" ? "랭킹으로" : "Back to ranking"}</Link>
          <div className="flex gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
            <button onClick={()=>setLang("ko")} className={`rounded-full px-3 py-1 text-xs font-medium ${lang==="ko" ? "bg-white shadow dark:bg-zinc-800" : "text-zinc-500"}`}>한국어</button>
            <button onClick={()=>setLang("en")} className={`rounded-full px-3 py-1 text-xs font-medium ${lang==="en" ? "bg-white shadow dark:bg-zinc-800" : "text-zinc-500"}`}>English</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="rounded-3xl bg-white p-6 dark:bg-zinc-900 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold">{displayHourly(post, lang)}</span>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs dark:bg-zinc-800">{post.time_minutes}분</span>
            {post.verified ? <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">검증됨 ✓</span> : <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-600">미검증 - 주의</span>}
            {post.lang_original !== lang && <span className="rounded-full border px-2 py-1 text-xs">AI 번역</span>}
            <span className={`rounded-full px-2 py-1 text-xs ${dday<=3 ? "bg-red-500 text-white font-bold" : "bg-zinc-100 dark:bg-zinc-800"}`}>마감 {post.deadline} (D-{dday})</span>
          </div>
          <h1 className="mt-4 text-2xl font-black leading-tight">{title}</h1>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">{desc}</p>

          <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl bg-zinc-50 p-4 text-center dark:bg-zinc-800/50">
            <div><div className="text-xs text-zinc-500">{lang==="ko" ? "예상수익" : "Reward"}</div><div className="font-bold">{displayReward(post, lang)}</div></div>
            <div><div className="text-xs text-zinc-500">{lang==="ko" ? "소요시간" : "Time"}</div><div className="font-bold">{post.time_minutes}min</div></div>
            <div><div className="text-xs text-zinc-500">{lang==="ko" ? "시급환산" : "Hourly"}</div><div className="font-bold">{displayHourly(post, lang)}</div></div>
          </div>

          <h2 className="mt-8 font-bold">{lang==="ko" ? "하는 방법 3단계" : "How to in 3 steps"}</h2>
          <ol className="mt-3 space-y-2">
            {steps.map((s,i)=><li key={i} className="flex gap-3 rounded-xl border p-3 dark:border-zinc-800"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white dark:bg-white dark:text-black">{i+1}</span><span className="text-sm">{s}</span></li>)}
          </ol>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            {post.referral_url && (
              <a href={post.referral_url} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full bg-yellow-400 py-3 text-center font-bold text-black hover:bg-yellow-300">
                {lang==="ko" ? "참여하기 (레퍼럴 포함)" : "Join (referral included)"} →
              </a>
            )}
            <a href={post.source_url} target="_blank" rel="noopener noreferrer" className="flex-1 rounded-full border py-3 text-center font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800">
              {lang==="ko" ? "일반 링크로 가기" : "Go with normal link"}
            </a>
          </div>
          <p className="mt-2 text-center text-xs text-zinc-400">{lang==="ko" ? "레퍼럴 링크는 투명하게 공개됩니다. 수익은 사이트 운영에 사용됩니다." : "Referral disclosed transparently. Supports site operation."}</p>

          <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm dark:bg-amber-950/30">
            <span className="font-bold">⚠️ {lang==="ko" ? "주의" : "Caution"}:</span> {lang==="ko" ? "미검증 글은 직접 소액 테스트 후 진행하세요. 개인정보/선입금 요구 시 즉시 중단." : "For unverified posts, test with small amount first. Stop if asked for personal ID or upfront payment."}
          </div>

          <div className="mt-6 flex flex-wrap gap-2 text-xs">
            {post.tags.map(t=> <span key={t} className="rounded-full bg-zinc-100 px-2 py-1 dark:bg-zinc-800">#{t}</span>)}
          </div>
        </div>
      </main>
    </div>
  );
}
