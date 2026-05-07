import { prisma } from "@/lib/prisma";
import { MetricsClient } from "./metrics-client";

export const dynamic = "force-dynamic";

export default async function MetricsPage() {
  const definitions = await prisma.metricDefinition.findMany({ orderBy: { goal: "asc" } });
  const campuses = await prisma.campus.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });

  const recentAlerts = await prisma.metricRecord.findMany({
    where: { alertLevel: { not: null } },
    include: { metric: { select: { name: true, unit: true } }, campus: { select: { name: true } } },
    orderBy: { recordedAt: "desc" },
    take: 20,
  });

  return (
    <MetricsClient
      definitions={definitions.map(d => ({ ...d, createdAt: d.createdAt.toISOString() }))}
      campuses={campuses}
      recentAlerts={recentAlerts.map(a => ({
        id: a.id,
        campusName: a.campus.name,
        metricName: a.metric.name,
        value: a.value,
        unit: a.metric.unit || "",
        alertLevel: a.alertLevel!,
        recordedAt: a.recordedAt.toISOString(),
      }))}
    />
  );
}
