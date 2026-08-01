/**
 * Client untuk YouTube Data API v3 (metadata) + pengambilan transcript.
 *
 * CATATAN PENTING soal transcript:
 * YouTube Data API resmi (captions.download) HANYA bisa dipakai untuk video yang
 * kamu miliki sendiri (butuh OAuth sebagai owner channel) — TIDAK bisa dipakai untuk
 * ambil transcript video orang lain, yang notabene jadi kebutuhan utama kita di sini
 * (kurasi video dari channel lain).
 *
 * Solusinya, project ini pakai endpoint publik `timedtext` yang dipakai YouTube untuk
 * menampilkan caption di web player. Ini endpoint tidak berdokumen resmi (unofficial),
 * jadi:
 *   1. Bisa berubah sewaktu-waktu tanpa pemberitahuan — jangan andalkan 100% otomatis.
 *   2. Kalau video tidak punya caption (manual atau auto-generated), fungsi ini akan
 *      return null — SELALU sediakan jalur admin untuk paste transcript manual sebagai
 *      fallback (lihat komponen admin module form).
 *   3. Ini murni fetch teks caption publik yang memang ditampilkan YouTube ke semua
 *      penonton, bukan bypass proteksi/DRM apa pun.
 */

const YOUTUBE_API_BASE = "https://www.googleapis.com/youtube/v3";

export interface VideoMetadata {
  videoId: string;
  title: string;
  channelId: string;
  channelTitle: string;
  durationSeconds: number;
  thumbnailUrl: string;
}

/**
 * Ambil metadata video (judul, channel, durasi) via YouTube Data API v3.
 * Butuh YOUTUBE_API_KEY di environment variables.
 */
export async function getVideoMetadata(videoId: string): Promise<VideoMetadata> {
  const apiKey = process.env.YOUTUBE_API_KEY;
  if (!apiKey) throw new Error("YOUTUBE_API_KEY belum diset di environment variables");

  const url = `${YOUTUBE_API_BASE}/videos?id=${videoId}&part=snippet,contentDetails&key=${apiKey}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`YouTube API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  const item = data.items?.[0];

  if (!item) {
    throw new Error(`Video ${videoId} tidak ditemukan atau bersifat private`);
  }

  return {
    videoId,
    title: item.snippet.title,
    channelId: item.snippet.channelId,
    channelTitle: item.snippet.channelTitle,
    durationSeconds: parseIsoDuration(item.contentDetails.duration),
    thumbnailUrl: item.snippet.thumbnails?.high?.url ?? item.snippet.thumbnails?.default?.url,
  };
}

export interface TranscriptSegment {
  text: string;
  startSeconds: number;
  durationSeconds: number;
}

/**
 * Ambil transcript video via endpoint publik timedtext.
 * Return null kalau video tidak punya caption sama sekali (bukan error — ini kondisi normal).
 */
export async function getVideoTranscript(
  videoId: string,
  lang = "en"
): Promise<TranscriptSegment[] | null> {
  const url = `https://www.youtube.com/api/timedtext?v=${videoId}&lang=${lang}&fmt=json3`;
  const res = await fetch(url);

  if (!res.ok) return null;

  const text = await res.text();
  if (!text.trim()) return null; // video tidak punya caption di bahasa ini

  const data = JSON.parse(text);
  const events = data.events as Array<{
    tStartMs?: number;
    dDurationMs?: number;
    segs?: Array<{ utf8?: string }>;
  }> | undefined;

  if (!events) return null;

  return events
    .filter((e) => e.segs && e.segs.length > 0)
    .map((e) => ({
      text: e.segs!.map((s) => s.utf8 ?? "").join(""),
      startSeconds: Math.floor((e.tStartMs ?? 0) / 1000),
      durationSeconds: Math.floor((e.dDurationMs ?? 0) / 1000),
    }))
    .filter((seg) => seg.text.trim().length > 0);
}

/** Parse durasi format ISO 8601 dari YouTube (contoh: "PT15M33S") jadi detik. */
function parseIsoDuration(iso: string): number {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const [, h, m, s] = match;
  return (Number(h) || 0) * 3600 + (Number(m) || 0) * 60 + (Number(s) || 0);
}

/** Ekstrak video ID dari berbagai format URL YouTube. */
export function extractVideoId(urlOrId: string): string | null {
  if (/^[a-zA-Z0-9_-]{11}$/.test(urlOrId)) return urlOrId; // sudah berupa ID

  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = urlOrId.match(pattern);
    if (match) return match[1];
  }
  return null;
}
