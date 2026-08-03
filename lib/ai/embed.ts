import { getEmbeddingClient, EMBEDDING_MODEL, EMBEDDING_DIMENSIONS } from "./client";

/**
 * Embedding via provider OpenAI-compatible (mis. Sumopod → text-embedding-3-small).
 * Model & dimensi diambil dari env (lihat lib/ai/client.ts).
 */

/** Embed banyak teks sekaligus — dipakai saat admin menyimpan modul baru. */
export async function embedDocuments(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const result = await getEmbeddingClient().embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return result.data.map((d) => d.embedding);
}

/** Embed satu query pertanyaan user — dipakai saat AI Q&A. */
export async function embedQuery(text: string): Promise<number[]> {
  const result = await getEmbeddingClient().embeddings.create({
    model: EMBEDDING_MODEL,
    input: text,
    dimensions: EMBEDDING_DIMENSIONS,
  });
  return result.data[0]?.embedding ?? [];
}
