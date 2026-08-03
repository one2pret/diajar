import type { Metadata } from "next";
import { db } from "@/lib/db";
import { teachers } from "@/lib/db/schema";
import { TeachersManager } from "@/components/admin/teachers-manager";

export const metadata: Metadata = {
  title: "Teachers — Admin Diajar",
};

export default async function AdminTeachersPage() {
  const allTeachers = await db.select().from(teachers).orderBy(teachers.createdAt);

  return <TeachersManager teachers={allTeachers} />;
}
