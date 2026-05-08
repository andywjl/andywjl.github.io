import { useCountries } from "./use-countries";
import { useRegions } from "./use-regions";
import { useWorkspaces } from "./use-workspaces";

export function WorkspaceDataDevPanel() {
  const regions = useRegions();
  const countries = useCountries();
  const workspaces = useWorkspaces();

  if (regions.error || countries.error || workspaces.error) {
    return (
      <div className="rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">
        数据加载失败：
        {regions.error?.message ||
          countries.error?.message ||
          workspaces.error?.message}
      </div>
    );
  }

  if (regions.isLoading || countries.isLoading || workspaces.isLoading) {
    return (
      <div className="rounded-md border border-slate-700 bg-slate-800/50 p-3 text-sm text-slate-200">
        正在加载数据...
      </div>
    );
  }

  return (
    <section className="rounded-md border border-slate-700 bg-slate-800/40 p-3 text-sm text-slate-100">
      <h3 className="mb-2 font-semibold">Workspace Data Preview (M1-E)</h3>
      <ul className="space-y-1 text-slate-300">
        <li>regions: {regions.data?.length ?? 0}</li>
        <li>countries: {countries.data?.length ?? 0}</li>
        <li>workspaces total: {workspaces.data?.total ?? 0}</li>
      </ul>
    </section>
  );
}
