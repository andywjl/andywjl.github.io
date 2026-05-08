import type { WorkspaceListItem } from "@/api/workspaces-api";

type WorkspaceDetailModalProps = {
  workspace?: WorkspaceListItem;
  open: boolean;
  onClose: () => void;
};

export function WorkspaceDetailModal({
  workspace,
  open,
  onClose,
}: WorkspaceDetailModalProps) {
  if (!open || !workspace) return null;

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-lg border border-slate-700 bg-slate-950 p-4">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold text-slate-100">{workspace.name}</h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-slate-600 px-2 py-1 text-xs text-slate-200 hover:bg-slate-800"
          >
            Close
          </button>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-slate-400">Code</dt>
          <dd className="text-slate-100">{workspace.code ?? "-"}</dd>
          <dt className="text-slate-400">City</dt>
          <dd className="text-slate-100">{workspace.city}</dd>
          <dt className="text-slate-400">Seat Count</dt>
          <dd className="text-slate-100">{workspace.seatCount}</dd>
          <dt className="text-slate-400">Status</dt>
          <dd className="text-slate-100">{workspace.status}</dd>
          <dt className="text-slate-400">Address</dt>
          <dd className="text-slate-100 break-all">{workspace.address}</dd>
          <dt className="text-slate-400">Coordinates</dt>
          <dd className="text-slate-100">
            {workspace.lng}, {workspace.lat}
          </dd>
        </dl>
      </div>
    </div>
  );
}
