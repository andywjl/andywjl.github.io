"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RiskBadge, StatusBadge } from "@/components/alert-badge";
import { TIER_COLORS } from "@/lib/constants";
import { Building2, MapPin, Calendar, Users, Target, Wrench, AlertCircle, FolderKanban } from "lucide-react";
import Link from "next/link";

interface Props {
  campus: {
    id: string; name: string; city: string; deliveryDate: string;
    propertyType: string; totalArea: number; workstations: number;
    ifmVendor: string; ifmSwitchDate: string | null; managementTier: string;
    businessLines: string[]; topGoals: string[]; age: number;
  };
  counts: { issues: number; equipments: number; projects: number; metrics: number };
  issuesByGoal: Record<string, number>;
  issuesByStatus: Record<string, number>;
  equipByStatus: Record<string, number>;
  issues: { id: string; title: string; goal: string; riskLevel: string; status: string; category: string }[];
  equipment: { id: string; name: string; category1: string; category2: string; status: string; location: string; brand: string | null }[];
  projects: { id: string; name: string; goal: string; status: string; budget: number; duration: string }[];
}

export function CampusDetailClient({ campus, counts, issuesByGoal, issuesByStatus, equipByStatus, issues, equipment, projects }: Props) {
  const tierClass = TIER_COLORS[campus.managementTier] || "bg-gray-100 text-gray-700";

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
            <Building2 className="w-7 h-7 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{campus.name}</h1>
              <Badge variant="outline" className={tierClass}>{campus.managementTier}</Badge>
            </div>
            <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5" /> {campus.city} · {campus.ifmVendor} · {campus.propertyType}
            </p>
          </div>
        </div>
      </div>

      {/* Info grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-6">
        <InfoCard icon={Building2} label="面积" value={`${campus.totalArea}万㎡`} />
        <InfoCard icon={Users} label="工位" value={campus.workstations.toLocaleString()} />
        <InfoCard icon={Calendar} label="楼龄" value={`${campus.age}年`} />
        <InfoCard icon={AlertCircle} label="问题数" value={String(counts.issues)} />
        <InfoCard icon={Wrench} label="设备数" value={String(counts.equipments)} />
        <InfoCard icon={FolderKanban} label="项目数" value={String(counts.projects)} />
      </div>

      {/* Top Goals */}
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            Top5 管理目标
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {campus.topGoals.map((g, i) => (
              <Badge key={g} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {i + 1}. {g}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="issues">
        <TabsList>
          <TabsTrigger value="issues">问题列表 ({counts.issues})</TabsTrigger>
          <TabsTrigger value="equipment">设备概览 ({counts.equipments})</TabsTrigger>
          <TabsTrigger value="projects">改造项目 ({counts.projects})</TabsTrigger>
        </TabsList>

        <TabsContent value="issues">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">问题</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">目标</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">理念</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">风险</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {issues.map((issue) => (
                      <tr key={issue.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <Link href={`/issues/${issue.id}`} className="text-blue-600 hover:underline font-medium">
                            {issue.title}
                          </Link>
                        </td>
                        <td className="p-3 text-gray-600">{issue.goal}</td>
                        <td className="p-3 text-gray-500">{issue.category}</td>
                        <td className="p-3"><RiskBadge level={issue.riskLevel} /></td>
                        <td className="p-3"><StatusBadge status={issue.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="equipment">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">设备名称</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">分类</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">位置</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">品牌</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {equipment.map((eq) => (
                      <tr key={eq.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <Link href={`/equipment/${eq.id}`} className="text-blue-600 hover:underline font-medium">
                            {eq.name}
                          </Link>
                        </td>
                        <td className="p-3 text-gray-600">{eq.category1} / {eq.category2}</td>
                        <td className="p-3 text-gray-500">{eq.location}</td>
                        <td className="p-3 text-gray-500">{eq.brand || "—"}</td>
                        <td className="p-3"><StatusBadge status={eq.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">项目名称</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">目标</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">预算(万)</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">工期</th>
                      <th className="text-left p-3 font-semibold text-gray-600 text-xs">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <Link href={`/projects/${p.id}`} className="text-blue-600 hover:underline font-medium">
                            {p.name}
                          </Link>
                        </td>
                        <td className="p-3 text-gray-600">{p.goal}</td>
                        <td className="p-3 text-gray-600">{p.budget}</td>
                        <td className="p-3 text-gray-500">{p.duration}</td>
                        <td className="p-3"><StatusBadge status={p.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg text-center">
      <Icon className="w-4 h-4 text-gray-400 mx-auto mb-1" />
      <p className="text-lg font-bold text-gray-900">{value}</p>
      <p className="text-[10px] text-gray-500">{label}</p>
    </div>
  );
}
