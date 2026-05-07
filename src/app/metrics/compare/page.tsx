import { getCampuses, getAllMetricDefinitions } from "@/lib/data";
import { CompareClient } from "./compare-client";

export default function ComparePage() {
  const campuses = getCampuses().map(c => ({ id: c.id, name: c.name }));
  const definitions = getAllMetricDefinitions().map(d => ({
    id: d.id, name: d.name, goal: d.goal, unit: d.unit,
  }));

  return <CompareClient campuses={campuses} definitions={definitions} />;
}
