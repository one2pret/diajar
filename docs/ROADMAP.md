# Diajar — Rencana Pengembangan

Platform kurasi course (agregator YouTube + AI Q&A) untuk niche
**Prompt Engineering + RAG untuk Developer Indonesia**.

- **Domain**: diajar.web.id (atau diajar.id)
- **Stack**: Next.js 16 + TypeScript + Tailwind 4 + Drizzle + PostgreSQL/pgvector + NextAuth v5 +
  gateway AI OpenAI-compatible (mis. Sumopod — lihat `lib/ai/client.ts`)
- **Alur kerja**: VS Code + Claude Code, ikuti aturan di `CLAUDE.md`
- **Strategi**: **Frontend dulu dengan data dummy**, baru backend — supaya bisa validasi
  tampilan & alur produk sebelum invest waktu ke database/auth/AI pipeline.

Dokumen ini adalah peta jalan bertahap. Tiap fase punya tujuan, checklist, dan
**prompt siap-pakai** untuk Claude Code. Kerjakan fase secara berurutan — jangan
lompat, karena tiap fase menumpuk di atas yang sebelumnya.

---

## Cara Pakai Dokumen Ini dengan Claude Code

1. Buka folder project di VS Code, jalankan Claude Code di terminal (`claude`).
2. Claude Code otomatis membaca `CLAUDE.md` — itu sumber aturan utama.
3. Untuk tiap fase di bawah, copy blok **Prompt** ke Claude Code.
4. Setelah Claude selesai satu fase, **review dulu** (jalankan, cek manual di browser),
   baru commit dengan Conventional Commit (`feat:`, `fix:`, dst.), lalu lanjut fase berikutnya.
5. Kalau Claude keluar jalur dari `CLAUDE.md`, ingatkan: "ikuti aturan di CLAUDE.md".

> Prinsip: satu fase = satu-dua sesi kerja = satu commit yang bisa direview.
> Jangan minta Claude bikin banyak fase sekaligus — hasilnya susah direview dan gampang error.

---

## Persiapan Awal (Fase 0)

Kerjakan **manual** sekali di awal, sebelum melibatkan Claude Code untuk coding.
Di fase frontend-only ini, kamu **belum perlu** setup PostgreSQL/API keys — cukup
dependency dasar dan design system.

### Checklist
- [ ] Install dependency: `pnpm install`
- [ ] Pastikan `pnpm dev` jalan tanpa error di http://localhost:3000
- [ ] Install skill design: `npm install -g ui-ux-pro-max-cli && uipro init --ai claude`
- [ ] Generate design system (lihat prompt di README.md), simpan ke `design-system/MASTER.md`
- [ ] Init git repo & commit awal (`chore: initial skeleton`)

---

## Fase 1 — Frontend Sisi Peserta (Dummy Data)

**Tujuan**: semua halaman yang dilihat peserta sudah jadi & terasa nyata, tapi datanya
dari `lib/dummy-data.ts` (bukan database). Ini fase paling penting untuk validasi rasa produk.

### Checklist
- [ ] Landing page (`app/page.tsx`): hero, course unggulan (dari dummy data), cara kerja, CTA
- [ ] Halaman list course (`app/(learn)/courses`): card course dari `dummyCourses`
- [ ] Halaman detail course + player (`app/(learn)/courses/[slug]`): embed YouTube,
      daftar module di sidebar dengan progress dummy (`isCompleted`), kredit channel asli
- [ ] Navbar & footer konsisten di semua halaman
- [ ] Komponen `AiChatPanel` — UI saja dulu, jawaban di-hardcode/simulasi (belum connect API asli)
- [ ] Mobile responsive — cek tampilan di lebar 375px

