import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

export interface RetrievedChunk {
  id: string;
  content: string;
  startSeconds: number;
  endSeconds: number;
  similarity: number;
}

/**
 * Cari chunk transcript paling relevan dengan query embedding, dibatasi ke satu modul
 * (jangan cari lintas video — jawaban harus grounded ke video yang sedang ditonton user).
 *
 * Query raw SQL dipakai di sini sesuai catatan di CLAUDE.md — Drizzle belum first-class
 * support operator jarak pgvector (`<=>`).
 */
export async function retrieveRelevantChunks(
  moduleId: string,
  queryEmbedding: number[],
  topK = 4
): Promise<RetrievedChunk[]> {
  const vectorLiteral = `[${queryEmbedding.join(",")}]`;

  const result = await db.execute(sql`
    SELECT
      id,
      content,
      start_seconds AS "startSeconds",
      end_seconds AS "endSeconds",
      1 - (embedding <=> ${vectorLiteral}::vector) AS similarity
    FROM transcript_chunks
    WHERE module_id = ${moduleId}
    ORDER BY embedding <=> ${vectorLiteral}::vector
    LIMIT ${topK}
  `);

  return result.rows as unknown as RetrievedChunk[];
}
