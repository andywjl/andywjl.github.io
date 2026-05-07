import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campusIds = searchParams.get("campusIds")?.split(",").filter(Boolean) || [];
  const metricIds = searchParams.get("metricIds")?.split(",").filter(Boolean) || [];

  if (!campusIds.length || !metricIds.length) {
    return NextResponse.json({ error: "campusIds and metricIds required" }, { status: 400 });
  }

  const records = await prisma.metricRecord.findMany({
    where: { campusId: { in: campusIds }, metricId: { in: metricIds } },
    include: { metric: { select: { name: true, unit: true } }, campus: { select: { name: true } } },
    orderBy: { recordedAt: "asc" },
  });

  return NextResponse.json(records);
}
