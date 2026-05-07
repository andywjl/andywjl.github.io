import { prisma } from "@/lib/prisma";
import { EquipmentListClient } from "./equipment-list-client";

export const dynamic = "force-dynamic";

export default async function EquipmentPage() {
  const equipment = await prisma.equipment.findMany({
    include: { campus: { select: { name: true } } },
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
  });

  const campuses = await prisma.campus.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });

  return (
    <EquipmentListClient
      equipment={equipment.map(e => ({
        ...e,
        campusName: e.campus.name,
        installDate: e.installDate.toISOString(),
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      }))}
      campuses={campuses}
    />
  );
}
