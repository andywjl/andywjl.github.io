import { getAllEquipment, getEquipment, getEquipmentMaintenances, getEquipmentFaults, getCampus } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/alert-badge";
import { Wrench, MapPin, Calendar, Clock, Building2 } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export function generateStaticParams() {
  return getAllEquipment().map((e) => ({ id: e.id }));
}

export default async function EquipmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const eq = getEquipment(id);
  if (!eq) notFound();

  const campus = getCampus(eq.campusId);
  const maintenances = getEquipmentMaintenances(id);
  const faults = getEquipmentFaults(id);

  const age = new Date().getFullYear() - new Date(eq.installDate).getFullYear();
  const lifePercent = Math.min(100, Math.round((age / eq.designLife) * 100));
  const parsedParams = eq.params ? JSON.parse(eq.params) : {};

  return (
    <div>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center">
          <Wrench className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{eq.name}</h1>
            <StatusBadge status={eq.status} />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {eq.category1} / {eq.category2} ·{" "}
            {campus && <Link href={`/campus/${campus.id}`} className="text-blue-600 hover:underline">{campus.name}</Link>}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm"><MapPin className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{eq.location}</span></div>
            <div className="flex items-center gap-2 text-sm"><Building2 className="w-4 h-4 text-gray-400" /><span className="text-gray-600">{eq.brand || "—"} {eq.model || ""}</span></div>
            <div className="flex items-center gap-2 text-sm"><Calendar className="w-4 h-4 text-gray-400" /><span className="text-gray-600">安装: {format(new Date(eq.installDate), "yyyy-MM-dd")}</span></div>
            <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4 text-gray-400" /><span className="text-gray-600">已使用 {age} 年 / 设计寿命 {eq.designLife} 年</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">生命周期</CardTitle></CardHeader>
          <CardContent>
            <div className="mb-2 text-center text-2xl font-bold text-gray-900">{lifePercent}%</div>
            <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${lifePercent >= 80 ? "bg-red-500" : lifePercent >= 60 ? "bg-amber-500" : "bg-green-500"}`}
                style={{ width: `${lifePercent}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {lifePercent >= 80 ? "接近设计寿命" : lifePercent >= 60 ? "中期使用阶段" : "运行良好"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">关键参数</CardTitle></CardHeader>
          <CardContent>
            {Object.keys(parsedParams).length > 0 ? (
              <div className="space-y-2">
                {Object.entries(parsedParams).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-500">{k}</span>
                    <span className="font-medium text-gray-900">{String(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 text-center py-4">暂无参数</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">维保与故障记录</CardTitle></CardHeader>
        <CardContent>
          {maintenances.length === 0 && faults.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">暂无维保或故障记录</p>
          ) : (
            <div className="relative pl-6 border-l-2 border-gray-200 space-y-4">
              {[...maintenances.map(m => ({ kind: "maintenance" as const, date: m.date, id: m.id, description: m.description, mainType: m.type })),
                ...faults.map(f => ({ kind: "fault" as const, date: f.occurredAt, id: f.id, description: f.description, mainType: f.severity }))]
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((item) => (
                  <div key={item.id} className="relative">
                    <div className={`absolute -left-[25px] w-3 h-3 rounded-full border-2 ${item.kind === "fault" ? "bg-red-100 border-red-500" : "bg-blue-100 border-blue-500"}`} />
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className={item.kind === "fault" ? "bg-red-50 text-red-700" : "bg-blue-50 text-blue-700"}>
                          {item.kind === "fault" ? "故障" : item.mainType || "维保"}
                        </Badge>
                        <span className="text-xs text-gray-500">{format(new Date(item.date), "yyyy-MM-dd")}</span>
                      </div>
                      <p className="text-sm text-gray-700">{item.description}</p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
