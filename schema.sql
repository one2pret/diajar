-- ============================================
-- SKEMA DATABASE: MVP Course Aggregator (YouTube)
-- Niche: Prompt Engineering + RAG untuk Developer
-- Target: PostgreSQL (pgvector untuk embedding)
-- ============================================

-- Ekstensi vector search (kalau pakai Postgres + pgvector)
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- 1. USERS
-- ============================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    role VARCHAR(20) NOT NULL DEFAULT 'user', -- 'user' | 'admin'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 2. TEACHERS (sumber channel YouTube)
-- ============================================
CREATE TABLE teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel_id VARCHAR(100) NOT NULL,       -- YouTube channel ID
    channel_name VARCHAR(150) NOT NULL,
    channel_url VARCHAR(300) NOT NULL,
    avatar_url VARCHAR(300),
    bio TEXT,                                -- deskripsi singkat, ditulis admin
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 3. COURSES (jalur belajar)
-- ============================================
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(150) UNIQUE NOT NULL,       -- 'prompt-engineering-rag'
    title VARCHAR(200) NOT NULL,
    description TEXT,
    level VARCHAR(20) DEFAULT 'beginner',    -- beginner | intermediate | advanced
    is_published BOOLEAN NOT NULL DEFAULT false,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================
-- 4. MODULES (video individual dalam course, terurut)
-- ============================================
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id UUID REFERENCES teachers(id),
    youtube_video_id VARCHAR(20) NOT NULL,   -- ID video YouTube (11 char)
    title VARCHAR(250) NOT NULL,
    curator_note TEXT,                        -- kenapa video ini dipilih (ditulis admin)
    duration_seconds INT,
    order_index INT NOT NULL,                -- urutan dalam course
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (course_id, order_index)
);

-- ============================================
-- 5. TRANSCRIPT CHUNKS (untuk RAG / AI Q&A)
-- ============================================
CREATE TABLE transcript_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,                -- urutan potongan dalam 1 video
    start_seconds INT,                        -- timestamp mulai (buat "lompat ke bagian ini")
    end_seconds INT,
    content TEXT NOT NULL,                    -- teks transcript potongan ini
    embedding VECTOR(1024),                    -- Voyage AI voyage-4 (Claude API tidak punya embedding sendiri)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_transcript_chunks_embedding
    ON transcript_chunks USING ivfflat (embedding vector_cosine_ops);

-- ============================================
-- 6. PROGRESS (tracking user per modul)
-- ============================================
CREATE TABLE progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    UNIQUE (user_id, module_id)
);

-- ============================================
-- 7. AI CHAT HISTORY (Q&A per modul)
-- ============================================
CREATE TABLE ai_chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    role VARCHAR(10) NOT NULL,               -- 'user' | 'assistant'
    content TEXT NOT NULL,
    retrieved_chunk_ids UUID[],              -- jejak chunk mana yg dipakai buat jawab (audit/debug)
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_chat_user_module ON ai_chat_messages(user_id, module_id);

-- ============================================
-- CATATAN
-- ============================================
-- - Dimensi VECTOR(1024) untuk model Voyage AI voyage-4. Anthropic tidak punya
--   embedding model sendiri, jadi RAG di project ini pakai Voyage AI (direkomendasikan
--   resmi oleh Anthropic) untuk embedding, sementara Claude API tetap dipakai untuk
--   generate jawaban Q&A dari hasil retrieval.
-- - Untuk skala 10-15 video di MVP, ivfflat index sebenarnya belum wajib,
--   tapi disiapkan dari awal supaya tidak perlu migrasi besar nanti.
-- - order_index di modules dibuat UNIQUE per course supaya urutan course tidak bentrok.
