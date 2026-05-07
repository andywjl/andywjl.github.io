"use client";

import { CampusCard } from "@/components/campus-card";
import { Heatmap } from "@/components/heatmap";
import { AlertBadge } from "@/components/alert-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, AlertTriangle, Wrench, FolderKanban } from "lucide-react";
import { format } from "date-fns";

interface DashboardProps {
  campusCards: {
    id: string; name: string; city: string; totalArea: number;
    workstations: number; managementTier: string; ifmVendor: string;
    issueCount: number; equipWarningCount: number; alertCount: number;
  }[];
  recentAlerts: {
    id: string; campusName: string; metricName: string;
    value: number; unit: string; alertLevel: string; recordedAt: string;
  }[];
  stats: { campuses: number; issues: number; equipment: number; projects: number };
}

export function DashboardClient({ campusCards, recentAlerts, stats }: DashboardProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">数据总览</h1>
        <p className="text-sm text-gray-500 mt-1">楼宇档案核心指标概览</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Building2} label="园区总数" value={stats.campuses} color="blue" />
        <StatCard icon={AlertTriangle} label="问题总数" value={stats.issues} color="amber" />
        <StatCard icon={Wrench} label="设备总数" value={stats.equipment} color="green" />
        <StatCard icon={FolderKanban} label="改造项目" value={stats.projects} color="purple" />
      </div>

      {/* Campus cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {campusCards.map((c) => (
          <CampusCard key={c.id} {...c} />
        ))}
      </div>

      {/* Heatmap + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">问题热力图（园区 × 目标）</CardTitle>
          </CardHeader>
          <CardContent>
            <Heatmap />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">最近预警记录</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {recentAlerts.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg text-xs">
                  <div className="flex-1 min-w-0">
                    <span className="font-semibold text-gray-900">{a.campusName}</span>
                    <span className="text-gray-400 mx-1">·</span>
                    <span className="text-gray-600">{a.metricName}</span>
                    <span className="text-gray-400 ml-2">{a.value}{a.unit}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <AlertBadge level={a.alertLevel} />
                    <span className="text-[10px] text-gray-400">
                      {format(new Date(a.recordedAt), "MM-dd")}
                    </span>
                  </div>
                </div>
              ))}
              {!recentAlerts.length && (
                <p className="text-center text-gray-400 py-8">暂无预警记录</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType; label: string; value: number; color: string;
}) {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };

  return (
    <Card>
      <CardContent className="p-4 flex items-center gap-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colorMap[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
