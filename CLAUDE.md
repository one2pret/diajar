# Diajar — Project Rules

## Development Strategy (PENTING)

Project ini dibangun **frontend dulu dengan data dummy** (`lib/dummy-data.ts`), baru
backend menyusul. Peta jalan lengkap per fase ada di `docs/ROADMAP.md` — baca itu untuk
tahu fase mana yang sedang dikerjakan sebelum mulai coding apa pun.

Selama masih di fase frontend-only: JANGAN import dari `lib/db`, jangan buat Server
Action yang menulis ke database, dan jangan implementasi auth asli — semua data ambil
dari `lib/dummy-data.ts`.

## Project Overview

Platform "course" yang merupakan agregator & kurasi video YouTube gratis, disusun jadi
jalur belajar terstruktur. Peserta bisa daftar, ikuti course, dan pakai AI Q&A berbasis
transcript video untuk mempercepat belajar. Bukan platform upload video sendiri — semua
video di-embed resmi dari YouTube.

Niche awal: **Prompt Engineering + RAG untuk Developer**.

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Components, Server Actions, Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 (utility-first, responsive-first)
- **Database**: PostgreSQL (bukan MySQL — butuh pgvector untuk fitur AI Q&A/RAG)
- **ORM**: Drizzle ORM (`drizzle-kit` untuk migrations)
- **Auth**: NextAuth v5 (beta) — Credentials provider, JWT strategy
- **Validation**: Zod
- **AI**: SDK `openai` diarahkan ke gateway OpenAI-compatible (mis. Sumopod, `AI_BASE_URL`/`AI_MODEL` di env) untuk Q&A + embedding pipeline — model generation & embedding bebas diganti tanpa ubah kode
- **Icons**: Lucide React
- **Utils**: clsx + tailwind-merge (`cn()` helper di `lib/utils.ts`)

## Project Structure

```
app/
  (learn)/          → Halaman peserta (course list, detail course, player + AI chat)
  (auth)/           → Login & Register
  (admin)/          → Admin: kelola course, module, teacher (curator)
  api/               → REST API routes (kalau nanti butuh konsumsi eksternal/mobile)
  actions/           → Server Actions (courses, modules, progress, ai-chat)
components/
  learn/             → Komponen sisi peserta (VideoPlayer, ProgressBar, AiChatPanel)
  admin/             → Komponen admin (ModuleForm, TeacherForm, CourseTable)
  ui/                → shadcn/ui components
lib/
  db/                → Koneksi database, schema (schema.sql sebagai referensi), seed
  ai/                → Pipeline transcript → chunk → embedding → retrieval
  auth.ts            → NextAuth config
  auth.config.ts     → Edge-compatible auth config
  youtube.ts         → Client untuk YouTube Data API (metadata + transcript)
  utils.ts           → Utility functions
types/                → TypeScript type definitions
```

## Naming Conventions

- **Files**: kebab-case untuk routes, PascalCase untuk components
- **Database tables**: snake_case (`courses`, `modules`, `transcript_chunks`)
- **Variables/functions**: camelCase
- **Types/Interfaces**: PascalCase
- **Server Actions**: camelCase verb prefix (`createCourse`, `markModuleComplete`)
- **API routes**: RESTful — `/api/courses`, `/api/courses/[id]`

## Coding Rules

### Next.js Patterns
- Gunakan **Server Components** by default, `'use client'` hanya untuk interactivity
  (video player controls, AI chat panel, progress checklist).
- Gunakan **Server Actions** untuk semua mutasi data (bukan API routes), kecuali endpoint
  yang butuh streaming response (AI chat) — itu pakai Route Handler dengan streaming.
- Gunakan `revalidatePath()` setelah mutasi untuk cache busting.
- Loading states via `loading.tsx`, error handling via `error.tsx`.

### Database & ORM
- Schema definition di `lib/db/schema.ts` — struktur mengikuti `schema.sql` (users,
  teachers, courses, modules, transcript_chunks, progress, ai_chat_messages).
- Gunakan Drizzle `relations()` untuk relasi antar tabel.
- Semua query pakai Drizzle query builder, JANGAN raw SQL — **kecuali** query vector
  similarity search (`transcript_chunks.embedding`), yang boleh raw SQL karena Drizzle
  belum first-class support pgvector operator.
- Timestamps: `createdAt` dan `updatedAt` dengan default `now()`.

### AI Feature Rules (khusus project ini)
- Transcript diambil sekali saat modul dibuat admin, disimpan di `transcript_chunks`
  (bukan fetch live tiap kali user tanya).
- AI Q&A HARUS retrieval-grounded — jangan biarkan model jawab dari pengetahuan umum
  kalau pertanyaan spesifik ke isi video; kalau retrieval tidak menemukan chunk relevan,
  jawab jujur "tidak ditemukan di video ini".
- Simpan `retrieved_chunk_ids` di `ai_chat_messages` untuk audit — supaya bisa dicek
  kenapa AI menjawab begitu.
- Rate-limit AI Q&A per user (biaya API harus terkontrol sejak awal, bukan nanti).

### Styling (Tailwind CSS 4)
- Mobile-first responsive design: `sm:`, `md:`, `lg:`, `xl:`.
- Gunakan `cn()` helper untuk conditional classes.
- Design modern, clean, minimalist — video jadi fokus utama, UI di sekitarnya minim distraksi.
- Spacing konsisten: 4px grid system.

### Authentication & Authorization
- Middleware di `middleware.ts` untuk route protection.
- Admin routes: `/admin/*` — require role `admin`.
- Peserta protected routes: `/learn/*`, progress tracking — require authenticated.
- Session check via `auth()` di Server Components.

### Form & Validation
- Validasi dengan Zod schema sebelum database operation.
- Server-side validation WAJIB.
- Error messages dalam Bahasa Indonesia untuk user-facing.

### API Response Format
```
// Success
{ success: true, data: T }
// Error
{ success: false, error: string }
// List with pagination
{ success: true, data: T[], meta: { page, limit, total } }
```

## Database Schema Overview

| Table               | Purpose                                    |
| -------------------- | ------------------------------------------- |
| users                | Admin & peserta                             |
| teachers             | Channel YouTube sumber (ditampilkan sbg "teacher") |
| courses              | Jalur belajar                               |
| modules              | Video individual dalam course, terurut      |
| transcript_chunks    | Potongan transcript + embedding untuk RAG   |
| progress             | Tracking penyelesaian modul per user        |
| ai_chat_messages     | Riwayat Q&A AI per modul                    |

Detail lengkap ada di `schema.sql`.

## Key Commands

```
pnpm dev              # Dev server (Turbopack)
pnpm build            # Production build
pnpm db:push          # Push schema ke Postgres
pnpm db:studio        # Open Drizzle Studio
pnpm db:seed          # Seed sample data
```

## Design Principles

- **Responsive**: harus bagus di mobile, tablet, desktop (banyak peserta belajar dari HP).
- **Fast**: leverage Server Components, minimal client JS.
- **Accessible**: semantic HTML, proper labels, keyboard navigation.
- **Indonesian Context**: bahasa antarmuka Indonesia, tapi konten video boleh berbahasa Inggris.
- **Atribusi jelas**: setiap video HARUS menampilkan nama channel asli & link ke video original —
  jangan pernah terkesan konten ini milik platform sendiri.

## Deploy

Ikuti `docs/DEPLOY-VPS-UBUNTU.md`: Ubuntu + Node + PM2 + Nginx + Certbot, PostgreSQL +
ekstensi pgvector via Docker Compose, dan environment variable `AI_*`/`EMBEDDING_*` untuk
gateway AI (lihat `.env.example`).
