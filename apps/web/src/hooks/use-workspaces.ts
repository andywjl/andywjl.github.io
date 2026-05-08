import { getAllWorkspaces, type WorkspaceQuery } from "@/api/workspaces-api";
import { useGlobeStore } from "@/store/globe-store";
import { useMemo } from "react";
import { useSWRResource } from "./use-swr-resource";

function serializeQuery(query: WorkspaceQuery): string {
  const sortable: Record<string, string> = {};
  const assign = (key: string, value: string | number | undefined) => {
    if (value === undefined || value === null || value === "") return;
    sortable[key] = String(value);
  };

  assign("region", query.region);
  assign("country", query.country);
  assign("city", query.city);
  assign("status", query.status);
  assign("minSeats", query.minSeats);
  assign("leaseExpireBefore", query.leaseExpireBefore);
  assign("keyword", query.keyword);
  assign("page", query.page);
  assign("pageSize", query.pageSize);
  if (query.tags && query.tags.length > 0) {
    sortable.tags = query.tags.join(",");
  }

  return Object.keys(sortable)
    .sort()
    .map((key) => `${key}=${sortable[key]}`)
    .join("&");
}

export function useWorkspaces(queryOverride?: WorkspaceQuery) {
  const queryFromStore = useGlobeStore((state) => state.workspaceQuery);
  const query = queryOverride ?? queryFromStore;
  const key = useMemo(() => `workspaces:${serializeQuery(query)}`, [query]);

  return useSWRResource(key, () => getAllWorkspaces(query));
}
