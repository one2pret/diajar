import { VoyageAIClient } from "voyageai";

/**
 * Anthropic (Claude API) tidak menyediakan embedding model sendiri — resmi
 * merekomendasikan Voyage AI untuk kebutuhan ini. Claude tetap dipakai di
 * lib/ai/qa.ts untuk generate jawaban dari hasil retrieval.
 */
const client = new VoyageAIClient({ apiKey: process.env.VOYAGE_API_KEY });

/** Embed banyak teks sekaligus — dipakai saat admin menyimpan modul baru. */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  const result = await client.embed({
    input: texts,
    model: "voyage-4",
    inputType: "document",
  });
  return (result.data ?? []).map((d) => d.embedding ?? []);
}

/** Embed satu query pertanyaan user — dipakai saat AI Q&A. */
export async function embedQuery(text: string): Promise<number[]> {
  const result = await client.embed({
    input: [text],
    model: "voyage-4",
    inputType: "query",
  });
  return result.data?.[0]?.embedding ?? [];
}
