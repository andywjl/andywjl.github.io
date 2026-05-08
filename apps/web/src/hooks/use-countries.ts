import { getCountries } from "@/api/workspaces-api";
import { useGlobeStore } from "@/store/globe-store";
import { useSWRResource } from "./use-swr-resource";

export function useCountries(regionOverride?: string) {
  const regionFromStore = useGlobeStore((state) => state.selectedRegion);
  const region = regionOverride ?? regionFromStore;
  const key = `countries:${region ?? "all"}`;

  return useSWRResource(key, () => getCountries(region));
}
