"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format } from "date-fns";

interface MetricTrendProps {
  campusId?: string;
  metricId?: string;
}

interface Record {
  value: number;
  recordedAt: string;
  alertLevel: string | null;
  campus: { name: string };
  metric: { name: string; unit: string };
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export function MetricTrend({ campusId, metricId }: MetricTrendProps) {
  const [data, setData] = useState<Record[]>([]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (campusId) params.set("campusId", campusId);
    if (metricId) params.set("metricId", metricId);
    fetch(`/api/metrics/records?${params}`)
      .then((r) => r.json())
      .then(setData);
  }, [campusId, metricId]);

  if (!data.length) return <div className="animate-pulse h-48 bg-muted rounded-lg" />;

  const grouped: { [dateKey: string]: { [key: string]: number | string }[] } = {};
  const campusSet = new Set<string>();

  for (const r of data) {
    const dateKey = format(new Date(r.recordedAt), "yyyy-MM");
    if (!grouped[dateKey]) grouped[dateKey] = [];
    campusSet.add(r.campus.name);

    let entry = grouped[dateKey].find((e) => e.date === dateKey);
    if (!entry) {
      entry = { date: dateKey };
      grouped[dateKey].push(entry);
    }
    entry[r.campus.name] = r.value;
  }

  const chartData = Object.values(grouped)
    .flat()
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const campuses = Array.from(campusSet);

  return (
    <ResponsiveContainer width="100%" height={240}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="date" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {campuses.map((c, i) => (
          <Line key={c} type="monotone" dataKey={c} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 3 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
