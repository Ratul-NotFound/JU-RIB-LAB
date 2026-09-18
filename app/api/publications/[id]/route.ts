import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const pub = await prisma.publication.findUnique({
      where: { id },
      include: { creator: { select: { name: true } } },
    });
    if (!pub) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(pub);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  try {
    const pub = await prisma.publication.update({
      where: { id },
      data: {
        title: body.title,
        authors: body.authors,
        journal: body.journal,
        year: body.year ? parseInt(body.year) : undefined,
        doi: body.doi,
        abstract: body.abstract,
        pdfUrl: body.pdfUrl,
        type: body.type,
        citationCount: body.citationCount ? parseInt(body.citationCount) : null,
        isFeatured: body.isFeatured,
      },
    });
    return NextResponse.json(pub);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    await prisma.publication.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}
