"use client";
export default function LangToggle({ lang, setLang }: { lang: "ko" | "en"; setLang: (l: "ko" | "en") => void }) {
  return (
    <div className="flex items-center gap-1 rounded-full bg-zinc-100 p-1 dark:bg-zinc-900">
      <button
        onClick={() => setLang("ko")}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${lang === "ko" ? "bg-white shadow text-black dark:bg-zinc-800 dark:text-white" : "text-zinc-500"}`}
      >
        한국어
      </button>
      <button
        onClick={() => setLang("en")}
        className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${lang === "en" ? "bg-white shadow text-black dark:bg-zinc-800 dark:text-white" : "text-zinc-500"}`}
      >
        English
      </button>
    </div>
  );
}
