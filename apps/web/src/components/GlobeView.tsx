import { useEffect, useMemo, useState } from "react";
import Globe from "react-globe.gl";
import {
  getWorkspaces,
  type WorkspaceListItem,
} from "@/api/workspaces-api";
import { globeStoreActions, useGlobeStore } from "@/store/globe-store";

type CountryFeature = {
  properties?: Record<string, unknown>;
};

const PAGE_SIZE = 100;

function resolveCountryCode(feature: CountryFeature): string | undefined {
  const props = feature.properties ?? {};
  const candidate =
    props.ADM0_A3 ??
    props.ISO_A3 ??
    props.SOV_A3 ??
    props.GU_A3 ??
    props.ISO3;

  if (typeof candidate !== "string") return undefined;
  const normalized = candidate.toUpperCase();
  if (!/^[A-Z]{3}$/.test(normalized)) return undefined;
  return normalized;
}

async function fetchAllWorkspaces(): Promise<WorkspaceListItem[]> {
  const all: WorkspaceListItem[] = [];
  let page = 1;
  let total = Number.POSITIVE_INFINITY;

  while (all.length < total) {
    const response = await getWorkspaces({
      page,
      pageSize: PAGE_SIZE,
    });
    total = response.total;
    all.push(...response.items);
    if (response.items.length === 0) break;
    page += 1;
  }

  return all.slice(0, Number.isFinite(total) ? total : all.length);
}

export function GlobeView() {
  const selectedCountry = useGlobeStore((state) => state.selectedCountry);
  const [workspaces, setWorkspaces] = useState<WorkspaceListItem[]>([]);
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError(undefined);

    Promise.all([
      fetch("/geo/countries.geo.json").then((response) => {
        if (!response.ok) {
          throw new Error(`countries.geo.json load failed: ${response.status}`);
        }
        return response.json() as Promise<{
          features?: CountryFeature[];
        }>;
      }),
      fetchAllWorkspaces(),
    ])
      .then(([geo, workspaceItems]) => {
        if (!mounted) return;
        setCountries(geo.features ?? []);
        setWorkspaces(workspaceItems);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!mounted) return;
        setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const subtitle = useMemo(() => {
    if (isLoading) return "正在加载工区点位与国家边界...";
    if (error) return `加载失败: ${error}`;
    return `已加载 ${workspaces.length} 个工区点位`;
  }, [error, isLoading, workspaces.length]);

  return (
    <section className="flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="text-2xl font-semibold">GlobeView</h2>
        <p className="text-slate-300 text-sm">{subtitle}</p>
        <p className="text-slate-400 text-xs mt-1">
          当前选中国家: {selectedCountry ?? "未选择"}
        </p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950/40 p-3 shadow-2xl">
        <Globe
          width={820}
          height={520}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          polygonsData={countries}
          polygonCapColor={(feature) => {
            const code = resolveCountryCode(feature as CountryFeature);
            return code && code === selectedCountry
              ? "rgba(59,130,246,0.55)"
              : "rgba(148,163,184,0.25)";
          }}
          polygonSideColor={() => "rgba(30,41,59,0.15)"}
          polygonStrokeColor={() => "rgba(148,163,184,0.5)"}
          polygonAltitude={(feature) => {
            const code = resolveCountryCode(feature as CountryFeature);
            return code && code === selectedCountry ? 0.015 : 0.005;
          }}
          onPolygonClick={(feature) => {
            const code = resolveCountryCode(feature as CountryFeature);
            if (code) globeStoreActions.setCountry(code);
          }}
          pointsData={workspaces}
          pointLat="lat"
          pointLng="lng"
          pointAltitude={0.02}
          pointRadius={0.4}
          pointColor={() => "#ef4444"}
        />
      </div>

      <ul className="grid gap-2 text-sm text-slate-200 sm:grid-cols-2">
        {workspaces.slice(0, 6).map((workspace) => (
          <li
            key={workspace.id}
            className="rounded-md border border-slate-700 bg-slate-800/40 px-3 py-2"
          >
            <span className="font-medium">{workspace.name}</span>
            <span className="ml-2 text-slate-300">
              ({workspace.lat}, {workspace.lng})
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
