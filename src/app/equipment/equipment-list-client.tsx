"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/alert-badge";
import { Search, Wrench } from "lucide-react";
import { EQUIPMENT_CATEGORIES } from "@/lib/constants";

interface Equipment {
  id: string; name: string; category1: string; category2: string;
  location: string; brand: string | null; model: string | null;
  status: string; campusName: string; campusId: string;
  installDate: string; designLife: number;
}

export function EquipmentListClient({ equipment, campuses }: {
  equipment: Equipment[];
  campuses: { id: string; name: string }[];
}) {
  const [search, setSearch] = useState("");
  const [filterCampus, setFilterCampus] = useState("");
  const [filterCat, setFilterCat] = useState("");

  const filtered = useMemo(() => {
    return equipment.filter(e => {
      if (search && !e.name.toLowerCase().includes(search.toLowerCase()) && !e.location.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterCampus && e.campusId !== filterCampus) return false;
      if (filterCat && e.category1 !== filterCat) return false;
      return true;
    });
  }, [equipment, search, filterCampus, filterCat]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">设备台账</h1>
        <p className="text-sm text-gray-500 mt-1">共 {equipment.length} 台设备</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="搜索设备名称、位置..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="border rounded-lg px-3 py-2 text-sm bg-white" value={filterCampus} onChange={(e) => setFilterCampus(e.target.value)}>
          <option value="">全部园区</option>
          {campuses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select className="border rounded-lg px-3 py-2 text-sm bg-white" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">全部分类</option>
          {Object.keys(EQUIPMENT_CATEGORIES).map(k => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs">设备名称</th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs">园区</th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs">分类</th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs">位置</th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs">品牌</th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs">设计寿命</th>
                  <th className="text-left p-3 font-semibold text-gray-600 text-xs">状态</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="p-3">
                      <Link href={`/equipment/${e.id}`} className="text-blue-600 hover:underline font-medium flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5 text-gray-400" />
                        {e.name}
                      </Link>
                    </td>
                    <td className="p-3 text-gray-600">{e.campusName}</td>
                    <td className="p-3 text-gray-600">{e.category1} / {e.category2}</td>
                    <td className="p-3 text-gray-500">{e.location}</td>
                    <td className="p-3 text-gray-500">{e.brand || "—"}</td>
                    <td className="p-3 text-gray-500">{e.designLife}年</td>
                    <td className="p-3"><StatusBadge status={e.status} /></td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">暂无匹配设备</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
