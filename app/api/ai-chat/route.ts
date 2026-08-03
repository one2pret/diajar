import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { aiChatMessages } from "@/lib/db/schema";
import { answerQuestionAboutModule } from "@/lib/ai/qa";

const bodySchema = z.object({
  moduleId: z.string().uuid(),
  question: z.string().min(1).max(1000),
});

// Rate limit sederhana in-memory: sliding window per user (biaya API harus
// terkontrol sejak awal — CLAUDE.md AI Feature Rules). Catatan: reset tiap
// server restart & tidak share antar instance — cukup untuk 1 VPS. Kalau nanti
// scale multi-instance, ganti ke Redis/Upstash.
const RATE_LIMIT_MAX = 10; // pertanyaan
const RATE_LIMIT_WINDOW_MS = 60_000; // per 1 menit
const requestLog = new Map<string, number[]>();

function isRateLimited(userId: string): boolean {
  const now = Date.now();
  const recent = (requestLog.get(userId) ?? []).filter(
    (ts) => now - ts < RATE_LIMIT_WINDOW_MS
  );
  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(userId, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(userId, recent);
  return false;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  if (isRateLimited(session.user.id)) {
    return NextResponse.json(
      { success: false, error: "Terlalu banyak pertanyaan, tunggu sebentar." },
      { status: 429 }
    );
  }

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Input tidak valid" },
      { status: 400 }
    );
  }

  const { moduleId, question } = parsed.data;
  const userId = session.user.id;

  try {
    const { answer, retrievedChunks } = await answerQuestionAboutModule(moduleId, question);

    // Simpan riwayat chat untuk audit (lihat CLAUDE.md — retrieved_chunk_ids wajib disimpan)
    await db.insert(aiChatMessages).values([
      { userId, moduleId, role: "user", content: question },
      {
        userId,
        moduleId,
        role: "assistant",
        content: answer,
        retrievedChunkIds: retrievedChunks.map((c) => c.id),
      },
    ]);

    return NextResponse.json({ success: true, data: { answer } });
  } catch (error) {
    console.error("AI chat error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal memproses pertanyaan, coba lagi" },
      { status: 500 }
    );
  }
}
