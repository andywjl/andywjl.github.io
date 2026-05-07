import { prisma } from "@/lib/prisma";
import { IssuesKanbanClient } from "./issues-kanban-client";

export const dynamic = "force-dynamic";

export default async function IssuesPage() {
  const issues = await prisma.issue.findMany({
    include: { campus: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  const campuses = await prisma.campus.findMany({ select: { id: true, name: true }, orderBy: { name: "asc" } });

  return (
    <IssuesKanbanClient
      issues={issues.map(i => ({
        ...i,
        campusName: i.campus.name,
        createdAt: i.createdAt.toISOString(),
        updatedAt: i.updatedAt.toISOString(),
        closedAt: i.closedAt?.toISOString() || null,
      }))}
      campuses={campuses}
    />
  );
}
