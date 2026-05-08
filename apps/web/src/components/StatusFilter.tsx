import type { WorkspaceStatus } from "@/api/workspaces-api";

type StatusFilterProps = {
  value?: WorkspaceStatus;
  onChange: (value?: WorkspaceStatus) => void;
};

const statuses: WorkspaceStatus[] = ["ACTIVE", "PLANNING", "CLOSED"];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <button
        type="button"
        onClick={() => onChange(undefined)}
        className={`rounded border px-2 py-1 text-xs ${
          !value
            ? "border-sky-400 bg-sky-500/20 text-sky-200"
            : "border-slate-600 text-slate-300 hover:bg-slate-800"
        }`}
      >
        ALL
      </button>
      {statuses.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onChange(status)}
          className={`rounded border px-2 py-1 text-xs ${
            value === status
              ? "border-sky-400 bg-sky-500/20 text-sky-200"
              : "border-slate-600 text-slate-300 hover:bg-slate-800"
          }`}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
