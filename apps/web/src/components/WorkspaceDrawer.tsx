import type { WorkspaceListItem } from "@/api/workspaces-api";
import { WorkspaceCard } from "./WorkspaceCard";

type WorkspaceDrawerProps = {
  open: boolean;
  selectedCountry?: string;
  workspaces: WorkspaceListItem[];
  total: number;
  onClose: () => void;
  onSelectWorkspace: (workspace: WorkspaceListItem) => void;
};

export function WorkspaceDrawer({
  open,
  selectedCountry,
  workspaces,
  total,
  onClose,
  onSelectWorkspace,
}: WorkspaceDrawerProps) {
  return (
    <aside
      className={`fixed z-20 border-slate-700 bg-slate-950/95 p-4 transition-transform duration-200
        inset-x-0 bottom-0 h-[68vh] rounded-t-xl border-t
        md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[420px] md:max-w-md md:rounded-none md:border-l md:border-t-0
        ${
          open
            ? "translate-y-0 opacity-100 pointer-events-auto md:translate-x-0"
            : "translate-y-full opacity-0 pointer-events-none md:translate-y-0 md:translate-x-full"
        }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">Workspace Drawer</h3>
          <p className="text-xs text-slate-300">
            Country: {selectedCountry ?? "N/A"} · Total: {total}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
        >
          Close
        </button>
      </div>

      <div className="mt-4 space-y-2 overflow-y-auto pb-8" style={{ maxHeight: "calc(100vh - 120px)" }}>
        {workspaces.map((workspace) => (
          <WorkspaceCard
            key={workspace.id}
            workspace={workspace}
            onClick={onSelectWorkspace}
          />
        ))}
        {workspaces.length === 0 && (
          <p className="rounded border border-slate-700 bg-slate-900/60 p-3 text-sm text-slate-400">
            No workspace matched current filters.
          </p>
        )}
      </div>
    </aside>
  );
}
