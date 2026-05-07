import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const campuses = await prisma.campus.findMany({
    include: {
      _count: {
        select: { equipments: true, issues: true, projects: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const result = await Promise.all(
    campuses.map(async (c) => {
      const alerts = await prisma.metricRecord.count({
        where: { campusId: c.id, alertLevel: { not: null } },
      });
      const equipWarnings = await prisma.equipment.count({
        where: { campusId: c.id, status: { not: "正常" } },
      });
      return { ...c, alertCount: alerts, equipWarningCount: equipWarnings };
    })
  );

  return NextResponse.json(result);
}
