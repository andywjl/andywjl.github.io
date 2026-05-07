import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const campus = await prisma.campus.findUnique({
    where: { id },
    include: {
      equipments: { take: 20, orderBy: { updatedAt: "desc" } },
      issues: { take: 20, orderBy: { createdAt: "desc" } },
      projects: { orderBy: { createdAt: "desc" } },
      _count: { select: { equipments: true, issues: true, projects: true, metrics: true } },
    },
  });
  if (!campus) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(campus);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const campus = await prisma.campus.update({ where: { id }, data: body });
  return NextResponse.json(campus);
}
