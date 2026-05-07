"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge } from "@/components/alert-badge";
import { ISSUE_STATUSES, MANAGEMENT_GOALS, PHILOSOPHIES } from "@/lib/constants";

interface Issue {
  id: string; title: string; goal: string; riskLevel: string;
  status: string; category: string; campusId: string; campusName: string;
  description: string;
}

const COLUMN_COLORS: Record<string, string> = {
  待确认: "border-t-gray-400",
  已确认: "border-t-blue-400",
  整改中: "border-t-amber-400",
  已闭环: "border-t-green-400",
  持续监控: "border-t-purple-400",
};

export function IssuesKanbanClient({ issues, campuses }: {
  issues: Issue[];
  campuses: { id: string; name: string }[];
}) {
  const [filterCampus, setFilterCampus] = useState("");
  const [filterGoal, setFilterGoal] = useState("");
  const [filterRisk, setFilterRisk] = useState("");

  const filtered = useMemo(() => {
    return issues.filter(i => {
      if (filterCampus && i.campusId !== filterCampus) return false;
      if (filterGoal && i.goal !== filterGoal) return false;
      if (filterRisk && i.riskLevel !== filterRisk) return false;
      return true;
    });
  }, [issues, filterCampus, filterGoal, filterRisk]);

  const columns = ISSUE_STATUSES.map(status => ({
    status,
    items: filtered.filter(i => i.status === status),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">问题看板</h1>
        <p className="text-sm text-gray-500 mt-1">共 {issues.length} 个问题 · 当前筛选 {filtered.length} 个</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <select className="border rounded-lg px-3 py-2 text-sm bg-white" value={filterCampus} onChange={e => setFilterCampus(e.target.value)}>
          <option value="">全部园区</option>
          {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm bg-white" value={filterGoal} onChange={e => setFilterGoal(e.target.value)}>
          <option value="">全部目标</option>
          {MANAGEMENT_GOALS.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm bg-white" value={filterRisk} onChange={e => setFilterRisk(e.target.value)}>
          <option value="">全部风险</option>
          <option value="高">高</option>
          <option value="中">中</option>
          <option value="低">低</option>
        </select>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => (
          <div key={col.status} className="flex-shrink-0 w-72">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-sm font-semibold text-gray-700">{col.status}</h3>
              <Badge variant="secondary" className="text-[10px]">{col.items.length}</Badge>
            </div>
            <div className="space-y-2.5">
              {col.items.map(issue => (
                <Link key={issue.id} href={`/issues/${issue.id}`}>
                  <Card className={`p-3 hover:shadow-md transition-shadow cursor-pointer border-t-2 ${COLUMN_COLORS[col.status]}`}>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{issue.title}</h4>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <Badge variant="outline" className="text-[10px] bg-gray-50">{issue.campusName}</Badge>
                      <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-700">{issue.goal}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <RiskBadge level={issue.riskLevel} />
                      <span className="text-[10px] text-gray-400">{issue.category}</span>
                    </div>
                  </Card>
                </Link>
              ))}
              {col.items.length === 0 && (
                <div className="text-center text-gray-300 text-xs py-8 border-2 border-dashed rounded-lg">空</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
