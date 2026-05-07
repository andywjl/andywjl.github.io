import { getCampuses, getCampus, getCampusIssues, getCampusEquipment, getCampusProjects, getCampusStats } from "@/lib/data";
import { notFound } from "next/navigation";
import { CampusDetailClient } from "./campus-detail-client";
import { format } from "date-fns";

export function generateStaticParams() {
  return getCampuses().map((c) => ({ id: c.id }));
}

export default async function CampusDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const campus = getCampus(id);
  if (!campus) notFound();

  const issues = getCampusIssues(id);
  const equipment = getCampusEquipment(id);
  const projects = getCampusProjects(id);
  const stats = getCampusStats(id);
  const age = new Date().getFullYear() - new Date(campus.deliveryDate).getFullYear();

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
      counts={{ issues: stats.issueCount, equipments: stats.equipmentCount, projects: stats.projectCount, metrics: 0 }}
      issuesByGoal={{}}
      issuesByStatus={{}}
      equipByStatus={{}}
      issues={issues.map(i => ({ ...i }))}
      equipment={equipment.map(e => ({ ...e }))}
      projects={projects.map(p => ({ ...p }))}
    />
  );
}
