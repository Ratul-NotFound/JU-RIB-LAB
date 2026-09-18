import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const publications = await prisma.publication.findMany({
      orderBy: [{ isFeatured: "desc" }, { year: "desc" }],
      include: { creator: { select: { name: true } } },
    });
    return NextResponse.json(publications);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { title, authors, journal, year, doi, abstract, pdfUrl, type, citationCount, isFeatured } = body;

  if (!title || !authors || !year) return NextResponse.json({ error: "Title, authors, and year required" }, { status: 400 });

  try {
    const pub = await prisma.publication.create({
      data: {
        title, authors, journal,
        year: parseInt(year),
        doi, abstract, pdfUrl,
        type: type ?? "JOURNAL",
        citationCount: citationCount ? parseInt(citationCount) : null,
        isFeatured: isFeatured ?? false,
        createdBy: session.user.id!,
      },
    });
    return NextResponse.json(pub, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create publication" }, { status: 500 });
  }
}
