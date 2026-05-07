"use client";

import { AlertTriangle } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { getHeatmapData } from "@/lib/data";

export function Heatmap() {
  const data = getHeatmapData();

  const maxCount = Math.max(
    1,
    ...Object.values(data.matrix).flatMap((row) =>
      Object.values(row).map((c) => c.count)
    )
  );

  function getColor(count: number) {
    if (count === 0) return "bg-gray-50";
    const intensity = Math.min(count / maxCount, 1);
    if (intensity > 0.7) return "bg-red-200";
    if (intensity > 0.4) return "bg-amber-200";
    if (intensity > 0.15) return "bg-yellow-100";
    return "bg-green-50";
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[10px]">
        <thead>
          <tr>
            <th className="sticky left-0 bg-white z-10 p-1 text-left font-semibold text-muted-foreground">园区</th>
            {data.goals.map((g) => (
              <th key={g} className="p-1 font-medium text-muted-foreground whitespace-nowrap" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}>
                {g}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.campuses.map((campus) => (
            <tr key={campus}>
              <td className="sticky left-0 bg-white z-10 p-1 font-semibold whitespace-nowrap">{campus}</td>
              {data.goals.map((goal) => {
                const cell = data.matrix[campus]?.[goal] || { count: 0, highRisk: 0 };
                return (
                  <td key={goal} className="p-0.5">
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={`w-7 h-7 rounded flex items-center justify-center ${getColor(cell.count)} cursor-default`}>
                          {cell.highRisk > 0 && <AlertTriangle className="w-3 h-3 text-red-500" />}
                          {cell.count > 0 && cell.highRisk === 0 && <span className="text-[9px] font-medium">{cell.count}</span>}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">{campus} - {goal}</p>
                        <p className="text-xs text-muted-foreground">问题数: {cell.count} | 高风险: {cell.highRisk}</p>
                      </TooltipContent>
                    </Tooltip>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
