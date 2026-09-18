import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import slugify from "slugify";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, excerpt, content, tags, status, coverUrl } = body;

  if (!title || !content) return NextResponse.json({ error: "Title and content required" }, { status: 400 });

  const baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let i = 1;
  while (await prisma.post.findUnique({ where: { slug } })) slug = `${baseSlug}-${i++}`;

  try {
    const post = await prisma.post.create({
      data: {
        title, slug, excerpt, content,
        coverUrl,
        tags: tags ?? [],
        status: status ?? "DRAFT",
        authorId: session.user.id!,
        publishedAt: status === "PUBLISHED" ? new Date() : null,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
