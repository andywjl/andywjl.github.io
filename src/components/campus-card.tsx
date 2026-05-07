"use client";

import Link from "next/link";
import { Building2, AlertTriangle, Wrench, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TIER_COLORS } from "@/lib/constants";

interface CampusCardProps {
  id: string;
  name: string;
  city: string;
  totalArea: number;
  workstations: number;
  managementTier: string;
  ifmVendor: string;
  issueCount: number;
  equipWarningCount: number;
  alertCount: number;
}

export function CampusCard({
  id, name, city, totalArea, workstations, managementTier,
  ifmVendor, issueCount, equipWarningCount, alertCount,
}: CampusCardProps) {
  const tierClass = TIER_COLORS[managementTier] || "bg-gray-100 text-gray-700";

  return (
    <Link href={`/campus/${id}`}>
      <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">{name}</h3>
                <p className="text-xs text-muted-foreground">{city} · {ifmVendor}</p>
              </div>
            </div>
            <Badge variant="outline" className={tierClass}>{managementTier}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="text-center p-2 bg-muted/50 rounded-md">
              <p className="text-lg font-bold">{totalArea}</p>
              <p className="text-[10px] text-muted-foreground">面积(万㎡)</p>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-md">
              <p className="text-lg font-bold">{workstations.toLocaleString()}</p>
              <p className="text-[10px] text-muted-foreground">工位数</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500" />
              {issueCount} 问题
            </span>
            <span className="flex items-center gap-1">
              <Wrench className="w-3 h-3 text-orange-500" />
              {equipWarningCount} 预警
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-red-500" />
              {alertCount} 告警
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
