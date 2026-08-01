import Anthropic from "@anthropic-ai/sdk";
import { embedQuery } from "./embed";
import { retrieveRelevantChunks, type RetrievedChunk } from "./retrieve";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

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

  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-6", // pakai model terbaru yang tersedia saat development
    max_tokens: 500,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Potongan transcript video:\n\n${context}\n\nPertanyaan peserta: ${question}`,
      },
    ],
  });

  const answer = message.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n");

  return { answer, retrievedChunks: chunks };
}

function formatTimestamp(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}
