import { getAllIssues, getCampuses } from "@/lib/data";
import { IssuesKanbanClient } from "./issues-kanban-client";

export default function IssuesPage() {
  const issues = getAllIssues();
  const campuses = getCampuses();

  return (
    <IssuesKanbanClient
      issues={issues.map(i => ({
        ...i,
        campusName: campuses.find(c => c.id === i.campusId)?.name || "",
      }))}
      campuses={campuses.map(c => ({ id: c.id, name: c.name }))}
    />
  );
}
