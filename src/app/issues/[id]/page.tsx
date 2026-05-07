import { getAllIssues, getIssue, getCampus, getProject } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RiskBadge, StatusBadge } from "@/components/alert-badge";
import { AlertCircle, Target, Shield } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export function generateStaticParams() {
  return getAllIssues().map((i) => ({ id: i.id }));
}

export default async function IssueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const issue = getIssue(id);
  if (!issue) notFound();

  const campus = getCampus(issue.campusId);
  const project = issue.projectId ? getProject(issue.projectId) : null;
  const riskScore = issue.likelihood * issue.exposureObj * issue.exposureRange;

  return (
    <div>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-amber-50 flex items-center justify-center">
          <AlertCircle className="w-7 h-7 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">{issue.title}</h1>
            <RiskBadge level={issue.riskLevel} />
            <StatusBadge status={issue.status} />
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {campus && <Link href={`/campus/${campus.id}`} className="text-blue-600 hover:underline">{campus.name}</Link>}
            {" "}· {issue.category} · {issue.goal}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Target className="w-4 h-4" />问题信息</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <InfoRow label="问题描述" value={issue.description} />
            <InfoRow label="所属理念" value={issue.category} />
            <InfoRow label="管理目标" value={issue.goal} />
            <InfoRow label="问题性质" value={issue.nature} />
            <InfoRow label="创建时间" value={format(new Date(issue.createdAt), "yyyy-MM-dd HH:mm")} />
            {issue.closedAt && <InfoRow label="闭环时间" value={format(new Date(issue.closedAt), "yyyy-MM-dd HH:mm")} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2"><Shield className="w-4 h-4" />风险评估（L×E1×E2 + C）</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <RiskItem label="发生可能性(L)" value={issue.likelihood} max={3} />
              <RiskItem label="暴露对象(E1)" value={issue.exposureObj} max={3} />
              <RiskItem label="暴露范围(E2)" value={issue.exposureRange} max={3} />
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">底线后果(C)</p>
                <Badge variant="outline" className={issue.hasBottomLine ? "bg-red-50 text-red-700" : "bg-gray-50 text-gray-600"}>
                  {issue.hasBottomLine ? "是" : "否"}
                </Badge>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">综合得分</p>
              <p className="text-2xl font-bold">{riskScore}</p>
              <RiskBadge level={issue.riskLevel} />
            </div>
          </CardContent>
        </Card>
      </div>

      {(issue.solution || issue.verifyResult) && (
        <Card className="mb-6">
          <CardHeader className="pb-2"><CardTitle className="text-sm">整改与验证</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {issue.solution && <InfoRow label="整改方案" value={issue.solution} />}
            {issue.verifyResult && <InfoRow label="验证结果" value={issue.verifyResult} />}
          </CardContent>
        </Card>
      )}

      {project && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">关联改造项目</CardTitle></CardHeader>
          <CardContent>
            <Link href={`/projects/${project.id}`} className="text-blue-600 hover:underline font-medium">{project.name}</Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm text-gray-700">{value}</p>
    </div>
  );
}

function RiskItem({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="p-3 bg-gray-50 rounded-lg">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <div className="flex items-center gap-2">
        <span className="text-lg font-bold">{value}</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full">
          <div className={`h-full rounded-full ${pct > 66 ? "bg-red-500" : pct > 33 ? "bg-amber-500" : "bg-green-500"}`} style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}
