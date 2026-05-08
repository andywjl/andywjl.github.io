import type { WorkspaceListItem } from "@/api/workspaces-api";

const statusStyle: Record<WorkspaceListItem["status"], string> = {
  ACTIVE: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  PLANNING: "bg-amber-500/20 text-amber-300 border-amber-500/40",
  CLOSED: "bg-slate-500/20 text-slate-300 border-slate-500/40",
};

type WorkspaceCardProps = {
  workspace: WorkspaceListItem;
  onClick: (workspace: WorkspaceListItem) => void;
};

export function WorkspaceCard({ workspace, onClick }: WorkspaceCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick(workspace)}
      className="w-full rounded-md border border-slate-700 bg-slate-900/70 p-3 text-left hover:border-slate-500 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <h4 className="font-medium text-slate-100">{workspace.name}</h4>
        <span
          className={`rounded border px-2 py-0.5 text-xs ${statusStyle[workspace.status]}`}
        >
          {workspace.status}
        </span>
      </div>
      <p className="mt-2 text-xs text-slate-300">{workspace.city}</p>
      <p className="mt-1 text-xs text-slate-400 line-clamp-1">{workspace.address}</p>
      <p className="mt-2 text-xs text-slate-300">
        Seats: <span className="font-semibold">{workspace.seatCount}</span>
      </p>
    </button>
  );
}
