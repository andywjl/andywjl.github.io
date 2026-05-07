import { getAllMetricDefinitions, getAlertRecords, getCampuses } from "@/lib/data";
import { MetricsClient } from "./metrics-client";

export default function MetricsPage() {
  const definitions = getAllMetricDefinitions();
  const campuses = getCampuses();
  const alertRecords = getAlertRecords().slice(0, 20);

  const recentAlerts = alertRecords.map(a => {
    const campus = campuses.find(c => c.id === a.campusId);
    const metric = definitions.find(d => d.id === a.metricId);
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
    <MetricsClient
      definitions={definitions}
      campuses={campuses.map(c => ({ id: c.id, name: c.name }))}
      recentAlerts={recentAlerts}
    />
  );
}
