import { prisma } from "@/lib/prisma";
import { CompareClient } from "./compare-client";

export const dynamic = "force-dynamic";

export default async function ComparePage() {
  const campuses = await prisma.campus.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });
  const definitions = await prisma.metricDefinition.findMany({
    select: { id: true, name: true, goal: true, unit: true },
    orderBy: { goal: "asc" },
  });

  return <CompareClient campuses={campuses} definitions={definitions} />;
}
