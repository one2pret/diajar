# Diajar — Design System MASTER

Platform kurasi course YouTube untuk niche AI/Programming, target developer Indonesia.
Stack: Next.js 16 + Tailwind CSS 4 + shadcn/ui.

## 1. Design Principles

1. **Video adalah bintang utama** — chrome UI di sekitar player harus minim, netral, tidak
   berebut perhatian dengan konten.
2. **Trust over flash** — ini platform kurasi, bukan pembuat konten. Desain harus terasa
   "editorial curator" (seperti dokumentasi teknis / product hunt), bukan "marketing hype".
   Atribusi channel asli selalu terlihat jelas, tidak disembunyikan.
3. **Developer-native, bukan generic e-learning** — visual bahasa dekat ke tooling developer
   (mono font untuk kode/meta, dark mode setara warga kelas satu, bukan tempelan), bukan
   platform kursus umum yang penuh gradient & ilustrasi kartun.
4. **Tenang, bukan flashy** — minim gradient besar, minim shadow berlebih, minim animasi
   dekoratif. Warna aksen dipakai hemat: hanya untuk actionable/status, bukan dekorasi.
5. **Mobile-first** — banyak peserta belajar dari HP. Kepadatan informasi diprioritaskan
   turun di breakpoint kecil, bukan di-squeeze.

## 2. Primitive Tokens

### 2.1 Color Primitives

Base: neutral slate (netral, sedikit dingin — cocok tema dev tool) + accent indigo (trust,
teknikal, umum dipakai brand developer tools) + supporting teal (progress/success, terasa
"tervalidasi" bukan norak seperti hijau default) + amber (warning/perhatian) + red (error).

```css
/* Neutral (slate) — UI chrome, teks, border */
--gray-50:  #f8fafc;
--gray-100: #f1f5f9;
--gray-200: #e2e8f0;
--gray-300: #cbd5e1;
--gray-400: #94a3b8;
--gray-500: #64748b;
--gray-600: #475569;
--gray-700: #334155;
--gray-800: #1e293b;
--gray-900: #0f172a;
--gray-950: #020617;

/* Accent — Indigo (primary brand, CTA, link, active state) */
--indigo-50:  #eef2ff;
--indigo-100: #e0e7ff;
--indigo-200: #c7d2fe;
--indigo-300: #a5b4fc;
--indigo-400: #818cf8;
--indigo-500: #6366f1;
--indigo-600: #4f46e5;  /* base brand */
--indigo-700: #4338ca;
--indigo-800: #3730a3;
--indigo-900: #312e81;

/* Supporting — Teal (progress, completion, "verified/curated") */
--teal-50:  #f0fdfa;
--teal-100: #ccfbf1;
--teal-300: #5eead4;
--teal-500: #14b8a6;
--teal-600: #0d9488;
--teal-700: #0f766e;

/* Warning — Amber */
--amber-50:  #fffbeb;
--amber-300: #fcd34d;
--amber-500: #f59e0b;
--amber-600: #d97706;

/* Error — Red */
--red-50:  #fef2f2;
--red-300: #fca5a5;
--red-500: #ef4444;
--red-600: #dc2626;

/* True black/white (video letterbox, overlay) */
--black: #000000;
--white: #ffffff;
```

### 2.2 Typography Primitives

- **Sans (UI & baca panjang)**: `Inter` — netral, sangat legible di Bahasa Indonesia,
  default shadcn-friendly.
- **Mono (kode, meta info: durasi, channel handle, badge teknis)**: `JetBrains Mono` —
  identitas developer-tool yang kuat, dipakai sengaja sebagai signature Diajar (bukan cuma
  untuk code block).

```css
--font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
--font-mono: "JetBrains Mono", ui-monospace, "SFMono-Regular", monospace;

--text-xs:   0.75rem;   /* 12px — meta, badge, timestamp */
--text-sm:   0.875rem;  /* 14px — body kecil, label */
--text-base: 1rem;      /* 16px — body default */
--text-lg:   1.125rem;  /* 18px — lead paragraph */
--text-xl:   1.25rem;   /* 20px — card title */
--text-2xl:  1.5rem;    /* 24px — section title */
--text-3xl:  1.875rem;  /* 30px — page title */
--text-4xl:  2.25rem;   /* 36px — hero (mobile cap) */
--text-5xl:  3rem;      /* 48px — hero (desktop) */

--leading-tight:  1.2;
--leading-snug:   1.375;
--leading-normal: 1.6;   /* body Bahasa Indonesia butuh leading agak lega */

--font-normal:   400;
--font-medium:   500;
--font-semibold: 600;
--font-bold:     700;
```

### 2.3 Spacing Primitives (4px grid, sesuai CLAUDE.md)

```css
--space-0: 0px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
```

