import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  const role = (session.user as any).role;
  if (role !== "TEACHER" && role !== "ADMIN") redirect("/login");
  return <>{children}</>;
}
