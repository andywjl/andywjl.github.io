import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const eq = await prisma.equipment.findUnique({
    where: { id },
    include: {
      campus: { select: { name: true } },
      maintenances: { orderBy: { date: "desc" } },
      faults: { orderBy: { occurredAt: "desc" } },
    },
  });
  if (!eq) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(eq);
}
