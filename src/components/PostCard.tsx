"use client";
import Link from "next/link";
import { Post, displayReward, displayHourly, hourlyWage } from "@/data/posts";

export default function PostCard({ post, lang, rank }: { post: Post; lang: "ko" | "en"; rank: number }) {
  const title = lang === "ko" ? post.title_ko : post.title_en;
  const desc = lang === "ko" ? post.desc_ko : post.desc_en;
  const category = lang === "ko" ? post.category : post.category_en;
  const dday = Math.ceil((new Date(post.deadline).getTime() - Date.now()) / (1000*60*60*24));
  const wage = hourlyWage(post, lang);

  return (
    <Link href={`/post/${post.id}?lang=${lang}`} className="group block">
      <div className="flex gap-4 rounded-2xl border border-zinc-200 bg-white p-4 transition hover:border-zinc-300 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-zinc-700 sm:p-5">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-lg font-bold text-white dark:bg-white dark:text-black">
          #{rank}
        </div>
        <div className="flex-1 min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-bold text-black">{displayHourly(post, lang)}</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium dark:bg-zinc-800">{category}</span>
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs dark:bg-zinc-800">{post.time_minutes}분</span>
            {post.verified ? <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">검증됨 ✓</span> : <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-600">미검증</span>}
            {dday <= 3 && dday >=0 && <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">D-{dday} 마감임박</span>}
            {post.lang_original !== lang && <span className="rounded-full border px-2 py-0.5 text-xs">AI번역</span>}
          </div>
          <h3 className="line-clamp-1 text-[15px] font-bold leading-tight group-hover:underline sm:text-base">{title}</h3>
          <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-400">{desc}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-base">{displayReward(post, lang)}</span>
            <span className="text-zinc-400">·</span>
            <span className="text-zinc-500">{post.tags.slice(0,3).map(t=>`#${t}`).join(" ")}</span>
          </div>
        </div>
        <div className="hidden sm:flex shrink-0 flex-col items-end justify-center">
          <span className="text-xs text-zinc-400">예상수익</span>
          <span className="font-bold">{displayReward(post, lang)}</span>
          <span className="mt-1 text-xs text-zinc-500">{post.time_minutes}분 투자</span>
        </div>
      </div>
    </Link>
  );
}
