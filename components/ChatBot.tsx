"use client";

import { useEffect, useRef, useState } from "react";
import { useLang } from "@/lib/i18n";

type Msg = { role: "user" | "model"; text: string };

// Questions addressed to the rover itself ("Talk to the rover" mode)
const SUGGESTIONS = {
  ar: ["كيف كانت لحظة هبوطك؟", "كيف تتواصل مع الأرض؟", "ما أصعب موقف مر عليك؟", "لماذا عندك هذا العدد من العجلات؟"],
  en: ["What was your landing like?", "How do you talk to Earth?", "What was your hardest moment?", "Why do you have so many wheels?"],
};

const ERRORS: Record<string, { ar: string; en: string }> = {
  NO_KEY: {
    ar: "المساعد غير مفعّل بعد: أضف GEMINI_API_KEY في ملف ‎.env.local ثم أعد تشغيل الخادم.",
    en: "Assistant not configured yet: add GEMINI_API_KEY to .env.local and restart the server.",
  },
  DEMO: {
    ar: "هذه نسخة عرض: المساعد يعمل في النسخة الكاملة بعد إضافة مفتاح Gemini.",
    en: "Demo version: the assistant works in the full version once a Gemini key is added.",
  },
  RATE_LIMIT: { ar: "أسئلة كثيرة بسرعة! انتظر دقيقة ثم حاول.", en: "Too many questions too fast! Wait a minute and try again." },
};

export default function ChatBot({ roverId, roverName }: { roverId?: string; roverName?: string }) {
  const { lang, t } = useLang();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // In "talk to the rover" mode the rover greets the student in first person.
  const title = roverName ? (lang === "ar" ? `تكلّم مع ${roverName}` : `Talk to ${roverName}`) : t("chatTitle");
  const welcome = roverName
    ? lang === "ar"
      ? `مرحبًا! أنا ${roverName} 👋 اسألني عن رحلتي، وأجزائي، والمغامرات اللي عشتها!`
      : `Hi! I'm ${roverName} 👋 Ask me about my journey, my parts, and the adventures I've had!`
    : t("chatWelcome");

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  async function send(text: string) {
    const q = text.trim().slice(0, 500);
    if (!q || loading) return;
    const next: Msg[] = [...messages, { role: "user", text: q }];
    setMessages(next);
    setInput("");
    setError(null);
    if (process.env.NEXT_PUBLIC_DEMO === "1") {
      setError(ERRORS.DEMO[lang]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang, roverId, messages: next.slice(-12) }),
      });
      const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
      if (!res.ok || !data.reply) {
        const known = data.error && ERRORS[data.error];
        setError(known ? known[lang] : t("chatError"));
        return;
      }
      setMessages((m) => [...m, { role: "model", text: data.reply! }]);
    } catch {
      setError(t("chatError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 end-5 z-[1100] flex items-center gap-2 rounded-full bg-gradient-to-r from-glow to-violet-400 px-5 py-3 font-bold text-space-950 shadow-[0_0_30px_rgba(94,231,255,.45)] transition hover:scale-105"
        aria-expanded={open}
        aria-controls="reliq-chat"
      >
        <span className="text-xl">{open ? "✕" : "🤖"}</span>
        <span className="hidden sm:inline">{roverName ? t("talkToRover") : t("chatOpen")}</span>
      </button>

      {open && (
        <div
          id="reliq-chat"
          role="dialog"
          aria-label={roverName ? title : t("chatTitle")}
          className="fade-up fixed inset-x-3 bottom-20 z-[1100] flex h-[70vh] max-h-[560px] flex-col overflow-hidden rounded-3xl border border-white/15 bg-space-900 shadow-2xl sm:inset-x-auto sm:end-5 sm:w-[380px]"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-glow/20 to-violet-500/20 px-4 py-3">
            <div>
              <div className="font-bold">{roverName ? `🛰️ ${title}` : `🤖 ${t("chatTitle")}`}</div>
              <div className="text-xs text-white/60">{t("chatRoleNote")}</div>
            </div>
            {messages.length > 0 && (
              <button
                onClick={() => {
                  setMessages([]);
                  setError(null);
                }}
                className="text-lg text-white/60 hover:text-white"
                aria-label="reset"
              >
                ↻
              </button>
            )}
          </div>

          <div ref={listRef} className="thin-scroll flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            <Bubble role="model" text={welcome} />
            {messages.length === 0 && (
              <div>
                <div className="mb-2 text-xs text-white/50">{t("chatSuggestions")}</div>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS[lang].map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-xl border border-white/15 px-3 py-2 text-start text-sm text-white/80 hover:border-glow/60 hover:bg-glow/10"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} text={m.text} />
            ))}
            {loading && (
              <div className="flex gap-1 px-2" aria-label="loading">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-glow" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            )}
            {error && <div className="rounded-xl bg-rose-500/15 p-3 text-sm text-rose-200">{error}</div>}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-white/10 p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder={t("chatPlaceholder")}
              className="min-w-0 flex-1 rounded-xl border border-white/15 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-white/40 focus:border-glow/60"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-glow px-4 py-2 text-sm font-bold text-space-950 disabled:opacity-40"
            >
              {t("send")}
            </button>
          </form>
        </div>
      )}
    </>
  );
}

function Bubble({ role, text }: Msg) {
  const user = role === "user";
  return (
    <div className={`flex ${user ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
          user ? "bg-glow text-space-950" : "bg-white/10 text-white/90"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