### Prompt untuk Claude Code
```
Baca CLAUDE.md dan docs/ROADMAP.md Fase 1. Baca juga design-system/MASTER.md dan ikuti
token warna/tipografinya. Bangun frontend sisi peserta PAKAI DATA DUMMY dari
lib/dummy-data.ts — JANGAN sentuh database, JANGAN import dari lib/db, JANGAN implementasi
auth asli dulu.

1. Landing page di app/page.tsx: hero yang jelaskan value (kurasi video + AI Q&A untuk
   belajar Prompt Engineering + RAG), section course unggulan (ambil dari dummyCourses),
   cara kerja, CTA daftar (tombol saja, belum perlu form fungsional).
2. Halaman list course di app/(learn)/courses: render dummyCourses jadi card (judul,
   deskripsi, jumlah module, level).
3. Halaman detail course di app/(learn)/courses/[slug]: pakai getDummyCourseBySlug().
   Embed video YouTube module pertama (iframe resmi), sidebar daftar semua module
   terurut dengan indikator selesai/belum dari isCompleted, tampilkan kredit channel
   (getDummyTeacherById) dengan link ke channel_url.
4. Komponen AiChatPanel (client component) di components/learn/: UI chat box lengkap
   (input, list pesan, loading state), tapi jawabannya untuk sekarang di-hardcode
   simulasi delay 1 detik lalu tampilkan jawaban dummy — belum panggil /api/ai-chat asli.
5. Navbar + footer, pastikan konsisten & responsive di semua halaman ini.

Ikuti CLAUDE.md untuk styling, atribusi channel (wajib tampil), dan bahasa Indonesia.
Jangan buat halaman admin atau auth di fase ini.
```

---

## Fase 2 — Frontend Sisi Admin (Dummy Data)

**Tujuan**: halaman admin untuk kelola teacher, course, dan module sudah jadi secara
visual & interaktif (state lokal React), tanpa tersambung ke database.

### Checklist
- [ ] Halaman admin: list + form tambah/edit teacher (`app/(admin)/teachers`)
- [ ] Halaman admin: list + form tambah/edit course (`app/(admin)/courses`)
- [ ] Form tambah module: input URL YouTube, preview, curator note (submit = update state lokal saja)
- [ ] Semua CRUD di halaman ini pakai `useState` lokal — reset kalau refresh (itu normal, wajar untuk fase ini)
- [ ] Sidebar/nav admin terpisah dari layout peserta

### Prompt untuk Claude Code
```
Baca CLAUDE.md dan docs/ROADMAP.md Fase 2. Baca design-system/MASTER.md. Bangun frontend
sisi admin PAKAI DATA DUMMY & REACT STATE LOKAL — JANGAN sentuh database atau Server Actions
yang menulis ke DB dulu.

1. Layout admin terpisah (app/(admin)/layout.tsx) dengan sidebar nav (Teachers, Courses).
2. Halaman app/(admin)/teachers: tabel list dummyTeachers + modal/form tambah-edit yang
   mengubah state lokal (useState array, seed awal dari dummyTeachers).
3. Halaman app/(admin)/courses: tabel list dummyCourses + form tambah-edit course, termasuk
   sub-form untuk tambah module (input URL YouTube, judul, curator note) ke state lokal.
4. Belum perlu validasi Zod atau Server Action nyata — cukup validasi form dasar di client.

Ikuti CLAUDE.md untuk styling & konvensi komponen. Tandai dengan komentar // TODO: connect
to database di titik-titik yang nanti perlu diganti Server Action asli.
```

---

## ⏸️ Checkpoint Evaluasi

Setelah Fase 1 & 2 selesai, **berhenti dulu**. Pakai project ini beberapa hari, tunjukkan
ke calon user, rasakan sendiri alurnya. Baru lanjut ke backend kalau kamu yakin arahnya
sudah pas — supaya waktu build backend tidak sia-sia untuk fitur yang mungkin masih berubah.

---

## Fase 3 — Setup Database & Auth Beneran

**Tujuan**: ganti fondasi dummy dengan koneksi database & auth asli. User bisa
register, login, logout dengan aman.