### 2.4 Radius & Shadow Primitives

Radius sedang (bukan pill-happy, bukan tajam siku) — netral, cocok konten teknis.

```css
--radius-sm: 6px;    /* badge, chip kecil */
--radius-md: 10px;   /* button, input */
--radius-lg: 14px;   /* card */
--radius-xl: 20px;   /* modal, panel besar */
--radius-full: 9999px;

/* Shadow tipis — hindari drop shadow berat/gelap, gunakan sebagai depth halus saja */
--shadow-xs: 0 1px 2px 0 rgb(15 23 42 / 0.04);
--shadow-sm: 0 1px 3px 0 rgb(15 23 42 / 0.06), 0 1px 2px -1px rgb(15 23 42 / 0.06);
--shadow-md: 0 4px 8px -2px rgb(15 23 42 / 0.08), 0 2px 4px -2px rgb(15 23 42 / 0.06);
--shadow-lg: 0 12px 24px -6px rgb(15 23 42 / 0.10), 0 4px 8px -4px rgb(15 23 42 / 0.06);
--shadow-focus: 0 0 0 3px rgb(79 70 229 / 0.35); /* indigo ring, a11y focus */
```

## 3. Semantic Tokens

Mapping primitive → tujuan pemakaian. Dukung light & dark (dark = warga kelas satu, bukan
tempelan — banyak dev nonton video malam hari).

```css
/* === LIGHT (default) === */
:root {
  --color-bg:            var(--white);
  --color-bg-subtle:     var(--gray-50);
  --color-bg-muted:      var(--gray-100);
  --color-surface:       var(--white);          /* card, panel */
  --color-surface-raised: var(--white);          /* dropdown, modal */

  --color-border:        var(--gray-200);
  --color-border-strong: var(--gray-300);

  --color-text:           var(--gray-900);
  --color-text-secondary: var(--gray-600);
  --color-text-muted:     var(--gray-400);
  --color-text-inverse:   var(--white);

  --color-primary:        var(--indigo-600);
  --color-primary-hover:  var(--indigo-700);
  --color-primary-active: var(--indigo-800);
  --color-primary-subtle: var(--indigo-50);
  --color-on-primary:     var(--white);

  --color-success:        var(--teal-600);
  --color-success-subtle: var(--teal-50);
  --color-warning:        var(--amber-600);
  --color-warning-subtle: var(--amber-50);
  --color-danger:         var(--red-600);
  --color-danger-subtle:  var(--red-50);

  --color-link:           var(--indigo-600);
  --color-focus-ring:     var(--indigo-500);

  --color-video-frame:    var(--black); /* letterbox player selalu hitam, light/dark sama */
}

/* === DARK === */
:root[data-theme="dark"] {
  --color-bg:            var(--gray-950);
  --color-bg-subtle:     var(--gray-900);
  --color-bg-muted:      var(--gray-800);
  --color-surface:       var(--gray-900);
  --color-surface-raised: var(--gray-800);

  --color-border:        var(--gray-800);
  --color-border-strong: var(--gray-700);

  --color-text:           var(--gray-50);
  --color-text-secondary: var(--gray-300);
  --color-text-muted:     var(--gray-500);
  --color-text-inverse:   var(--gray-900);

  --color-primary:        var(--indigo-500);
  --color-primary-hover:  var(--indigo-400);
  --color-primary-active: var(--indigo-300);
  --color-primary-subtle: var(--indigo-900);
  --color-on-primary:     var(--white);

  --color-success:        var(--teal-500);
  --color-success-subtle: rgb(13 148 136 / 0.15);
  --color-warning:        var(--amber-500);
  --color-warning-subtle: rgb(217 119 6 / 0.15);
  --color-danger:         var(--red-500);
  --color-danger-subtle:  rgb(220 38 38 / 0.15);

  --color-link:           var(--indigo-400);
  --color-focus-ring:     var(--indigo-400);
}
```

Respect `prefers-color-scheme` sebagai default, `data-theme` attribute override untuk toggle
manual (pola sama seperti Artifact viewer).

## 4. Component Tokens

### 4.1 Button

| Property | Primary | Secondary | Ghost | Destructive |
|---|---|---|---|---|
| Background default | `--color-primary` | `--color-surface` | transparent | `--color-danger` |
| Border default | none | `--color-border-strong` | none | none |
| Text default | `--color-on-primary` | `--color-text` | `--color-text-secondary` | white |
| Background hover | `--color-primary-hover` | `--color-bg-muted` | `--color-bg-muted` | `--red-500` |
| Background active | `--color-primary-active` | `--color-bg-muted` | `--color-bg-muted` | `--red-600` |
| Disabled | `--gray-300` bg, `--gray-400` text | opacity 0.5 | opacity 0.5 | opacity 0.5 |
| Radius | `--radius-md` | `--radius-md` | `--radius-md` | `--radius-md` |
| Height (sm/md/lg) | 32px / 40px / 48px | sama | sama | sama |
| Focus | `--shadow-focus` ring | sama | sama | sama |

