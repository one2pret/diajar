import OpenAI from "openai";

/**
 * Client OpenAI-compatible untuk AI Q&A. Diarahkan ke gateway pilihan lewat env
 * (mis. Sumopod https://ai.sumopod.com/v1), jadi model bisa diganti-ganti
 * (deepseek, gpt, claude, dst.) tanpa ubah kode.
 *
 * Lazy-init: OpenAI SDK melempar error saat construct kalau apiKey kosong.
 * Kalau di-construct di level modul, build (page-data collection) ikut gagal
 * walau key memang belum diisi. Jadi client baru dibuat saat benar-benar dipakai.
 */
let _aiClient: OpenAI | null = null;
let _embeddingClient: OpenAI | null = null;

export function getAiClient(): OpenAI {
  if (!_aiClient) {
    _aiClient = new OpenAI({
      apiKey: process.env.AI_API_KEY,
      baseURL: process.env.AI_BASE_URL,
    });
  }
  return _aiClient;
}

/**
 * Client embedding dipisah dari generation: model embedding harus KONSISTEN
 * (query & document wajib model sama), sedangkan model generation boleh ganti.
 * Default-nya ikut env AI_* kalau EMBEDDING_* tidak diisi.
 */
export function getEmbeddingClient(): OpenAI {
  if (!_embeddingClient) {
    _embeddingClient = new OpenAI({
      apiKey: process.env.EMBEDDING_API_KEY ?? process.env.AI_API_KEY,
      baseURL: process.env.EMBEDDING_BASE_URL ?? process.env.AI_BASE_URL,
    });
  }
  return _embeddingClient;
}

export const AI_MODEL = process.env.AI_MODEL ?? "deepseek-chat";

export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL ?? "text-embedding-3-small";

/**
 * Dimensi vektor embedding — HARUS sama dengan kolom `vector(...)` di schema.ts.
 * text-embedding-3-small = 1536. Kalau ganti model, ubah ini + schema + re-embed.
 */
export const EMBEDDING_DIMENSIONS = Number(process.env.EMBEDDING_DIMENSIONS ?? 1536);
