import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const maintenance = await prisma.maintenance.create({
    data: { ...body, equipmentId: id },
  });
  return NextResponse.json(maintenance, { status: 201 });
}
