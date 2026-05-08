import { SearchBar } from "@/components/SearchBar";
import { StatusFilter } from "@/components/StatusFilter";
import { WorkspaceDetailModal } from "@/components/WorkspaceDetailModal";
import { WorkspaceDrawer } from "@/components/WorkspaceDrawer";
import { useWorkspaces } from "@/hooks";
import { globeStoreActions, useGlobeStore } from "@/store";
import type { WorkspaceListItem } from "@/api/workspaces-api";
import { Suspense, lazy, useEffect, useMemo, useState } from "react";

declare global {
  interface Window {
    __globeStoreActions?: typeof globeStoreActions;
  }
}

const LazyGlobeView = lazy(async () => {
  const module = await import("@/components/GlobeView");
  return { default: module.GlobeView };
});

export function App() {
  const selectedCountry = useGlobeStore((state) => state.selectedCountry);
  const selectedWorkspaceId = useGlobeStore(
    (state) => state.selectedWorkspaceId,
  );
  const query = useGlobeStore((state) => state.workspaceQuery);
  const workspaceResource = useWorkspaces(query);
  const [showGlobe, setShowGlobe] = useState(false);
  const isDrawerOpen = Boolean(selectedCountry);

  const selectedWorkspace = useMemo(() => {
    return workspaceResource.data?.items.find(
      (workspace) => workspace.id === selectedWorkspaceId,
    );
  }, [selectedWorkspaceId, workspaceResource.data?.items]);

  const handleSelectWorkspace = (workspace: WorkspaceListItem) => {
    globeStoreActions.setSelectedWorkspace(workspace.id);
    globeStoreActions.setFlyToTarget({
      workspaceId: workspace.id,
      lat: workspace.lat,
      lng: workspace.lng,
      altitude: 1.1,
    });
  };

  useEffect(() => {
    if (!import.meta.env.DEV) {
      return;
    }
    window.__globeStoreActions = globeStoreActions;
    return () => {
      delete window.__globeStoreActions;
    };
  }, []);

  return (
    <main className="bg-slate-900 text-slate-50 min-h-screen px-6 py-6">
      <div className="mx-auto max-w-[1280px] space-y-4">
        <SearchBar
          initialKeyword={query.keyword}
          onKeywordChange={(keyword) =>
            globeStoreActions.setWorkspaceQuery({ keyword })
          }
        />
        <StatusFilter
          value={query.status}
          onChange={(status) => globeStoreActions.setWorkspaceQuery({ status })}
        />

        {showGlobe ? (
          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-700 bg-slate-800/20 p-4 text-slate-300">
                正在加载 3D 地球...
              </div>
            }
          >
            <LazyGlobeView
              workspaces={workspaceResource.data?.items ?? []}
              isLoading={workspaceResource.isLoading}
              error={workspaceResource.error?.message}
            />
          </Suspense>
        ) : (
          <div className="space-y-3 rounded-2xl border border-slate-700 bg-slate-800/20 p-4 text-slate-300">
            <p>地球渲染按需加载以减少首屏开销。</p>
            <button
              type="button"
              className="rounded border border-slate-600 px-3 py-1 text-sm text-slate-100 hover:bg-slate-700"
              onClick={() => setShowGlobe(true)}
            >
              加载 3D 地球
            </button>
          </div>
        )}
      </div>

      <WorkspaceDrawer
        open={isDrawerOpen}
        selectedCountry={selectedCountry}
        workspaces={isDrawerOpen ? workspaceResource.data?.items ?? [] : []}
        total={isDrawerOpen ? workspaceResource.data?.total ?? 0 : 0}
        onClose={() => globeStoreActions.setCountry(undefined)}
        onSelectWorkspace={handleSelectWorkspace}
      />

      <WorkspaceDetailModal
        open={Boolean(selectedWorkspace)}
        workspace={selectedWorkspace}
        onClose={() => globeStoreActions.setSelectedWorkspace(undefined)}
      />
    </main>
  );
}