### Checklist
- [ ] Siapkan PostgreSQL, aktifkan extension: `CREATE EXTENSION IF NOT EXISTS vector;`
- [ ] Isi `.env` (DATABASE_URL, AUTH_SECRET, dst — lihat `.env.example`)
- [ ] `pnpm db:push` — push schema ke database
- [ ] Pasang bcrypt & ganti placeholder password di `lib/auth.ts`
- [ ] Server Action register (`app/actions/auth.ts`)
- [ ] `lib/db/seed.ts` — buat 1 admin + 1 user demo + seed course dummy yang sama ke DB asli
- [ ] Uji: register → login → route `/admin` ditolak untuk role user

### Prompt untuk Claude Code
```
Baca CLAUDE.md dan docs/ROADMAP.md Fase 3. Sekarang mulai integrasi database & auth asli:
1. Pasang bcryptjs, ganti placeholder verifikasi password di lib/auth.ts dengan bcrypt.compare.
2. Buat Server Action register di app/actions/auth.ts (validasi Zod, hash password).
3. Buat lib/db/seed.ts: 1 admin (admin@diajar.web.id), 1 user demo, dan seed course
   "Prompt Engineering + RAG" beserta module-nya — pakai data yang SAMA PERSIS dengan
   lib/dummy-data.ts supaya transisi frontend mulus.
4. Hubungkan halaman login/register (yang sudah ada dari Fase 1, kalau belum ada buat dulu)
   ke Server Action ini.
Ikuti CLAUDE.md.
```

---

## Fase 4 — Sambungkan Frontend Peserta ke Data Asli

**Tujuan**: ganti `dummyCourses`/`dummyTeachers` di halaman peserta dengan query database asli.

### Checklist
- [ ] Halaman list & detail course query dari Drizzle, bukan `lib/dummy-data.ts` lagi
- [ ] Progress module (`isCompleted`) dari tabel `progress` asli + Server Action tandai selesai
- [ ] Uji: data yang tampil = data dari `pnpm db:seed`, bukan dummy lagi

### Prompt untuk Claude Code
```
Baca CLAUDE.md dan docs/ROADMAP.md Fase 4. Ganti sumber data halaman peserta (yang dibuat
di Fase 1) dari lib/dummy-data.ts ke query Drizzle asli:
1. app/(learn)/courses dan app/(learn)/courses/[slug]: query courses+modules+teachers dari DB
   (gunakan db dari lib/db, hanya tampilkan is_published = true).
2. Buat Server Action markModuleComplete di app/actions/progress.ts, hubungkan ke tombol
   "tandai selesai" yang sudah ada di UI, simpan ke tabel progress.
3. Hapus import dummy-data dari halaman-halaman ini setelah dipastikan data asli tampil benar.
Ikuti CLAUDE.md. Jangan ubah tampilan UI yang sudah ada di Fase 1, cukup ganti sumber datanya.
```

---

## Fase 5 — Sambungkan Admin ke Server Actions Asli

**Tujuan**: form admin (dari Fase 2) benar-benar menyimpan ke database.

### Checklist
- [ ] Server Actions CRUD teachers & courses (`app/actions/teachers.ts`, `app/actions/courses.ts`)
- [ ] Ganti `useState` lokal di halaman admin dengan Server Actions + `revalidatePath()`
- [ ] Form tambah module memanggil `ingestModuleTranscript()` dari `lib/ai/ingest.ts`
- [ ] Fallback: textarea paste transcript manual kalau auto-fetch caption gagal
- [ ] Uji: tambah video → cek tabel `transcript_chunks` di Drizzle Studio (`pnpm db:studio`)

### Prompt untuk Claude Code
```
Baca CLAUDE.md dan docs/ROADMAP.md Fase 5. Sambungkan halaman admin (dari Fase 2) ke
Server Actions asli, ganti useState lokal:
1. Server Actions CRUD di app/actions/teachers.ts dan app/actions/courses.ts (validasi Zod,
   revalidatePath setelah mutasi).
2. Server Action app/actions/modules.ts: create module dari URL YouTube, pakai
   lib/youtube.ts (extractVideoId, getVideoMetadata) untuk isi metadata, lalu panggil
   ingestModuleTranscript() dari lib/ai/ingest.ts.
3. Update form yang sudah ada di Fase 2 supaya submit ke Server Action ini, bukan setState lokal.
   Tambahkan textarea fallback paste transcript manual untuk kasus caption tidak tersedia.
4. Tampilkan status hasil ingest (jumlah chunk atau pesan fallback) ke admin.
Ikuti CLAUDE.md, terutama AI Feature Rules.
```

