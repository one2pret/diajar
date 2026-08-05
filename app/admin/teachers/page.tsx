import type { Metadata } from "next";
import { db } from "@/lib/db";
import { teachers } from "@/lib/db/schema";
import { TeachersManager } from "@/components/admin/teachers-manager";

export const metadata: Metadata = {
  title: "Teachers — Admin Diajar",
};

// Query DB langsung, tanpa API dynamic lain (auth()/cookies) yang otomatis
// men-dynamic-kan halaman — tanpa ini Next bisa nge-prerender statis pakai
// data DB saat build time (butuh DB nyambung saat build, dan data admin jadi
// beku sampai revalidate). Data admin harus selalu live.
export const dynamic = "force-dynamic";

export default async function AdminTeachersPage() {
  const allTeachers = await db.select().from(teachers).orderBy(teachers.createdAt);

  return <TeachersManager teachers={allTeachers} />;
}
