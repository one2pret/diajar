/**
 * Seed database dengan data yang SAMA PERSIS dengan lib/dummy-data.ts,
 * supaya transisi dari frontend dummy ke data asli (Fase 4) mulus.
 *
 * Jalankan: pnpm db:seed
 */
process.loadEnvFile(".env.local");

async function main() {
  // Import dinamis SETELAH loadEnvFile — lib/db/index.ts membaca process.env.DATABASE_URL
  // saat modul di-load, jadi import statis biasa akan jalan lebih dulu (hoisted) dan gagal.
  const { hash } = await import("bcryptjs");
  const { db } = await import("./index");
  const { users, teachers, courses, modules, progress } = await import("./schema");
  const { dummyCourses, dummyTeachers } = await import("../dummy-data");

  console.log("Seeding database...");

  const [admin] = await db
    .insert(users)
    .values({
      email: "admin@diajar.web.id",
      passwordHash: await hash("admin123", 10),
      displayName: "Admin Diajar",
      role: "admin",
    })
    .returning();

  const [demoUser] = await db
    .insert(users)
    .values({
      email: "demo@diajar.web.id",
      passwordHash: await hash("demo1234", 10),
      displayName: "User Demo",
      role: "user",
    })
    .returning();

  console.log(`  - user admin: ${admin.email}`);
  console.log(`  - user demo:  ${demoUser.email}`);

  const teacherIdByDummyId = new Map<string, string>();

  for (const t of dummyTeachers) {
    const handleMatch = t.channelUrl.match(/@([\w-]+)/);
    const [inserted] = await db
      .insert(teachers)
      .values({
        // Placeholder: ID channel YouTube asli belum diambil dari YouTube Data API
        // (itu kerjaan Fase 5). Sementara pakai handle dari URL sebagai penanda unik.
        channelId: handleMatch ? handleMatch[1] : t.id,
        channelName: t.channelName,
        channelUrl: t.channelUrl,
        avatarUrl: t.avatarUrl,
        bio: t.bio,
      })
      .returning();
    teacherIdByDummyId.set(t.id, inserted.id);
  }

  console.log(`  - ${dummyTeachers.length} teacher di-seed`);

  for (const c of dummyCourses) {
    const [insertedCourse] = await db
      .insert(courses)
      .values({
        slug: c.slug,
        title: c.title,
        description: c.description,
        level: c.level,
        isPublished: true,
        createdBy: admin.id,
      })
      .returning();

    for (const m of c.modules) {
      const teacherId = teacherIdByDummyId.get(m.teacherId);
      const [insertedModule] = await db
        .insert(modules)
        .values({
          courseId: insertedCourse.id,
          teacherId,
          youtubeVideoId: m.youtubeVideoId,
          title: m.title,
          curatorNote: m.curatorNote,
          durationSeconds: m.durationSeconds,
          orderIndex: m.orderIndex,
        })
        .returning();

      // Progress dummy (isCompleted) di-seed untuk user demo saja.
      await db.insert(progress).values({
        userId: demoUser.id,
        moduleId: insertedModule.id,
        isCompleted: m.isCompleted ?? false,
        completedAt: m.isCompleted ? new Date() : null,
      });
    }

    console.log(`  - course "${c.title}" (${c.modules.length} module)`);
  }

  console.log("Seed selesai.");
  process.exit(0);
}

main().catch((error) => {
  console.error("Seed gagal:", error);
  process.exit(1);
});
