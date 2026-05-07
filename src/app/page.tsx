import { getCampuses, getCampusStats, getAlertRecords, getAllIssues, getAllEquipment, getAllProjects, getAllMetricDefinitions } from "@/lib/data";
import { DashboardClient } from "./dashboard-client";

export default function DashboardPage() {
  const campuses = getCampuses();

  const campusCards = campuses.map((c) => {
    const stats = getCampusStats(c.id);
    return {
      id: c.id,
      name: c.name,
      city: c.city,
      totalArea: c.totalArea,
      workstations: c.workstations,
      managementTier: c.managementTier,
      ifmVendor: c.ifmVendor,
      issueCount: stats.issueCount,
      equipWarningCount: stats.equipWarningCount,
      alertCount: stats.alertCount,
    };
  });

  const alertRecords = getAlertRecords().slice(0, 10);
  const allDefs = getAllMetricDefinitions();
  const recentAlerts = alertRecords.map((a) => {
    const campus = campuses.find((c) => c.id === a.campusId);
    const metric = allDefs.find((d) => d.id === a.metricId);
    return {
      id: a.id,
      campusName: campus?.name || "",
      metricName: metric?.name || "",
      value: a.value,
      unit: metric?.unit || "",
      alertLevel: a.alertLevel!,
      recordedAt: a.recordedAt,
    };
  });

  return (
    <DashboardClient
      campusCards={campusCards}
      recentAlerts={recentAlerts}
      stats={{
        campuses: campuses.length,
        issues: getAllIssues().length,
        equipment: getAllEquipment().length,
        projects: getAllProjects().length,
      }}
    />
  );
}
