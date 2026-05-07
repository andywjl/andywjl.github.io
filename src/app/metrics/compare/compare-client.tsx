"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MetricTrend } from "@/components/metric-trend";
import { BarChart3 } from "lucide-react";

interface CompareProps {
  campuses: { id: string; name: string }[];
  definitions: { id: string; name: string; goal: string; unit: string | null }[];
}

export function CompareClient({ campuses, definitions }: CompareProps) {
  const [selectedCampuses, setSelectedCampuses] = useState<string[]>([]);
  const [selectedMetric, setSelectedMetric] = useState("");

  const toggleCampus = (id: string) => {
    setSelectedCampuses(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">横向对比</h1>
        <p className="text-sm text-gray-500 mt-1">选择园区和指标进行对比分析</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">选择园区</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {campuses.map(c => (
                <Button
                  key={c.id}
                  variant={selectedCampuses.includes(c.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleCampus(c.id)}
                >
                  {c.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm">选择指标</CardTitle></CardHeader>
          <CardContent>
            <select
              className="w-full border rounded-lg px-3 py-2 text-sm bg-white"
              value={selectedMetric}
              onChange={e => setSelectedMetric(e.target.value)}
            >
              <option value="">请选择指标</option>
              {definitions.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.goal})</option>
              ))}
            </select>
          </CardContent>
        </Card>
      </div>

      {selectedCampuses.length > 0 && selectedMetric && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              趋势对比
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MetricTrend metricId={selectedMetric} />
          </CardContent>
        </Card>
      )}

      {(!selectedCampuses.length || !selectedMetric) && (
        <div className="text-center text-gray-400 py-16">
          <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-40" />
          <p>请选择至少一个园区和一个指标开始对比</p>
        </div>
      )}
    </div>
  );
}
