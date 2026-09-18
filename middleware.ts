import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const ADMIN_PATHS = ["/admin"];
const TEACHER_PATHS = ["/teacher"];
const STUDENT_PATHS = ["/student"];

export default auth((req) => {
  const { nextUrl } = req;
  const session = req.auth;
  const isLoggedIn = !!session;
  const role = session?.user?.role;

  const isAdminPath = ADMIN_PATHS.some((p) => nextUrl.pathname.startsWith(p));
  const isTeacherPath = TEACHER_PATHS.some((p) =>
    nextUrl.pathname.startsWith(p)
  );
  const isStudentPath = STUDENT_PATHS.some((p) =>
    nextUrl.pathname.startsWith(p)
  );

  if (isAdminPath) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (role !== "ADMIN")
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isTeacherPath) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
    if (role !== "TEACHER" && role !== "ADMIN")
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
  }

  if (isStudentPath) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*", "/dashboard"],
};
