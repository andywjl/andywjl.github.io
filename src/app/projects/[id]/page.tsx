import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, RiskBadge } from "@/components/alert-badge";
import { FolderKanban, Target, Calendar, DollarSign, Building2, Clock, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { campus: true, issues: { orderBy: { createdAt: "desc" } } },
  });

  if (!project) notFound();

  return (
    <div>
      <div className="flex items-start gap-4 mb-6">
        <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center">
          <FolderKanban className="w-7 h-7 text-purple-600" />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
            <StatusBadge status={project.status} />
            {project.replicable && <Badge variant="outline" className="bg-blue-50 text-blue-600">可复制</Badge>}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            <Link href={`/campus/${project.campus.id}`} className="text-blue-600 hover:underline">{project.campus.name}</Link>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <InfoCard icon={Target} label="管理目标" value={project.goal} />
        <InfoCard icon={DollarSign} label="预算" value={`${project.budget}万元`} />
        <InfoCard icon={Clock} label="工期" value={project.duration} />
        <InfoCard icon={Calendar} label="开始日期" value={project.startDate ? format(new Date(project.startDate), "yyyy-MM-dd") : "未开始"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">预期效果</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{project.expectedEffect}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />实际效果
          </CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{project.actualEffect || "待验证"}</p>
          </CardContent>
        </Card>
      </div>

      {project.issues.length > 0 && (
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">关联问题 ({project.issues.length})</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3 text-xs font-semibold text-gray-600">问题</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-600">目标</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-600">风险</th>
                    <th className="text-left p-3 text-xs font-semibold text-gray-600">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {project.issues.map(i => (
                    <tr key={i.id} className="border-t border-gray-100 hover:bg-gray-50">
                      <td className="p-3"><Link href={`/issues/${i.id}`} className="text-blue-600 hover:underline">{i.title}</Link></td>
                      <td className="p-3 text-gray-600">{i.goal}</td>
                      <td className="p-3"><RiskBadge level={i.riskLevel} /></td>
                      <td className="p-3"><StatusBadge status={i.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="p-3 bg-white border border-gray-200 rounded-lg">
      <Icon className="w-4 h-4 text-gray-400 mb-1" />
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-900">{value}</p>
    </div>
  );
}
