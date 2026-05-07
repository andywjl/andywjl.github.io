"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertBadge } from "@/components/alert-badge";
import { Badge } from "@/components/ui/badge";
import { BarChart3, AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

interface MetricDef {
  id: string; name: string; goal: string; formula: string | null;
  unit: string | null; industryStd: string | null; companyTarget: string | null;
  source: string; frequency: string;
  yellowThreshold: number | null; orangeThreshold: number | null; redThreshold: number | null;
  thresholdDir: string;
}

interface Alert {
  id: string; campusName: string; metricName: string;
  value: number; unit: string; alertLevel: string; recordedAt: string;
}

export function MetricsClient({ definitions, campuses, recentAlerts }: {
  definitions: MetricDef[];
  campuses: { id: string; name: string }[];
  recentAlerts: Alert[];
}) {
  const groupedByGoal: Record<string, MetricDef[]> = {};
  for (const d of definitions) {
    if (!groupedByGoal[d.goal]) groupedByGoal[d.goal] = [];
    groupedByGoal[d.goal].push(d);
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">指标监控</h1>
          <p className="text-sm text-gray-500 mt-1">{definitions.length} 项指标定义 · <Link href="/metrics/compare" className="text-blue-600 hover:underline">横向对比 →</Link></p>
        </div>
      </div>

      {/* Recent Alerts */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            近期预警 ({recentAlerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentAlerts.map(a => (
              <div key={a.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg text-xs">
                <div>
                  <span className="font-semibold">{a.campusName}</span>
                  <span className="text-gray-400 mx-1">·</span>
                  <span className="text-gray-600">{a.metricName}: {a.value}{a.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertBadge level={a.alertLevel} />
                  <span className="text-gray-400">{format(new Date(a.recordedAt), "MM-dd")}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Metric Definitions by Goal */}
      <div className="space-y-4">
        {Object.entries(groupedByGoal).map(([goal, defs]) => (
          <Card key={goal}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                {goal}
                <Badge variant="secondary" className="text-[10px]">{defs.length} 项</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">指标名称</th>
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">公式</th>
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">单位</th>
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">行业标准</th>
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">公司目标</th>
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">数据源</th>
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">频率</th>
                      <th className="text-left p-2 text-xs font-semibold text-gray-600">预警阈值</th>
                    </tr>
                  </thead>
                  <tbody>
                    {defs.map(d => (
                      <tr key={d.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-2 font-medium">{d.name}</td>
                        <td className="p-2 text-gray-500 text-xs">{d.formula || "—"}</td>
                        <td className="p-2 text-gray-500">{d.unit || "—"}</td>
                        <td className="p-2 text-gray-500">{d.industryStd || "—"}</td>
                        <td className="p-2 text-gray-500">{d.companyTarget || "—"}</td>
                        <td className="p-2"><Badge variant="outline" className="text-[10px]">{d.source}</Badge></td>
                        <td className="p-2 text-gray-500">{d.frequency}</td>
                        <td className="p-2 text-xs">
                          <span className="text-yellow-600">黄{d.yellowThreshold ?? "—"}</span>{" "}
                          <span className="text-orange-600">橙{d.orangeThreshold ?? "—"}</span>{" "}
                          <span className="text-red-600">红{d.redThreshold ?? "—"}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
