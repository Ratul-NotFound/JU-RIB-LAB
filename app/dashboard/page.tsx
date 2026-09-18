import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardRedirectPage() {
  const session = await auth();

  if (!session) redirect("/login");

  const role = (session.user as any).role;

  if (role === "ADMIN") redirect("/admin");
  if (role === "TEACHER") redirect("/teacher/dashboard");
  redirect("/student/dashboard");
}
