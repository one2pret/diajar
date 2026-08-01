import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  vector,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ============================================
// USERS
// ============================================
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  displayName: varchar("display_name", { length: 100 }),
  role: varchar("role", { length: 20 }).notNull().default("user").$type<"user" | "admin">(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================
// TEACHERS (sumber channel YouTube)
// ============================================
export const teachers = pgTable("teachers", {
  id: uuid("id").primaryKey().defaultRandom(),
  channelId: varchar("channel_id", { length: 100 }).notNull(),
  channelName: varchar("channel_name", { length: 150 }).notNull(),
  channelUrl: varchar("channel_url", { length: 300 }).notNull(),
  avatarUrl: varchar("avatar_url", { length: 300 }),
  bio: text("bio"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================
// COURSES
// ============================================
export const courses = pgTable("courses", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  level: varchar("level", { length: 20 }).default("beginner"),
  isPublished: boolean("is_published").notNull().default(false),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================
// MODULES (video individual dalam course, terurut)
// ============================================
export const modules = pgTable(
  "modules",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    courseId: uuid("course_id")
      .notNull()
      .references(() => courses.id, { onDelete: "cascade" }),
    teacherId: uuid("teacher_id").references(() => teachers.id),
    youtubeVideoId: varchar("youtube_video_id", { length: 20 }).notNull(),
    title: varchar("title", { length: 250 }).notNull(),
    curatorNote: text("curator_note"),
    durationSeconds: integer("duration_seconds"),
    orderIndex: integer("order_index").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("course_order_idx").on(table.courseId, table.orderIndex)]
);

// ============================================
// TRANSCRIPT CHUNKS (untuk RAG / AI Q&A)
// ============================================
export const transcriptChunks = pgTable("transcript_chunks", {
  id: uuid("id").primaryKey().defaultRandom(),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  chunkIndex: integer("chunk_index").notNull(),
  startSeconds: integer("start_seconds"),
  endSeconds: integer("end_seconds"),
  content: text("content").notNull(),
  embedding: vector("embedding", { dimensions: 1024 }), // Voyage AI voyage-4
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================
// PROGRESS
// ============================================
export const progress = pgTable(
  "progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    moduleId: uuid("module_id")
      .notNull()
      .references(() => modules.id, { onDelete: "cascade" }),
    isCompleted: boolean("is_completed").notNull().default(false),
    completedAt: timestamp("completed_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("user_module_idx").on(table.userId, table.moduleId)]
);

// ============================================
// AI CHAT MESSAGES (Q&A per modul)
// ============================================
export const aiChatMessages = pgTable("ai_chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  moduleId: uuid("module_id")
    .notNull()
    .references(() => modules.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 10 }).notNull(), // 'user' | 'assistant'
  content: text("content").notNull(),
  retrievedChunkIds: uuid("retrieved_chunk_ids").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ============================================
// RELATIONS
// ============================================
export const coursesRelations = relations(courses, ({ many }) => ({
  modules: many(modules),
}));

export const modulesRelations = relations(modules, ({ one, many }) => ({
  course: one(courses, { fields: [modules.courseId], references: [courses.id] }),
  teacher: one(teachers, { fields: [modules.teacherId], references: [teachers.id] }),
  transcriptChunks: many(transcriptChunks),
  progress: many(progress),
}));

export const transcriptChunksRelations = relations(transcriptChunks, ({ one }) => ({
  module: one(modules, { fields: [transcriptChunks.moduleId], references: [modules.id] }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  progress: many(progress),
  aiChatMessages: many(aiChatMessages),
}));
