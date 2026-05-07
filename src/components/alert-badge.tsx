"use client";

import { Badge } from "@/components/ui/badge";

const ALERT_STYLES: Record<string, string> = {
  红色: "bg-red-100 text-red-700 border-red-200",
  橙色: "bg-orange-100 text-orange-700 border-orange-200",
  黄色: "bg-yellow-100 text-yellow-700 border-yellow-200",
};

const RISK_STYLES: Record<string, string> = {
  高: "bg-red-100 text-red-700 border-red-200",
  中: "bg-amber-100 text-amber-700 border-amber-200",
  低: "bg-green-100 text-green-700 border-green-200",
};

export function AlertBadge({ level }: { level: string | null }) {
  if (!level) return null;
  return (
    <Badge variant="outline" className={ALERT_STYLES[level] || ""}>
      {level}预警
    </Badge>
  );
}

export function RiskBadge({ level }: { level: string }) {
  return (
    <Badge variant="outline" className={RISK_STYLES[level] || ""}>
      {level}风险
    </Badge>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    待确认: "bg-gray-100 text-gray-700",
    已确认: "bg-blue-100 text-blue-700",
    整改中: "bg-amber-100 text-amber-700",
    已闭环: "bg-green-100 text-green-700",
    持续监控: "bg-purple-100 text-purple-700",
    正常: "bg-green-100 text-green-700",
    预警: "bg-amber-100 text-amber-700",
    故障: "bg-red-100 text-red-700",
    维修中: "bg-orange-100 text-orange-700",
    已报废: "bg-gray-100 text-gray-500",
    立项: "bg-gray-100 text-gray-700",
    审批中: "bg-blue-100 text-blue-700",
    实施中: "bg-amber-100 text-amber-700",
    验收中: "bg-purple-100 text-purple-700",
    已完成: "bg-green-100 text-green-700",
  };
  return (
    <Badge variant="outline" className={styles[status] || ""}>
      {status}
    </Badge>
  );
}