---

## Fase 6 — Fitur AI Q&A Beneran

**Tujuan**: `AiChatPanel` (UI sudah ada dari Fase 1) tersambung ke API asli, jawaban
benar-benar dari transcript video via retrieval + Claude API.

### Checklist
- [ ] Hubungkan `AiChatPanel` ke `POST /api/ai-chat` yang sudah ada
- [ ] Timestamp di jawaban bisa diklik (lompat ke bagian video)
- [ ] Tambah rate limiting di route handler (TODO yang sudah dicatat di file-nya)
- [ ] Uji: tanya sesuatu yang ada di video (terjawab) & yang tidak ada (jujur "tidak dibahas")

### Prompt untuk Claude Code
```
Baca CLAUDE.md dan docs/ROADMAP.md Fase 6. Sambungkan AiChatPanel (sudah ada dari Fase 1,
masih simulasi) ke API asli:
1. Ganti simulasi jawaban dummy dengan fetch POST ke /api/ai-chat (moduleId + question).
2. Render jawaban asli; kalau ada timestamp, buat bisa diklik untuk seek video ke detik itu.
3. Tambahkan rate limiting sederhana per user di app/api/ai-chat/route.ts (lihat TODO di file).
Ikuti CLAUDE.md AI Feature Rules. Uji kedua kasus: pertanyaan terjawab & tidak terjawab.
```

---

## Fase 7 — Deploy ke VPS

**Tujuan**: aplikasi live di diajar.web.id dengan HTTPS.

### Checklist
- [ ] Adaptasi panduan deploy VPS (Node + PM2 + Nginx + Certbot) ke Postgres + pgvector
- [ ] Pointing domain diajar.web.id ke IP VPS (A record)
- [ ] Set env production di VPS (jangan commit `.env`)
- [ ] Build + jalankan via PM2 + reverse proxy Nginx + SSL Certbot
- [ ] Uji: akses https://diajar.web.id berfungsi penuh

### Catatan
Pastikan PostgreSQL + extension pgvector terpasang di VPS (bukan MySQL), dan
tambahkan `AI_API_KEY`/`AI_MODEL`, `EMBEDDING_API_KEY`/`EMBEDDING_MODEL`, `YOUTUBE_API_KEY`
ke env production — detail lengkap di `docs/DEPLOY-VPS-UBUNTU.md`.

---

## Setelah MVP (Backlog — Jangan Dikerjakan Dulu)

Ditunda sampai ada 10-15 user pertama & sinyal validasi bagus:
- Quiz otomatis per module (generate dari transcript)
- Sertifikat penyelesaian
- Payment gateway (Xendit/Midtrans) untuk premium tier
- Multiple course/niche selain Prompt Engineering + RAG
- Search semantik lintas semua video
- Progress analytics untuk admin

---

## Prinsip Menjaga Kualitas Sepanjang Development

- **Frontend dulu, backend kemudian** — jangan buru-buru ke Fase 3 sebelum benar-benar
  puas dengan alur & tampilan di Fase 1-2.
- **Review tiap fase sebelum lanjut** — jangan menumpuk kerjaan yang belum diuji.
- **Commit kecil & sering** dengan Conventional Commits.
- **Selalu rujuk `CLAUDE.md`** kalau Claude Code mulai improvisasi struktur.
- **Uji fitur AI dengan kasus negatif** (pertanyaan di luar video) — memastikan tidak mengarang.
- **Atribusi channel asli** di setiap tampilan video — ini bukan opsional, ini soal etika & legal.
- **Kontrol biaya API** sejak awal (rate limiting) — jangan tunggu tagihan membengkak.
