import { getAllEquipment, getCampuses } from "@/lib/data";
import { EquipmentListClient } from "./equipment-list-client";

export default function EquipmentPage() {
  const equipment = getAllEquipment();
  const campuses = getCampuses();

  return (
    <EquipmentListClient
      equipment={equipment.map(e => ({
        ...e,
        campusName: campuses.find(c => c.id === e.campusId)?.name || "",
      }))}
      campuses={campuses.map(c => ({ id: c.id, name: c.name }))}
    />
  );
}
