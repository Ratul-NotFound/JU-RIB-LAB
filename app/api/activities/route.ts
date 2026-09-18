import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
  try {
    const activities = await prisma.activity.findMany({
      orderBy: { eventDate: "desc" },
      include: { creator: { select: { name: true } } },
    });
    return NextResponse.json(activities);
  } catch {
    return NextResponse.json({ error: "Failed to fetch activities" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, content, thumbnailUrl, eventDate, endDate, location, type, isFeatured } = body;

  if (!title || !description || !eventDate) {
    return NextResponse.json({ error: "Title, description, and event date are required" }, { status: 400 });
  }

  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let i = 1;
  while (await prisma.activity.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  try {
    const activity = await prisma.activity.create({
      data: {
        title,
        slug,
        description,
        content,
        thumbnailUrl,
        eventDate: new Date(eventDate),
        endDate: endDate ? new Date(endDate) : null,
        location,
        type: type ?? "OTHER",
        isFeatured: isFeatured ?? false,
        createdBy: session.user.id,
      },
    });
    return NextResponse.json(activity, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create activity" }, { status: 500 });
  }
}
