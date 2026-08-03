import { db } from "@/lib/db";
import { transcriptChunks } from "@/lib/db/schema";
import { getVideoTranscript } from "@/lib/youtube";
import { chunkTranscript, chunkPlainText, type Chunk } from "./chunk";
import { embedDocuments } from "./embed";

export interface IngestResult {
  success: boolean;
  chunksStored: number;
  embedded: boolean;
  message: string;
}

async function storeChunks(moduleId: string, chunks: Chunk[]): Promise<IngestResult> {
  if (chunks.length === 0) {
    return {
      success: false,
      chunksStored: 0,
      embedded: false,
      message: "Transcript kosong setelah diproses — tidak ada yang disimpan.",
    };
  }

  let embeddings: number[][] | null = null;
  let embedError: string | null = null;

  const embeddingKey = process.env.EMBEDDING_API_KEY ?? process.env.AI_API_KEY;
  if (!embeddingKey) {
    embedError = "AI_API_KEY / EMBEDDING_API_KEY belum diset";
  } else {
    try {
      embeddings = await embedDocuments(chunks.map((c) => c.content));
    } catch (error) {
      embedError = error instanceof Error ? error.message : "gagal memanggil provider embedding";
    }
  }

  await db.insert(transcriptChunks).values(
    chunks.map((chunk, i) => ({
      moduleId,
      chunkIndex: chunk.chunkIndex,
      startSeconds: chunk.startSeconds,
      endSeconds: chunk.endSeconds,
      content: chunk.content,
      embedding: embeddings?.[i] ?? null,
    }))
  );

  if (embedError) {
    return {
      success: true,
      chunksStored: chunks.length,
      embedded: false,
      message: `${chunks.length} chunk transcript tersimpan, tapi belum di-embed (${embedError}). AI Q&A untuk module ini belum bisa jalan sampai di-embed ulang.`,
    };
  }

  return {
    success: true,
    chunksStored: chunks.length,
    embedded: true,
    message: `Berhasil memproses & embed ${chunks.length} chunk transcript.`,
  };
}

/**
 * Dipanggil admin setelah menambahkan modul baru (lihat app/actions/modules.ts).
 * Ambil transcript otomatis → chunk → embed → simpan ke transcript_chunks.
 *
 * Kalau video tidak punya caption, return success: false — form admin harus
 * tawarkan opsi paste transcript manual (lihat ingestManualTranscript di bawah).
 */
export async function ingestModuleTranscript(
  moduleId: string,
  youtubeVideoId: string
): Promise<IngestResult> {
  const segments = await getVideoTranscript(youtubeVideoId);

  if (!segments || segments.length === 0) {
    return {
      success: false,
      chunksStored: 0,
      embedded: false,
      message:
        "Video ini tidak punya caption otomatis/manual. Gunakan opsi paste transcript manual di form admin.",
    };
  }

  return storeChunks(moduleId, chunkTranscript(segments));
}

/** Fallback: admin paste transcript manual (video tidak punya caption). */
export async function ingestManualTranscript(
  moduleId: string,
  transcriptText: string
): Promise<IngestResult> {
  return storeChunks(moduleId, chunkPlainText(transcriptText));
}
