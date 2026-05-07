"use client";

import { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";
import { getAllMetricRecords, getCampuses, getAllMetricDefinitions } from "@/lib/data";

interface MetricTrendProps {
  campusId?: string;
  metricId?: string;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export function MetricTrend({ campusId, metricId }: MetricTrendProps) {
  const chartData = useMemo(() => {
    let records = getAllMetricRecords();
    const campuses = getCampuses();

    if (campusId) records = records.filter(r => r.campusId === campusId);
    if (metricId) records = records.filter(r => r.metricId === metricId);

    if (!records.length) return { data: [], campusNames: [] };

    const grouped: { [dateKey: string]: { [key: string]: number | string } } = {};
    const campusSet = new Set<string>();

    for (const r of records) {
      const dateKey = format(new Date(r.recordedAt), "yyyy-MM");
      const campusName = campuses.find(c => c.id === r.campusId)?.name || r.campusId;
      campusSet.add(campusName);

      if (!grouped[dateKey]) grouped[dateKey] = { date: dateKey };
      grouped[dateKey][campusName] = r.value;
    }

    const data = Object.values(grouped).sort((a, b) => String(a.date).localeCompare(String(b.date)));
    return { data, campusNames: Array.from(campusSet) };
  }, [campusId, metricId]);

  if (!chartData.data.length) return <div className="text-center text-gray-400 py-8">暂无数据</div>;

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData.data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {chartData.campusNames.map((c, i) => (
          <Line key={c} type="monotone" dataKey={c} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
