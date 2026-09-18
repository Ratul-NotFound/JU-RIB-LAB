import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import slugify from "slugify";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    let targetId = id;
    if (id === "me") {
      const session = await auth();
      if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      targetId = session.user.id;
    }

    let profile = await prisma.profile.findFirst({
      where: { OR: [{ id: targetId }, { userId: targetId }, { slug: targetId }] },
      include: {
        user: { select: { email: true, role: true, isActive: true } },
        projectMembers: { include: { project: true } },
      },
    });

    if (!profile && id === "me") {
      const session = await auth();
      if (session?.user?.id) {
        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (user) {
          const baseSlug = slugify(user.name || "user", { lower: true, strict: true }) || "user";
          let slug = baseSlug;
          let i = 1;
          while (await prisma.profile.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${i++}`;
          }
          profile = await prisma.profile.create({
            data: {
              userId: user.id,
              slug,
              fullName: user.name || "Lab Researcher",
              designation: user.role === "TEACHER" ? "Faculty / Researcher" : "Student Researcher",
              department: "Biotechnology & Genetic Engineering",
            },
            include: {
              user: { select: { email: true, role: true, isActive: true } },
              projectMembers: { include: { project: true } },
            },
          });
        }
      }
    }

    if (!profile) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    return NextResponse.json(profile);
  } catch {
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const {
    role,
    password,
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
    isActive,
  } = body;

  try {
    const targetId = id === "me" ? session.user.id : id;

    // Find profile
    let profile = await prisma.profile.findFirst({
      where: { OR: [{ id: targetId }, { userId: targetId }, { slug: targetId }] },
      include: { user: true },
    });

    if (!profile && id === "me") {
      const baseSlug = slugify(fullName || session.user.name || "user", { lower: true, strict: true }) || "user";
      let slug = baseSlug;
      let i = 1;
      while (await prisma.profile.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${i++}`;
      }
      profile = await prisma.profile.create({
        data: {
          userId: session.user.id,
          slug,
          fullName: fullName || session.user.name || "Lab Researcher",
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
        },
        include: { user: true },
      });
    }

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Permissions check: User can update their own profile, or Admin can update anyone
    const isOwner = session.user.id === profile.userId;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update user record if password or role changed
    if (password || (role && isAdmin) || (typeof isActive === "boolean" && isAdmin) || fullName) {
      const userData: Record<string, unknown> = {};
      if (password) userData.password = await bcrypt.hash(password, 10);
      if (role && isAdmin) userData.role = role;
      if (typeof isActive === "boolean" && isAdmin) userData.isActive = isActive;
      if (fullName) userData.name = fullName;

      await prisma.user.update({
        where: { id: profile.userId },
        data: userData,
      });
    }

    const updatedProfile = await prisma.profile.update({
      where: { id: profile.id },
      data: {
        ...(fullName && { fullName }),
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
        ...(typeof isActive === "boolean" && { isActive }),
      },
      include: { user: { select: { email: true, role: true, isActive: true } } },
    });

    return NextResponse.json(updatedProfile);
  } catch {
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.role || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized. Admin only." }, { status: 401 });
  }

  const { id } = await params;
  try {
    const profile = await prisma.profile.findFirst({
      where: { OR: [{ id }, { userId: id }] },
    });

    if (!profile) return NextResponse.json({ error: "Member not found" }, { status: 404 });

    await prisma.user.delete({ where: { id: profile.userId } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
