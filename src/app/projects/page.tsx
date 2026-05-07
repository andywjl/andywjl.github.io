import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/alert-badge";
import { FolderKanban, Target, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    include: { campus: { select: { name: true } }, _count: { select: { issues: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">改造项目</h1>
        <p className="text-sm text-gray-500 mt-1">共 {projects.length} 个项目</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(p => (
          <Link key={p.id} href={`/projects/${p.id}`}>
            <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                      <FolderKanban className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm text-gray-900">{p.name}</h3>
                      <p className="text-xs text-gray-500">{p.campus.name}</p>
                    </div>
                  </div>
                  <StatusBadge status={p.status} />
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                  <span className="flex items-center gap-1"><Target className="w-3 h-3" />{p.goal}</span>
                  <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />{p.budget}万</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{p.duration}</span>
                </div>

                <p className="text-xs text-gray-600 mb-2">预期效果: {p.expectedEffect}</p>
                {p.actualEffect && <p className="text-xs text-green-700 bg-green-50 p-2 rounded">实际效果: {p.actualEffect}</p>}

                <div className="flex items-center justify-between mt-3 text-xs text-gray-400">
                  <span>关联 {p._count.issues} 个问题</span>
                  {p.replicable && <Badge variant="outline" className="text-[10px] bg-blue-50 text-blue-600">可复制</Badge>}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
