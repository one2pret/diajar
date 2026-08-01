import type { Metadata } from "next";
import { dummyTeachers } from "@/lib/dummy-data";
import { TeachersManager } from "@/components/admin/teachers-manager";

export const metadata: Metadata = {
  title: "Teachers — Admin Diajar",
};

export default function AdminTeachersPage() {
  return <TeachersManager initialTeachers={dummyTeachers} />;
}
