import { useEffect, useMemo, useState } from "react";
import { mockWorkspaces } from "@/mocks/workspaces";

type ProjectedPoint = {
  id: string;
  name: string;
  city: string;
  country: string;
  x: number;
  y: number;
  z: number;
};

const GLOBE_RADIUS = 220;

function projectPoint(lat: number, lng: number, rotationDeg: number) {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = ((lng + rotationDeg) * Math.PI) / 180;
  const x = Math.cos(latRad) * Math.sin(lngRad);
  const y = Math.sin(latRad);
  const z = Math.cos(latRad) * Math.cos(lngRad);
  return { x, y, z };
}

export function GlobeView() {
  const [rotationDeg, setRotationDeg] = useState(0);

  useEffect(() => {
    let frameId = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const deltaMs = now - last;
      last = now;
      setRotationDeg((prev) => (prev + deltaMs * 0.008) % 360);
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const projected = useMemo<ProjectedPoint[]>(() => {
    return mockWorkspaces
      .map((workspace) => {
        const p = projectPoint(workspace.lat, workspace.lng, rotationDeg);
        return {
          id: workspace.id,
          name: workspace.name,
          city: workspace.city,
          country: workspace.country,
          x: p.x,
          y: p.y,
          z: p.z,
        };
      })
      .sort((a, b) => a.z - b.z);
  }, [rotationDeg]);

  return (
    <section className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">GlobeView (M1-F Stub)</h2>
        <p className="text-slate-300 text-sm">
          使用硬编码 5 个工区点位进行地球预览
        </p>
      </div>

      <div
        className="relative overflow-hidden rounded-full border border-slate-500/70 shadow-2xl"
        style={{
          width: `${GLOBE_RADIUS * 2}px`,
          height: `${GLOBE_RADIUS * 2}px`,
          background:
            "radial-gradient(circle at 30% 28%, #1e3a8a 0%, #0f172a 45%, #020617 100%)",
        }}
      >
        <div className="absolute inset-[8%] rounded-full border border-sky-300/30" />
        <div className="absolute inset-[22%] rounded-full border border-sky-300/25" />
        <div className="absolute inset-0">
          {projected.map((point) => {
            const isVisible = point.z > 0;
            const x = point.x * GLOBE_RADIUS * 0.88 + GLOBE_RADIUS;
            const y = -point.y * GLOBE_RADIUS * 0.88 + GLOBE_RADIUS;
            const size = isVisible ? 8 + point.z * 5 : 5;
            return (
              <button
                key={point.id}
                type="button"
                title={`${point.name} · ${point.city}, ${point.country}`}
                className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: isVisible
                    ? "rgba(251, 191, 36, 0.95)"
                    : "rgba(148, 163, 184, 0.45)",
                  boxShadow: isVisible
                    ? "0 0 10px rgba(251, 191, 36, 0.9)"
                    : "none",
                }}
              />
            );
          })}
        </div>
      </div>

      <ul className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
        {mockWorkspaces.map((workspace) => (
          <li
            key={workspace.id}
            className="rounded-md border border-slate-700 bg-slate-800/40 px-3 py-2"
          >
            <span className="font-medium">{workspace.name}</span>
            <span className="ml-2 text-slate-300">
              {workspace.city}, {workspace.country}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
