# Diajar

Platform kurasi course (agregator video YouTube + AI Q&A berbasis transcript) untuk niche
Prompt Engineering + RAG bagi developer Indonesia. Struktur & aturan lengkap ada di
`CLAUDE.md` — baca itu dulu sebelum development. Peta jalan per fase ada di `docs/ROADMAP.md`.

## Status

Semua fase roadmap (Fase 1–7) sudah selesai: frontend peserta & admin, database + auth asli,
AI Q&A live, panduan deploy VPS. Lihat `docs/ROADMAP.md` untuk detail tiap fase.

## Stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- PostgreSQL + pgvector, Drizzle ORM (`lib/db/schema.ts`)
- NextAuth v5 (Credentials provider, JWT) — `lib/auth.ts` + `middleware.ts`
- AI Q&A: SDK `openai` diarahkan ke gateway OpenAI-compatible (mis. Sumopod) —
  `lib/ai/qa.ts` (generation) + `lib/ai/embed.ts` (embedding), model diatur lewat env
  (`AI_MODEL`/`EMBEDDING_MODEL`), bukan terkunci ke satu provider

## Pipeline AI Q&A (RAG)

- `lib/youtube.ts` — metadata (Data API v3) & transcript (endpoint `timedtext` publik,
  best-effort — lihat catatan keterbatasannya di dalam file)
- `lib/ai/chunk.ts` — chunking transcript siap embed (auto dari caption / manual paste)
- `lib/ai/embed.ts` — embedding via provider OpenAI-compatible
- `lib/ai/retrieve.ts` — cosine similarity search ke pgvector
- `lib/ai/qa.ts` — retrieval-augmented Q&A, grounded ke transcript, jujur kalau gak dibahas
- `lib/ai/ingest.ts` — orchestrator: transcript → chunk → embed → simpan ke DB
- `app/api/ai-chat/route.ts` — endpoint chat (rate limit per user, riwayat tersimpan untuk audit)

## Setup Lokal

```bash
pnpm install

# Copy & isi environment variables (.env.local, BUKAN .env — lihat .gitignore)
cp .env.example .env.local

# Jalankan PostgreSQL + pgvector via Docker
docker compose up -d
docker exec diajar_db psql -U diajar -d diajar_db -c "CREATE EXTENSION IF NOT EXISTS vector;"

# Push schema, lalu seed data contoh
# SEED_ADMIN_PASSWORD & SEED_DEMO_PASSWORD wajib diisi dulu di .env.local
pnpm db:push
pnpm db:seed

pnpm dev
```

## Atribusi Channel

Setiap video HARUS menampilkan nama channel asli & link ke video original — jangan pernah
terkesan konten ini milik platform sendiri (lihat `CLAUDE.md`).

## Deploy

Ikuti `docs/DEPLOY-VPS-UBUNTU.md`: Ubuntu + Node + PM2 + Nginx + Certbot, PostgreSQL +
pgvector via Docker Compose.
