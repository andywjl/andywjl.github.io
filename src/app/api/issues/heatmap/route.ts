import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { MANAGEMENT_GOALS } from "@/lib/constants";

export async function GET() {
  const campuses = await prisma.campus.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  const issues = await prisma.issue.findMany({ select: { campusId: true, goal: true, riskLevel: true } });

  const matrix: Record<string, Record<string, { count: number; highRisk: number }>> = {};
  for (const c of campuses) {
    matrix[c.name] = {};
    for (const g of MANAGEMENT_GOALS) {
      matrix[c.name][g] = { count: 0, highRisk: 0 };
    }
  }

  for (const issue of issues) {
    const campusName = campuses.find((c) => c.id === issue.campusId)?.name;
    if (campusName && matrix[campusName]?.[issue.goal]) {
      matrix[campusName][issue.goal].count++;
      if (issue.riskLevel === "高") matrix[campusName][issue.goal].highRisk++;
    }
  }

  return NextResponse.json({ campuses: campuses.map((c) => c.name), goals: [...MANAGEMENT_GOALS], matrix });
}
