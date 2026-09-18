import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    const profiles = await prisma.profile.findMany({
      include: {
        user: { select: { email: true, role: true, isActive: true } },
        projectMembers: { include: { project: { select: { title: true, slug: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(profiles);
  } catch {
    return NextResponse.json({ error: "Failed to fetch members" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin only." }, { status: 401 });
  }

  const body = await req.json();
  const {
    email,
    password,
    role,
    fullName,
    designation,
    department,
    bio,
    avatarUrl,
    phone,
    linkedin,
    googleScholar,
    researchGate,
    orcid,
    website,
  } = body;

  if (!email || !fullName) {
    return NextResponse.json({ error: "Email and Full Name are required" }, { status: 400 });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
  }

  const baseSlug = slugify(fullName, { lower: true, strict: true });
  let slug = baseSlug;
  let i = 1;
  while (await prisma.profile.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  const hashedPassword = password ? await bcrypt.hash(password, 10) : await bcrypt.hash("BGE@2025!", 10);

  try {
    const user = await prisma.user.create({
      data: {
        email,
        name: fullName,
        password: hashedPassword,
        role: role ?? "STUDENT",
        profile: {
          create: {
            slug,
            fullName,
            designation,
            department: department ?? "Biotechnology & Genetic Engineering",
            bio,
            avatarUrl,
            phone,
            linkedin,
            googleScholar,
            researchGate,
            orcid,
            website,
          },
        },
      },
      include: { profile: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create member" }, { status: 500 });
  }
}
