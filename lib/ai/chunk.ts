import type { TranscriptSegment } from "@/lib/youtube";

export interface Chunk {
  chunkIndex: number;
  content: string;
  startSeconds: number | null;
  endSeconds: number | null;
}

/**
 * Gabungkan segmen transcript (biasanya per beberapa detik) jadi chunk yang lebih
 * besar dan bermakna secara semantik, supaya hasil embedding & retrieval lebih akurat.
 *
 * Strategi: gabungkan segmen sampai mencapai targetChars, potong di akhir segmen
 * (bukan di tengah kalimat), simpan rentang waktu chunk untuk fitur "lompat ke bagian ini".
 */
export function chunkTranscript(
  segments: TranscriptSegment[],
  targetChars = 1000
): Chunk[] {
  const chunks: Chunk[] = [];
  let buffer: TranscriptSegment[] = [];
  let bufferLength = 0;
  let chunkIndex = 0;

  const flush = () => {
    if (buffer.length === 0) return;
    chunks.push({
      chunkIndex: chunkIndex++,
      content: buffer.map((s) => s.text).join(" ").trim(),
      startSeconds: buffer[0].startSeconds,
      endSeconds:
        buffer[buffer.length - 1].startSeconds + buffer[buffer.length - 1].durationSeconds,
    });
    buffer = [];
    bufferLength = 0;
  };

  for (const seg of segments) {
    buffer.push(seg);
    bufferLength += seg.text.length;
    if (bufferLength >= targetChars) flush();
  }
  flush(); // sisa terakhir

  return chunks;
}

/**
 * Chunk teks polos (hasil paste manual admin, tanpa timestamp per baris).
 * startSeconds/endSeconds selalu null — fitur "lompat ke bagian ini" di AI
 * chat tidak berlaku untuk chunk hasil paste manual.
 */
export function chunkPlainText(text: string, targetChars = 1000): Chunk[] {
  const paragraphs = text
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);

  const chunks: Chunk[] = [];
  let buffer = "";
  let chunkIndex = 0;

  const flush = () => {
    if (!buffer.trim()) return;
    chunks.push({
      chunkIndex: chunkIndex++,
      content: buffer.trim(),
      startSeconds: null,
      endSeconds: null,
    });
    buffer = "";
  };

  for (const paragraph of paragraphs) {
    if (buffer.length + paragraph.length >= targetChars) flush();
    buffer += (buffer ? "\n\n" : "") + paragraph;
  }
  flush();

  return chunks;
}
