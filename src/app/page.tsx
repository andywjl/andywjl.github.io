import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const campuses = await prisma.campus.findMany({
    include: { _count: { select: { issues: true, equipments: true } } },
    orderBy: { name: "asc" },
  });

  const campusCards = await Promise.all(
    campuses.map(async (c) => {
      const alertCount = await prisma.metricRecord.count({
        where: { campusId: c.id, alertLevel: { not: null } },
      });
      const equipWarnings = await prisma.equipment.count({
        where: { campusId: c.id, status: { not: "正常" } },
      });
      return {
        id: c.id,
        name: c.name,
        city: c.city,
        totalArea: c.totalArea,
        workstations: c.workstations,
        managementTier: c.managementTier,
        ifmVendor: c.ifmVendor,
        issueCount: c._count.issues,
        equipWarningCount: equipWarnings,
        alertCount,
      };
    })
  );

  const recentAlerts = await prisma.metricRecord.findMany({
    where: { alertLevel: { not: null } },
    include: { metric: { select: { name: true, unit: true } }, campus: { select: { name: true } } },
    orderBy: { recordedAt: "desc" },
    take: 10,
  });

  const totalIssues = await prisma.issue.count();
  const totalEquipment = await prisma.equipment.count();
  const totalProjects = await prisma.project.count();

  return (
    <DashboardClient
      campusCards={campusCards}
      recentAlerts={recentAlerts.map((a) => ({
        id: a.id,
        campusName: a.campus.name,
        metricName: a.metric.name,
        value: a.value,
        unit: a.metric.unit || "",
        alertLevel: a.alertLevel!,
        recordedAt: a.recordedAt.toISOString(),
      }))}
      stats={{ campuses: campuses.length, issues: totalIssues, equipment: totalEquipment, projects: totalProjects }}
    />
  );
}
