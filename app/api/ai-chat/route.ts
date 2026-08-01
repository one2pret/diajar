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

// TODO: tambahkan rate limiting per user di sini sebelum production
// (biaya Claude API + Voyage API harus terkontrol — lihat catatan di CLAUDE.md).
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
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
  const userId = session.user.id as string;

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
