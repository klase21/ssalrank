"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { posts } from "@/data/posts";

export default function AdminPage() {
  const [form, setForm] = useState({ title_ko:"", title_en:"", desc_ko:"", desc_en:"", reward_krw:"20000", reward_usd:"15", time:"5", source:"https://", referral:"", verified:true });
  const [translating, setTranslating] = useState<"ko->en" | "en->ko" | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [stats, setStats] = useState<any[]>([]);
  const hourly = Math.round((Number(form.reward_krw)||0) / (Number(form.time)||1) * 60);
  useEffect(()=>{ fetch("/api/click").then(r=>r.json()).then(d=>setStats(d.stats||[])).catch(()=>{}); },[saveMsg]);

  async function handleTranslate(dir: "ko->en" | "en->ko") {
    setTranslating(dir);
    try {
      const isKoToEn = dir === "ko->en";
      const text = isKoToEn ? `${form.title_ko}\n${form.desc_ko}` : `${form.title_en}\n${form.desc_en}`;
      if (!text.trim()) { alert("번역할 텍스트를 먼저 입력하세요"); return; }
      const target = isKoToEn ? "en" : "ko";
      const res = await fetch("/api/translate", { method: "POST", headers:{ "Content-Type":"application/json"}, body: JSON.stringify({ text, target })});
      const data = await res.json();
      if (data.translated) {
        const parts = data.translated.split("\n");
        if (isKoToEn) setForm(f=> ({...f, title_en: parts[0]||"", desc_en: parts.slice(1).join("\n")||""}));
        else setForm(f=> ({...f, title_ko: parts[0]||"", desc_ko: parts.slice(1).join("\n")||""}));
      } else alert("번역 실패");
    } catch(e){ alert("번역 실패: "+e)} finally { setTranslating(null)}
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      <header className="border-b bg-white dark:bg-zinc-950 dark:border-zinc-800">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-sm">← 홈</Link>
          <span className="font-bold">어드민 - 글쓰기</span>
          <span className="text-xs text-zinc-400">Supabase LIVE 연동됨 (ENV 없으면 Mock)</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="rounded-2xl bg-white p-6 dark:bg-zinc-900">
          <h1 className="text-lg font-bold">새 쌀먹 등록</h1>
          <p className="mt-1 text-sm text-zinc-500">지금은 Mock 데이터입니다. Supabase 연결하면 DB에 저장됩니다. 시급 자동계산 표시.</p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-xl bg-green-50 p-3 text-xs leading-relaxed dark:bg-green-950/30">✅ 무자본 구글번역 연동됨 (QuantTerminal 방식: <code>translate.googleapis.com/translate_a/single?client=gtx</code> 무료 엔드포인트, API키 불필요) · 서버 프록시 <code>/api/translate</code> 경유</div>
            <label className="grid gap-1"><span className="text-sm font-medium">제목 (KO)</span><input value={form.title_ko} onChange={e=>setForm({...form,title_ko:e.target.value})} placeholder="예: 토스뱅크 2만원 페이백" className="rounded-xl border px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700" /></label>
            <label className="grid gap-1"><span className="text-sm font-medium">설명 (KO)</span><textarea value={form.desc_ko} onChange={e=>setForm({...form,desc_ko:e.target.value})} placeholder="설명 입력" rows={2} className="rounded-xl border px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700" /></label>
            <button onClick={()=>handleTranslate("ko->en")} disabled={!!translating} className="rounded-full border bg-white py-2 text-sm font-bold hover:bg-zinc-50 disabled:opacity-50 dark:bg-zinc-800">{translating==="ko->en" ? "번역 중..." : "↓ 무료 구글번역으로 EN 자동 채우기"}</button>
            <label className="grid gap-1"><span className="text-sm font-medium">Title (EN)</span><input value={form.title_en} onChange={e=>setForm({...form,title_en:e.target.value})} placeholder="Toss Bank 20k cashback" className="rounded-xl border px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700" /></label>
            <label className="grid gap-1"><span className="text-sm font-medium">Description (EN)</span><textarea value={form.desc_en} onChange={e=>setForm({...form,desc_en:e.target.value})} placeholder="Description" rows={2} className="rounded-xl border px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700" /></label>
            <button onClick={()=>handleTranslate("en->ko")} disabled={!!translating} className="rounded-full border bg-white py-2 text-sm font-bold hover:bg-zinc-50 disabled:opacity-50 dark:bg-zinc-800">{translating==="en->ko" ? "번역 중..." : "↑ 무료 구글번역으로 KO 자동 채우기"}</button>
            <div className="grid grid-cols-3 gap-3">
              <label className="grid gap-1"><span className="text-sm">보상 KRW</span><input type="number" value={form.reward_krw} onChange={e=>setForm({...form,reward_krw:e.target.value})} className="rounded-xl border px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700" /></label>
              <label className="grid gap-1"><span className="text-sm">보상 USD</span><input type="number" value={form.reward_usd} onChange={e=>setForm({...form,reward_usd:e.target.value})} className="rounded-xl border px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700" /></label>
              <label className="grid gap-1"><span className="text-sm">소요(분)</span><input type="number" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} className="rounded-xl border px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700" /></label>
            </div>
            <div className="rounded-xl bg-yellow-100 p-3 text-center font-bold dark:bg-yellow-900/30">시급 환산: {hourly.toLocaleString()}원 / ${(hourly/1350).toFixed(1)}/h</div>
            <label className="grid gap-1"><span className="text-sm font-medium">원본 링크</span><input value={form.source} onChange={e=>setForm({...form,source:e.target.value})} className="rounded-xl border px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700" /></label>
            <label className="grid gap-1"><span className="text-sm font-medium">레퍼럴 링크 (선택)</span><input value={form.referral} onChange={e=>setForm({...form,referral:e.target.value})} placeholder="https://...?ref=YOUR_CODE" className="rounded-xl border px-3 py-2 dark:bg-zinc-800 dark:border-zinc-700" /></label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.verified} onChange={e=>setForm({...form,verified:e.target.checked})} /> <span className="text-sm">검증됨 (입금 확인 완료)</span></label>

            <button onClick={async()=>{
              setSaving(true); setSaveMsg(null);
              try{
                const res = await fetch("/api/posts",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
                  title_ko: form.title_ko, title_en: form.title_en, desc_ko: form.desc_ko || form.title_ko, desc_en: form.desc_en || form.title_en,
                  reward_krw: Number(form.reward_krw), reward_usd: Number(form.reward_usd), time_minutes: Number(form.time),
                  source_url: form.source, referral_url: form.referral, verified: form.verified
                })});
                const data = await res.json();
                if(!res.ok) setSaveMsg("실패: "+ (data.error||res.statusText) + (res.status===503 ? " → .env.local에 Supabase 키 넣고 재시작 필요 (지금은 Mock 모드)" : ""));
                else { setSaveMsg("저장 성공! ID: "+data.post.id+" → 메인에서 LIVE DB로 보임"); setForm({title_ko:"",title_en:"",desc_ko:"",desc_en:"",reward_krw:"20000",reward_usd:"15",time:"5",source:"https://",referral:"",verified:true}); }
              }catch(e:any){ setSaveMsg("에러: "+e.message)} finally{ setSaving(false)}
            }} disabled={saving} className="rounded-full bg-black py-3 font-bold text-white disabled:opacity-50 dark:bg-white dark:text-black">{saving ? "저장 중..." : "DB에 저장하기 (Supabase) → LIVE로 전환"}</button>
            {saveMsg && <div className="rounded-xl bg-zinc-100 p-3 text-xs leading-relaxed dark:bg-zinc-800">{saveMsg}</div>}
            <button onClick={()=>alert(JSON.stringify(form,null,2))} className="rounded-full border py-2 text-sm dark:border-zinc-700">JSON 미리보기 (로컬)</button>
            <p className="text-xs text-zinc-400">ENV 없으면 Mock 모드로 동작, ENV 넣으면 Supabase에 저장되어 메인에 즉시 반영됩니다.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 dark:bg-zinc-900">
          <h2 className="font-bold">📊 클릭 대시보드 (레퍼럴 우선순위)</h2>
          <p className="mt-1 text-xs text-zinc-500">레퍼럴 클릭이 많은 글이 돈 되는 글. 이걸 상위에 유지하고 비슷한 걸 더 찾아라.</p>
          {stats.length===0 ? <p className="mt-3 text-sm text-zinc-400">아직 클릭 없음 — Supabase에 <code>supabase_clicks.sql</code> 실행 후 클릭하면 집계됨</p> :
          <table className="mt-3 w-full text-xs">
            <thead><tr className="border-b text-left text-zinc-500"><th className="py-2">제목</th><th>레퍼럴</th><th>일반</th><th>합계</th></tr></thead>
            <tbody>{stats.map((s:any)=><tr key={s.id} className="border-b dark:border-zinc-800"><td className="py-2 pr-2">{s.title_ko?.slice(0,22)}</td><td className="font-bold text-yellow-600">{s.referral_clicks}</td><td>{s.source_clicks}</td><td>{s.total_clicks}</td></tr>)}</tbody>
          </table>}
          <button onClick={()=>fetch("/api/click").then(r=>r.json()).then(d=>setStats(d.stats||[]))} className="mt-3 rounded-full border px-3 py-1 text-xs">새로고침</button>
        </div>

        <div className="mt-6 rounded-2xl bg-white p-6 dark:bg-zinc-900">
          <h2 className="font-bold">현재 Mock 데이터 ({posts.length}개)</h2>
          <ul className="mt-2 list-disc pl-5 text-sm text-zinc-600 dark:text-zinc-400">
            {posts.map(p=> <li key={p.id}>{p.title_ko} - {p.reward_krw}원 / {p.time_minutes}분</li>)}
          </ul>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed p-5 text-sm">
          <h3 className="font-bold">Supabase 추가 설정 (클릭 추적)</h3>
          <p className="mt-1 text-xs text-zinc-500">SQL Editor에 <code>supabase_clicks.sql</code> 붙여넣기 → Run 하면 클릭 집계 시작. 안 해도 글쓰기는 되지만 통계가 안 뜬다.</p>
          <h3 className="mt-4 font-bold">Supabase 설정 (1분)</h3>
          <ol className="mt-2 list-decimal pl-5 text-xs leading-relaxed text-zinc-600 dark:text-zinc-400">
            <li>SQL Editor에 <code>supabase.sql</code> → Run (이미 했으면 스킵)</li>
            <li>SQL Editor에 <code>supabase_clicks.sql</code> → Run</li>
            <li>Vercel Settings → Environment Variables에 키 2개 넣고 Redeploy</li>
          </ol>
          <pre className="mt-2 overflow-auto rounded bg-zinc-900 p-3 text-xs text-green-400">{`-- supabase_clicks.sql
create table clicks (...)`}</pre>
        </div>
      </main>
    </div>
  );
}
