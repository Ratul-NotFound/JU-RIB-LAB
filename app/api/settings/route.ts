import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET all lab settings
export async function GET() {
  try {
    let settings = await prisma.labSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) {
      settings = await prisma.labSettings.create({
        data: { id: "singleton" },
      });
    }
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// UPDATE lab settings
export async function PATCH(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  try {
    const settings = await prisma.labSettings.upsert({
      where: { id: "singleton" },
      create: { id: "singleton", ...body },
      update: body,
    });
    return NextResponse.json(settings);
  } catch {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
