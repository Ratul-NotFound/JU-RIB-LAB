import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      include: { members: { include: { profile: { select: { fullName: true } } } } },
    });
    return NextResponse.json(projects);
  } catch {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, description, content, status, category, tags, isFeatured, startDate, endDate, fundingSource } = body;

  if (!title || !description) {
    return NextResponse.json({ error: "Title and description required" }, { status: 400 });
  }

  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let i = 1;
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${i++}`;
  }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        content,
        status: status ?? "ONGOING",
        category,
        tags: tags ?? [],
        isFeatured: isFeatured ?? false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        fundingSource,
        createdBy: session.user.id,
      },
    });
    return NextResponse.json(project, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}
