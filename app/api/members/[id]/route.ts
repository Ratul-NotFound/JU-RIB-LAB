import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const profile = await prisma.profile.findFirst({
      where: { OR: [{ id }, { userId: id }, { slug: id }] },
      include: {
        user: { select: { email: true, role: true, isActive: true } },
        projectMembers: { include: { project: true } },
      },
    });
    if (!profile) return NextResponse.json({ error: "Member not found" }, { status: 404 });
    return NextResponse.json(profile);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch member" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
    // Find profile
    const profile = await prisma.profile.findFirst({
      where: { OR: [{ id }, { userId: id }] },
      include: { user: true },
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    // Permissions check: User can update their own profile, or Admin can update anyone
    const isOwner = session.user.id === profile.userId;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Update user record if password or role changed
    if (password || (role && isAdmin) || (typeof isActive === "boolean" && isAdmin)) {
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
  } catch (e) {
    return NextResponse.json({ error: "Failed to update member" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
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
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete member" }, { status: 500 });
  }
}
