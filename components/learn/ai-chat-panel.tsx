"use client";

import { FormEvent, Fragment, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { seekVideoTo } from "@/components/learn/video-player";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/** Cocokkan timestamp mm:ss atau h:mm:ss dalam teks jawaban. */
const TIMESTAMP_REGEX = /\b(?:(\d{1,2}):)?([0-5]?\d):([0-5]\d)\b/g;

function timestampToSeconds(h: string | undefined, m: string, s: string): number {
  return (Number(h) || 0) * 3600 + Number(m) * 60 + Number(s);
}

/** Render teks jawaban dengan timestamp jadi tombol yang seek video. */
function renderWithTimestamps(text: string) {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  TIMESTAMP_REGEX.lastIndex = 0;

  while ((match = TIMESTAMP_REGEX.exec(text)) !== null) {
    const [full, hh, mm, ss] = match;
    if (match.index > lastIndex) {
      parts.push(<Fragment key={`t-${lastIndex}`}>{text.slice(lastIndex, match.index)}</Fragment>);
    }
    const seconds = timestampToSeconds(hh, mm, ss);
    parts.push(
      <button
        key={`ts-${match.index}`}
        type="button"
        onClick={() => seekVideoTo(seconds)}
        className="mx-0.5 inline-flex items-center rounded border border-primary/40 bg-primary-subtle px-1 font-mono text-xs text-primary hover:bg-primary hover:text-primary-foreground"
      >
        {full}
      </button>
    );
    lastIndex = match.index + full.length;
  }

  if (lastIndex < text.length) {
    parts.push(<Fragment key={`t-end`}>{text.slice(lastIndex)}</Fragment>);
  }
  return parts;
}

export function AiChatPanel({
  moduleId,
  moduleTitle,
}: {
  moduleId: string;
  moduleTitle: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const question = input.trim();
    if (!question || isLoading) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: question,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, question }),
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        if (res.status === 401) {
          setError("Masuk dulu untuk memakai AI Q&A.");
        } else if (res.status === 429) {
          setError("Terlalu banyak pertanyaan. Tunggu sebentar lalu coba lagi.");
        } else {
          setError(json.error ?? "Gagal memproses pertanyaan, coba lagi.");
        }
        return;
      }

      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: json.data.answer },
      ]);
    } catch {
      setError("Gagal terhubung ke server. Coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex h-full flex-col rounded-lg border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Sparkles size={16} strokeWidth={1.75} className="text-primary" />
        <div className="min-w-0">
          <h2 className="text-sm font-semibold text-foreground">Tanya AI</h2>
          <p className="truncate text-xs text-muted-foreground">Seputar &quot;{moduleTitle}&quot;</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="text-sm leading-normal text-muted-foreground">
            Bingung sama bagian tertentu di video? Tanya di sini — jawabannya digali dari
            transcript video ini, bukan dari pengetahuan umum. Timestamp di jawaban bisa diklik
            untuk lompat ke bagian itu.
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm leading-normal",
                message.role === "user"
                  ? "bg-primary-subtle text-foreground"
                  : "border border-border bg-background text-foreground"
              )}
            >
              {message.role === "assistant"
                ? renderWithTimestamps(message.content)
                : message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm text-muted-foreground">
              <Loader2 size={14} strokeWidth={1.75} className="animate-spin" />
              Mencari jawaban di transcript...
            </div>
          </div>
        )}

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Tulis pertanyaan kamu..."
          className="h-10 flex-1 rounded-md border border-border-strong bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          aria-label="Kirim pertanyaan"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          <Send size={16} strokeWidth={1.75} />
        </button>
      </form>
    </div>
  );
}
