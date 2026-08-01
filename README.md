# Diajar — Skeleton Project

Skeleton awal untuk platform kurasi course (agregator YouTube + AI Q&A).
Struktur & aturan lengkap ada di `CLAUDE.md` — baca itu dulu sebelum development,
karena Claude Code akan otomatis membacanya tiap sesi.

## Yang Sudah Disiapkan

- Next.js 16 (App Router) + TypeScript + Tailwind CSS 4
- Struktur folder sesuai `CLAUDE.md`: `(learn)`, `(auth)`, `(admin)`, `api/`, `actions/`
- Drizzle ORM + schema PostgreSQL (`lib/db/schema.ts`, hasil konversi dari `schema.sql`)
- NextAuth v5 (Credentials provider) — skeleton di `lib/auth.ts` + `middleware.ts`
- Anthropic SDK sudah terpasang (`@anthropic-ai/sdk`) untuk fitur AI Q&A nanti

## Sudah Dibuat

- [x] `lib/youtube.ts` — ambil metadata (Data API v3) & transcript (endpoint timedtext publik,
      lihat catatan penting di dalam file soal keterbatasannya)
- [x] `lib/ai/chunk.ts` — chunking transcript jadi potongan siap embed
- [x] `lib/ai/embed.ts` — embedding via **Voyage AI** (Claude API tidak punya embedding sendiri)
- [x] `lib/ai/retrieve.ts` — cosine similarity search ke pgvector
- [x] `lib/ai/qa.ts` — retrieval-augmented Q&A pakai Claude API, grounded ke transcript
- [x] `lib/ai/ingest.ts` — orchestrator: transcript → chunk → embed → simpan ke DB
- [x] `app/api/ai-chat/route.ts` — endpoint chat, tersimpan riwayatnya untuk audit

## Belum Dibuat (Langkah Selanjutnya)

- [ ] UI pages (masih kosong, generate pakai skill `ui-ux-pro-max` — lihat di bawah)
- [ ] Server Actions (`app/actions/`) — termasuk action admin untuk trigger `ingestModuleTranscript()`
- [ ] Form admin dengan fallback paste transcript manual (untuk video tanpa caption)
- [ ] Rate limiting di `app/api/ai-chat/route.ts` (ada TODO di file-nya)
- [ ] bcrypt untuk hash password (belum dipasang, `lib/auth.ts` masih placeholder)
- [ ] `lib/db/seed.ts`

## Setup Lokal

```bash
pnpm install

# Copy & isi environment variables
cp .env.example .env

# Push schema ke database (pastikan Postgres + extension vector aktif dulu)
# CREATE EXTENSION IF NOT EXISTS vector;
pnpm db:push

pnpm dev
```

## Generate Design System (Skill `ui-ux-pro-max`)

Project ini dirancang untuk dipakai bareng skill [`ui-ux-pro-max`](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) —
skill Claude Code open-source untuk generate design system otomatis. Install di root project ini:

```bash
npm install -g ui-ux-pro-max-cli
uipro init --ai claude
```

Setelah terpasang, buka project ini di Claude Code lalu minta:

```
Generate design system untuk platform kurasi course online, niche AI/programming
untuk developer Indonesia. Style yang cocok: modern, fokus ke video/konten
(bukan flashy), trust-building karena kurasi dari sumber eksternal. Stack: Next.js
+ Tailwind + shadcn/ui. Persist ke design-system/MASTER.md dengan project name "Diajar".
```

Ini akan otomatis membuat `design-system/MASTER.md` — dipakai sebagai acuan warna,
tipografi, dan pola layout di semua halaman. Untuk halaman spesifik yang butuh
override (misal halaman player video beda dari landing page), generate lagi dengan
flag `--page`, hasilnya masuk ke `design-system/pages/`.

## Referensi Struktur Halaman (Inspirasi, Bukan Cetak Biru)

Landing page bisa terinspirasi dari pola umum platform course (hero → kategori/course
unggulan → kenapa pilih kami → teacher/kurator → testimoni → CTA), tapi sesuaikan copy
dan section ke konsep kurasi kamu — misal ganti "Instructor" jadi kredit channel YouTube
asli dengan link ke channel-nya (wajib untuk atribusi, lihat catatan di `CLAUDE.md`).

## Deploy

Ikuti pola VPS Ubuntu (Node + PM2 + Nginx + Certbot) — sama seperti project referensi
sebelumnya, tinggal sesuaikan ke PostgreSQL + extension pgvector.
