import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { checkAlert } from "@/lib/alerts";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campusId = searchParams.get("campusId");
  const metricId = searchParams.get("metricId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const where: Record<string, unknown> = {};
  if (campusId) where.campusId = campusId;
  if (metricId) where.metricId = metricId;
  if (from || to) {
    where.recordedAt = {};
    if (from) (where.recordedAt as Record<string, unknown>).gte = new Date(from);
    if (to) (where.recordedAt as Record<string, unknown>).lte = new Date(to);
  }

  const records = await prisma.metricRecord.findMany({
    where,
    include: { metric: { select: { name: true, unit: true } }, campus: { select: { name: true } } },
    orderBy: { recordedAt: "desc" },
    take: 500,
  });
  return NextResponse.json(records);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const def = await prisma.metricDefinition.findUnique({ where: { id: body.metricId } });
  if (!def) return NextResponse.json({ error: "Metric not found" }, { status: 404 });

  const alertLevel = checkAlert({
    value: body.value,
    yellowThreshold: def.yellowThreshold,
    orangeThreshold: def.orangeThreshold,
    redThreshold: def.redThreshold,
    direction: def.thresholdDir as "above" | "below",
  });

  const record = await prisma.metricRecord.create({
    data: { ...body, alertLevel },
  });
  return NextResponse.json(record, { status: 201 });
}
