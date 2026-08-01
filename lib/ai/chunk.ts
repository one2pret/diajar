import type { TranscriptSegment } from "@/lib/youtube";

export interface Chunk {
  chunkIndex: number;
  content: string;
  startSeconds: number;
  endSeconds: number;
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
