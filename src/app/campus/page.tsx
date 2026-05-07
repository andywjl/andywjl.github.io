import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, MapPin, Users, Calendar } from "lucide-react";
import { TIER_COLORS } from "@/lib/constants";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function CampusListPage() {
  const campuses = await prisma.campus.findMany({
    include: {
      _count: { select: { issues: true, equipments: true, projects: true } },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">园区档案</h1>
        <p className="text-sm text-gray-500 mt-1">共 {campuses.length} 个自持园区</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {campuses.map((c) => {
          const tierClass = TIER_COLORS[c.managementTier] || "bg-gray-100 text-gray-700";
          const age = new Date().getFullYear() - new Date(c.deliveryDate).getFullYear();
          return (
            <Link key={c.id} href={`/campus/${c.id}`}>
              <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-gray-900">{c.name}</h2>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3" />
                          {c.city} · {c.ifmVendor}
                        </div>
                      </div>
                    </div>
                    <Badge variant="outline" className={tierClass}>{c.managementTier}</Badge>
                  </div>

                  <div className="grid grid-cols-4 gap-3 mb-4">
                    <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{c.totalArea}</p>
                      <p className="text-[10px] text-gray-500">面积(万㎡)</p>
                    </div>
                    <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{c.workstations.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-500">工位数</p>
                    </div>
                    <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{age}</p>
                      <p className="text-[10px] text-gray-500">楼龄(年)</p>
                    </div>
                    <div className="text-center p-2.5 bg-gray-50 rounded-lg">
                      <p className="text-lg font-bold text-gray-900">{c._count.equipments}</p>
                      <p className="text-[10px] text-gray-500">设备数</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <span>{c._count.issues} 个问题</span>
                      <span>{c._count.projects} 个项目</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      交付: {format(new Date(c.deliveryDate), "yyyy-MM")}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
