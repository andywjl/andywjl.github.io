import { getRegions } from "@/api/workspaces-api";
import { useSWRResource } from "./use-swr-resource";

export function useRegions() {
  return useSWRResource("regions", () => getRegions());
}
