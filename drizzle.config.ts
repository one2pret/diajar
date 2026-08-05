import { defineConfig } from "drizzle-kit";

// .env.local opsional — kalau DATABASE_URL sudah di-inject langsung ke env
// (mis. `docker run -e DATABASE_URL=...`), gak perlu file .env.local sama sekali.
try {
  process.loadEnvFile(".env.local");
} catch {
  // biarkan, DATABASE_URL diasumsikan sudah ada di process.env
}

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
