import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CampusDetailClient } from "./campus-detail-client";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function CampusDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campus = await prisma.campus.findUnique({
    where: { id },
    include: {
      issues: { orderBy: { createdAt: "desc" }, take: 50 },
      equipments: { orderBy: { status: "asc" }, take: 50 },
      projects: { orderBy: { createdAt: "desc" } },
      _count: { select: { issues: true, equipments: true, projects: true, metrics: true } },
    },
  });

  if (!campus) notFound();

  const age = new Date().getFullYear() - new Date(campus.deliveryDate).getFullYear();

  const issuesByGoal: Record<string, number> = {};
  for (const issue of campus.issues) {
    issuesByGoal[issue.goal] = (issuesByGoal[issue.goal] || 0) + 1;
  }

  const issuesByStatus: Record<string, number> = {};
  for (const issue of campus.issues) {
    issuesByStatus[issue.status] = (issuesByStatus[issue.status] || 0) + 1;
  }

  const equipByStatus: Record<string, number> = {};
  for (const eq of campus.equipments) {
    equipByStatus[eq.status] = (equipByStatus[eq.status] || 0) + 1;
  }

  return (
    <CampusDetailClient
      campus={{
        ...campus,
        deliveryDate: format(new Date(campus.deliveryDate), "yyyy-MM-dd"),
        ifmSwitchDate: campus.ifmSwitchDate ? format(new Date(campus.ifmSwitchDate), "yyyy-MM-dd") : null,
        age,
        businessLines: JSON.parse(campus.businessLines) as string[],
        topGoals: JSON.parse(campus.topGoals) as string[],
      }}
      counts={campus._count}
      issuesByGoal={issuesByGoal}
      issuesByStatus={issuesByStatus}
      equipByStatus={equipByStatus}
      issues={campus.issues.map(i => ({ ...i, createdAt: i.createdAt.toISOString(), updatedAt: i.updatedAt.toISOString(), closedAt: i.closedAt?.toISOString() || null }))}
      equipment={campus.equipments.map(e => ({ ...e, installDate: e.installDate.toISOString(), createdAt: e.createdAt.toISOString(), updatedAt: e.updatedAt.toISOString() }))}
      projects={campus.projects.map(p => ({ ...p, startDate: p.startDate?.toISOString() || null, endDate: p.endDate?.toISOString() || null, createdAt: p.createdAt.toISOString(), updatedAt: p.updatedAt.toISOString() }))}
    />
  );
}
