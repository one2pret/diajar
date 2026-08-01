"use client";

import { FormEvent, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const DUMMY_ANSWER =
  "Berdasarkan transcript video ini, konsep tersebut dijelaskan sekitar menit 04:12 — " +
  "singkatnya, teknik ini bekerja dengan memecah instruksi jadi langkah kecil supaya model " +
  "lebih konsisten menjawab. (Ini masih jawaban simulasi — belum tersambung ke AI asli.)";

export function AiChatPanel({ moduleTitle }: { moduleTitle: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleSubmit(event: FormEvent) {
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

    // TODO: ganti simulasi ini dengan fetch POST ke /api/ai-chat (Fase 6)
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: DUMMY_ANSWER,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
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
            transcript video ini, bukan dari pengetahuan umum.
          </p>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-normal",
                message.role === "user"
                  ? "bg-primary-subtle text-foreground"
                  : "border border-border bg-background text-foreground"
              )}
            >
              {message.content}
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
