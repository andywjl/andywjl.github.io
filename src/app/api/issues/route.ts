import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const campusId = searchParams.get("campusId");
  const goal = searchParams.get("goal");
  const status = searchParams.get("status");
  const riskLevel = searchParams.get("riskLevel");

  const where: Record<string, unknown> = {};
  if (campusId) where.campusId = campusId;
  if (goal) where.goal = goal;
  if (status) where.status = status;
  if (riskLevel) where.riskLevel = riskLevel;

  const issues = await prisma.issue.findMany({
    where,
    include: { campus: { select: { name: true } }, project: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(issues);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const issue = await prisma.issue.create({ data: body });
  return NextResponse.json(issue, { status: 201 });
}