### 4.2 Card (course card, module card)

```css
--card-bg:            var(--color-surface);
--card-border:        var(--color-border);
--card-radius:        var(--radius-lg);
--card-padding:       var(--space-4);
--card-shadow:        var(--shadow-xs);
--card-shadow-hover:  var(--shadow-md);
--card-thumb-radius:  var(--radius-md); /* thumbnail YouTube di dalam card */
```

State: hover → `border-color: var(--color-border-strong)` + `shadow: card-shadow-hover` +
translateY(-2px) transisi 150ms ease-out (subtle, bukan bounce).

### 4.3 Video Player Wrapper

```css
--player-frame-bg:      var(--color-video-frame);  /* selalu hitam, light/dark sama */
--player-radius:        var(--radius-lg);
--player-attribution-bg: var(--color-bg-subtle);
--player-attribution-border-top: var(--color-border);
```

Aturan wajib (dari CLAUDE.md): setiap player embed WAJIB menampilkan strip atribusi di bawah
(nama channel + logo kecil + link "Tonton di YouTube ↗") — non-negotiable, bagian dari trust
principle.

### 4.4 Badge / Chip (level, durasi, status progress)

```css
--badge-radius:      var(--radius-full);
--badge-padding-x:    var(--space-3);
--badge-padding-y:    var(--space-1);
--badge-font:         var(--font-mono);   /* signature: meta info pakai mono */
--badge-font-size:    var(--text-xs);
```

Varian warna: `neutral` (gray-100/gray-700), `primary` (indigo-50/indigo-700), `success`
(teal-50/teal-700 — dipakai utk "Selesai"), `warning` (amber-50/amber-700).

### 4.5 Progress Bar

```css
--progress-track-bg:  var(--color-bg-muted);
--progress-fill-bg:   var(--color-success);   /* teal, bukan primary indigo — hindari bentrok CTA */
--progress-radius:    var(--radius-full);
--progress-height:    6px;
```

### 4.6 Input / Form

```css
--input-bg:            var(--color-surface);
--input-border:        var(--color-border-strong);
--input-border-focus:  var(--color-primary);
--input-radius:        var(--radius-md);
--input-height:        40px;
--input-placeholder:   var(--color-text-muted);
--input-error-border:  var(--color-danger);
```

### 4.7 AI Chat Panel (Q&A retrieval)

```css
--chat-bg:                 var(--color-bg-subtle);
--chat-bubble-user-bg:     var(--color-primary-subtle);
--chat-bubble-user-text:   var(--color-text);
--chat-bubble-ai-bg:       var(--color-surface);
--chat-bubble-ai-border:   var(--color-border);
--chat-citation-bg:        var(--color-bg-muted);   /* chip timestamp rujukan transcript */
--chat-citation-font:      var(--font-mono);
--chat-radius:              var(--radius-lg);
```

Citation chip (mis. `12:34`) WAJIB clickable → seek video ke timestamp itu. Ini elemen trust
kunci: jawaban AI selalu bisa ditelusuri balik ke video asli.

## 5. Typography Scale (semantic usage)

| Token | Size | Weight | Font | Pemakaian |
|---|---|---|---|---|
| `display` | text-5xl / text-4xl (mobile) | bold | sans | Hero landing |
| `h1` | text-3xl | bold | sans | Judul halaman |
| `h2` | text-2xl | semibold | sans | Judul section |
| `h3` | text-xl | semibold | sans | Judul card/module |
| `body-lg` | text-lg | normal | sans | Lead/deskripsi course |
| `body` | text-base | normal | sans | Body default |
| `body-sm` | text-sm | normal | sans | Caption, helper text |
| `meta` | text-xs | medium | **mono** | Durasi, nama channel, timestamp, badge |
| `code` | text-sm | normal | mono | Snippet kode dalam transcript/chat |

## 6. Iconography

- **Library**: Lucide React (sesuai CLAUDE.md).
- **Stroke width**: 1.75 (default 2 terlalu tebal untuk skala kecil, 1.5 terlalu tipis di mobile).
- **Size scale**: 16px (inline teks), 20px (button/nav default), 24px (section header).
- **Warna**: ikuti `currentColor`, jangan hardcode — supaya otomatis ikut dark mode.

## 7. Motion

