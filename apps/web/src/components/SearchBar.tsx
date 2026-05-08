import { useEffect, useState } from "react";

type SearchBarProps = {
  initialKeyword?: string;
  onKeywordChange: (keyword: string) => void;
};

export function SearchBar({ initialKeyword, onKeywordChange }: SearchBarProps) {
  const [keyword, setKeyword] = useState(initialKeyword ?? "");

  useEffect(() => {
    const timer = setTimeout(() => {
      onKeywordChange(keyword.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [keyword, onKeywordChange]);

  return (
    <div className="grid gap-2 md:grid-cols-2">
      <label className="flex flex-col gap-1 text-xs text-slate-300">
        关键词搜索（300ms debounce）
        <input
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder="输入城市、地址或名称（如 Singapore）"
          className="rounded border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-sky-400"
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-slate-300">
        AI 查询
        <input
          disabled
          placeholder="AI 查询将在 M2 启用"
          className="cursor-not-allowed rounded border border-slate-700 bg-slate-800/60 px-3 py-2 text-sm text-slate-500"
        />
      </label>
    </div>
  );
}
