import { fetchApi } from "./http-client";

export type RegionItem = {
  id: string;
  nameZh: string;
  nameEn: string;
  countryCount: number;
  workspaceCount: number;
};

export type CountryItem = {
  id: string;
  nameZh: string;
  nameEn: string;
  regionId: string;
  centerLng: number;
  centerLat: number;
  workspaceCount: number;
};

export type WorkspaceStatus = "ACTIVE" | "PLANNING" | "CLOSED";

export type WorkspaceListItem = {
  id: string;
  code: string | null;
  name: string;
  countryId: string;
  city: string;
  address: string;
  lat: number;
  lng: number;
  status: WorkspaceStatus;
  seatCount: number;
  leaseEndDate: string | null;
  tags: string[];
};

export type WorkspaceListResult = {
  items: WorkspaceListItem[];
  total: number;
  page: number;
  pageSize: number;
};

export type WorkspaceQuery = {
  region?: string;
  country?: string;
  city?: string;
  status?: WorkspaceStatus;
  minSeats?: number;
  leaseExpireBefore?: string;
  keyword?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
};

export async function getRegions(): Promise<RegionItem[]> {
  return fetchApi<RegionItem[]>("/regions");
}

export async function getCountries(region?: string): Promise<CountryItem[]> {
  const query = region ? `?region=${encodeURIComponent(region)}` : "";
  return fetchApi<CountryItem[]>(`/countries${query}`);
}

export async function getWorkspaces(
  query: WorkspaceQuery,
): Promise<WorkspaceListResult> {
  const search = new URLSearchParams();
  const assign = (key: string, value: string | number | undefined) => {
    if (value === undefined || value === null || value === "") return;
    search.set(key, String(value));
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
    search.set("tags", query.tags.join(","));
  }

  const qs = search.toString();
  return fetchApi<WorkspaceListResult>(`/workspaces${qs ? `?${qs}` : ""}`);
}