Minim & fungsional, bukan dekoratif (selaras prinsip #4).

```css
--ease-out:      cubic-bezier(0.16, 1, 0.3, 1);
--duration-fast:   120ms;   /* hover state */
--duration-base:   200ms;   /* card lift, dropdown */
--duration-slow:   320ms;   /* modal, panel slide */
```

Larangan: tidak ada animasi loop/parallax/scroll-jacking di halaman course/player — video butuh
fokus tanpa distraksi.

## 8. Layout & Breakpoints

Ikuti Tailwind default (mobile-first, sesuai CLAUDE.md):

| Breakpoint | Min-width | Pemakaian utama |
|---|---|---|
| (default) | 0 | Single column, player full-width, nav bottom/hamburger |
| `sm` | 640px | Card grid 1→2 kolom |
| `md` | 768px | Sidebar module list muncul di samping player |
| `lg` | 1024px | Card grid 3 kolom, AI chat panel jadi sidebar tetap |
| `xl` | 1280px | Max container width, whitespace tambahan di tepi |

```css
--container-max: 1280px;
--container-padding-mobile: var(--space-4);
--container-padding-desktop: var(--space-8);
```

## 9. Tailwind CSS 4 Integration (`app/globals.css`)

Pola `@theme inline` (Tailwind 4, tanpa `tailwind.config.js` terpisah untuk tokens):

```css
@import "tailwindcss";

:root {
  --gray-50:#f8fafc; --gray-100:#f1f5f9; --gray-200:#e2e8f0; --gray-300:#cbd5e1;
  --gray-400:#94a3b8; --gray-500:#64748b; --gray-600:#475569; --gray-700:#334155;
  --gray-800:#1e293b; --gray-900:#0f172a; --gray-950:#020617;

  --indigo-50:#eef2ff; --indigo-500:#6366f1; --indigo-600:#4f46e5; --indigo-700:#4338ca;
  --indigo-900:#312e81;

  --teal-50:#f0fdfa; --teal-500:#14b8a6; --teal-600:#0d9488;
  --amber-50:#fffbeb; --amber-500:#f59e0b; --amber-600:#d97706;
  --red-50:#fef2f2; --red-500:#ef4444; --red-600:#dc2626;

  --color-bg: #ffffff;
  --color-surface: #ffffff;
  --color-border: var(--gray-200);
  --color-text: var(--gray-900);
  --color-text-secondary: var(--gray-600);
  --color-primary: var(--indigo-600);
  --color-primary-hover: var(--indigo-700);
  --color-on-primary: #ffffff;
  --color-success: var(--teal-600);
  --color-danger: var(--red-600);
}

:root[data-theme="dark"] {
  --color-bg: var(--gray-950);
  --color-surface: var(--gray-900);
  --color-border: var(--gray-800);
  --color-text: var(--gray-50);
  --color-text-secondary: var(--gray-300);
  --color-primary: var(--indigo-500);
  --color-primary-hover: var(--indigo-400);
  --color-success: var(--teal-500);
  --color-danger: var(--red-500);
}

@theme inline {
  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --color-background: var(--color-bg);
  --color-foreground: var(--color-text);
  --color-primary: var(--color-primary);
  --color-primary-foreground: var(--color-on-primary);
  --color-muted: var(--gray-100);
  --color-muted-foreground: var(--color-text-secondary);
  --color-border: var(--color-border);
  --color-success: var(--color-success);
  --color-destructive: var(--color-danger);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 20px;
}

body {
  background: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
}
```

shadcn/ui `components.json` pakai `cssVariables: true`, base color `slate` — biar mapping ke
token di atas lurus tanpa konflik nama variabel.

## 10. Accessibility Baseline

- Kontras teks-bg minimal AA (4.5:1 body, 3:1 heading besar) — sudah divalidasi untuk pasangan
  `--color-text` / `--color-bg` di light & dark.
- Semua interactive element (button, link, chip citation) punya `focus-visible` ring pakai
  `--shadow-focus` / `--color-focus-ring`, jangan hilangkan outline tanpa pengganti.
- Video player wajib punya caption/transcript toggle (bukan cuma AI chat) untuk aksesibilitas,
  bukan cuma fitur RAG.
- Warna tidak jadi satu-satunya penanda status (progress "selesai" pakai icon check + warna,
  bukan warna saja).

## 11. Do / Don't

**Do**
- Pakai mono font untuk semua meta info teknis (durasi, channel, timestamp) — jadi signature visual.
- Biarkan whitespace besar di sekitar player, kurangi elemen kompetitif untuk perhatian mata.
- Tampilkan atribusi channel sejelas judul course sendiri.

**Don't**
- Jangan pakai gradient besar di background hero/card — cukup solid + border tipis.
- Jangan pakai emoji sebagai icon di UI produksi — pakai Lucide.
- Jangan bikin badge/label warna-warni berlebihan per course — 1 warna aksen dominan cukup (indigo),
  warna lain hanya untuk status fungsional (progress/warning/error).
