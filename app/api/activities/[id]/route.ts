import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const activity = await prisma.activity.findUnique({
      where: { id },
      include: { creator: { select: { name: true } } },
    });
    if (!activity) return NextResponse.json({ error: "Activity not found" }, { status: 404 });
    return NextResponse.json(activity);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { title, description, content, thumbnailUrl, eventDate, endDate, location, type, isFeatured } = body;

  try {
    const updated = await prisma.activity.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        content,
        thumbnailUrl,
        ...(eventDate && { eventDate: new Date(eventDate) }),
        endDate: endDate ? new Date(endDate) : null,
        location,
        type,
        isFeatured: typeof isFeatured === "boolean" ? isFeatured : undefined,
      },
    });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update activity" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.activity.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete activity" }, { status: 500 });
  }
}
