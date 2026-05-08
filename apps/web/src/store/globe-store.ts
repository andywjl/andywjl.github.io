import { useSyncExternalStore } from "react";
import type { WorkspaceQuery } from "@/api/workspaces-api";

export type GlobeStoreState = {
  selectedRegion?: string;
  selectedCountry?: string;
  selectedWorkspaceId?: string;
  workspaceQuery: WorkspaceQuery;
};

type Listener = () => void;

const initialState: GlobeStoreState = {
  workspaceQuery: {
    page: 1,
    pageSize: 20,
  },
};

let state: GlobeStoreState = initialState;
const listeners = new Set<Listener>();

function emit() {
  for (const listener of listeners) {
    listener();
  }
}

function setState(updater: (current: GlobeStoreState) => GlobeStoreState) {
  state = updater(state);
  emit();
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useGlobeStore<T>(
  selector: (snapshot: GlobeStoreState) => T,
): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(initialState),
  );
}

export const globeStoreActions = {
  reset() {
    setState(() => initialState);
  },
  setRegion(region?: string) {
    setState((current) => ({
      ...current,
      selectedRegion: region,
      selectedCountry: undefined,
      workspaceQuery: {
        ...current.workspaceQuery,
        region,
        country: undefined,
        page: 1,
      },
    }));
  },
  setCountry(country?: string) {
    setState((current) => ({
      ...current,
      selectedCountry: country,
      workspaceQuery: {
        ...current.workspaceQuery,
        country,
        page: 1,
      },
    }));
  },
  setWorkspaceQuery(partial: Partial<WorkspaceQuery>) {
    setState((current) => ({
      ...current,
      workspaceQuery: {
        ...current.workspaceQuery,
        ...partial,
      },
    }));
  },
  setSelectedWorkspace(workspaceId?: string) {
    setState((current) => ({
      ...current,
      selectedWorkspaceId: workspaceId,
    }));
  },
};
