import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campusId = searchParams.get("campusId");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (campusId) where.campusId = campusId;
  if (status) where.status = status;

  const projects = await prisma.project.findMany({
    where,
    include: { campus: { select: { name: true } }, _count: { select: { issues: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const project = await prisma.project.create({ data: body });
  return NextResponse.json(project, { status: 201 });
}
