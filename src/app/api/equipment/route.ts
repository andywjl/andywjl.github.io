import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campusId = searchParams.get("campusId");
  const category1 = searchParams.get("category1");

  const where: Record<string, unknown> = {};
  if (campusId) where.campusId = campusId;
  if (category1) where.category1 = category1;

  const equipment = await prisma.equipment.findMany({
    where,
    include: { campus: { select: { name: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(equipment);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const equipment = await prisma.equipment.create({ data: body });
  return NextResponse.json(equipment, { status: 201 });
}
