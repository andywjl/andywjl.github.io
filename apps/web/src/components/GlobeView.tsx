import Globe from "react-globe.gl";
import { mockWorkspaces } from "@/mocks/workspaces";

export function GlobeView() {
  return (
    <section className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">GlobeView (M1-F Stub)</h2>
        <p className="text-slate-300 text-sm">
          使用硬编码 5 个工区点位进行地球预览
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950/40 p-3 shadow-2xl">
        <Globe
          width={820}
          height={520}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          pointsData={mockWorkspaces}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.02}
          pointRadius={0.4}
          pointColor={() => "#ef4444"}
        />
      </div>

      <ul className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
        {mockWorkspaces.map((workspace) => (
          <li key={workspace.name} className="rounded-md border border-slate-700 bg-slate-800/40 px-3 py-2">
            <span className="font-medium">{workspace.name}</span>
            <span className="ml-2 text-slate-300">({workspace.lat}, {workspace.lng})</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
