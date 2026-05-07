import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const issues = await prisma.issue.findMany({
    select: { title: true, campusId: true, goal: true, riskLevel: true },
  });

  const titleMap: Record<string, { campuses: Set<string>; goal: string; riskLevel: string; count: number }> = {};
  for (const i of issues) {
    if (!titleMap[i.title]) {
      titleMap[i.title] = { campuses: new Set(), goal: i.goal, riskLevel: i.riskLevel, count: 0 };
    }
    titleMap[i.title].campuses.add(i.campusId);
    titleMap[i.title].count++;
  }

  const common = Object.entries(titleMap)
    .filter(([, v]) => v.campuses.size >= 3)
    .map(([title, v]) => ({ title, campusCount: v.campuses.size, goal: v.goal, riskLevel: v.riskLevel, totalCount: v.count }))
    .sort((a, b) => b.campusCount - a.campusCount);

  return NextResponse.json(common);
}
