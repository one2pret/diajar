import { getAiClient, AI_MODEL } from "./client";
import { embedQuery } from "./embed";
import { retrieveRelevantChunks, type RetrievedChunk } from "./retrieve";

const SYSTEM_PROMPT = `Kamu adalah asisten belajar yang menjawab pertanyaan peserta HANYA
berdasarkan potongan transcript video yang diberikan di bawah ini. Aturan:
- Jawab dalam Bahasa Indonesia, jelas dan ringkas.
- Kalau jawabannya ADA di transcript, jawab berdasarkan itu, boleh sebutkan di menit
  berapa (pakai timestamp yang diberikan) kalau relevan.
- Kalau pertanyaan TIDAK bisa dijawab dari transcript yang diberikan, katakan dengan
  jujur bahwa itu tidak dibahas di video ini — JANGAN mengarang jawaban dari
  pengetahuan umum di luar transcript.
- Jangan awali jawaban dengan basa-basi seperti "Berdasarkan transcript...".`;

export interface QaResult {
  answer: string;
  retrievedChunks: RetrievedChunk[];
}

/**
 * Jawab pertanyaan user tentang isi video tertentu, grounded ke transcript
 * (retrieval-augmented generation).
 */
export async function answerQuestionAboutModule(
  moduleId: string,
  question: string
): Promise<QaResult> {
  const queryEmbedding = await embedQuery(question);
  const chunks = await retrieveRelevantChunks(moduleId, queryEmbedding, 4);

  if (chunks.length === 0) {
    return {
      answer:
        "Maaf, transcript untuk video ini belum tersedia, jadi saya belum bisa menjawab pertanyaan spesifik tentang isinya.",
      retrievedChunks: [],
    };
  }

  const context = chunks
    .map((c) => `[${formatTimestamp(c.startSeconds)}] ${c.content}`)
    .join("\n\n");

  // Chat completions OpenAI-compatible — model diambil dari env (AI_MODEL),
  // jadi provider/model (deepseek, gpt, dll) bisa diganti tanpa ubah kode.
  const completion = await getAiClient().chat.completions.create({
    model: AI_MODEL,
    max_tokens: 1024,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: `Potongan transcript video:\n\n${context}\n\nPertanyaan peserta: ${question}`,
      },
    ],
  });

  const answer = completion.choices[0]?.message?.content ?? "";

  return { answer, retrievedChunks: chunks };
}

function formatTimestamp(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
