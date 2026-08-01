import { db } from "@/lib/db";
import { transcriptChunks } from "@/lib/db/schema";
import { getVideoTranscript } from "@/lib/youtube";
import { chunkTranscript } from "./chunk";
import { embedDocuments } from "./embed";

export interface IngestResult {
  success: boolean;
  chunksStored: number;
  message: string;
}

/**
 * Dipanggil admin setelah menambahkan modul baru (lihat app/actions/modules.ts).
 * Ambil transcript → chunk → embed → simpan ke transcript_chunks.
 *
 * Kalau video tidak punya caption, return success: false — UI admin harus kasih
 * opsi paste transcript manual sebagai fallback (belum diimplementasi di skeleton ini).
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
      message:
        "Video ini tidak punya caption otomatis/manual. Gunakan opsi paste transcript manual di form admin.",
    };
  }

  const chunks = chunkTranscript(segments);
  const embeddings = await embedDocuments(chunks.map((c) => c.content));

  await db.insert(transcriptChunks).values(
    chunks.map((chunk, i) => ({
      moduleId,
      chunkIndex: chunk.chunkIndex,
      startSeconds: chunk.startSeconds,
      endSeconds: chunk.endSeconds,
      content: chunk.content,
      embedding: embeddings[i],
    }))
  );

  return {
    success: true,
    chunksStored: chunks.length,
    message: `Berhasil memproses ${chunks.length} chunk transcript.`,
  };
}
