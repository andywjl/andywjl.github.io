import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const level = searchParams.get("level");

  const where: Record<string, unknown> = { alertLevel: { not: null } };
  if (level) where.alertLevel = level;

  const alerts = await prisma.metricRecord.findMany({
    where,
    include: { metric: { select: { name: true, unit: true } }, campus: { select: { name: true } } },
    orderBy: { recordedAt: "desc" },
    take: 50,
  });
  return NextResponse.json(alerts);
}
