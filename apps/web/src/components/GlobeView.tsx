import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import type { WorkspaceListItem } from "@/api/workspaces-api";
import { globeStoreActions, useGlobeStore } from "@/store/globe-store";

type CountryFeature = {
  properties?: Record<string, unknown>;
};

type GlobeViewProps = {
  workspaces: WorkspaceListItem[];
  isLoading?: boolean;
  error?: string;
};

type GlobeController = {
  pointOfView: (
    view: { lat: number; lng: number; altitude: number },
    transitionMs?: number,
  ) => void;
};

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

export function GlobeView({ workspaces, isLoading, error }: GlobeViewProps) {
  const globeRef = useRef<GlobeController | null>(null);
  const selectedCountry = useGlobeStore((state) => state.selectedCountry);
  const flyToTarget = useGlobeStore((state) => state.flyToTarget);
  const [countries, setCountries] = useState<CountryFeature[]>([]);
  const [geoLoading, setGeoLoading] = useState(true);
  const [geoError, setGeoError] = useState<string>();

  useEffect(() => {
    let mounted = true;
    setGeoLoading(true);
    setGeoError(undefined);

    fetch("/geo/countries.geo.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`countries.geo.json load failed: ${response.status}`);
        }
        return response.json() as Promise<{
          features?: CountryFeature[];
        }>;
      })
      .then((geo) => {
        if (!mounted) return;
        setCountries(geo.features ?? []);
      })
      .catch((err: unknown) => {
        if (!mounted) return;
        setGeoError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!mounted) return;
        setGeoLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!flyToTarget || !globeRef.current) return;
    globeRef.current.pointOfView(
      {
        lat: flyToTarget.lat,
        lng: flyToTarget.lng,
        altitude: flyToTarget.altitude,
      },
      900,
    );
  }, [flyToTarget]);

  const subtitle = useMemo(() => {
    if (isLoading || geoLoading) return "正在加载工区点位与国家边界...";
    if (error || geoError) return `加载失败: ${error ?? geoError}`;
    return `已加载 ${workspaces.length} 个工区点位`;
  }, [error, geoError, geoLoading, isLoading, workspaces.length]);

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
          // @ts-expect-error react-globe.gl exposes imperative methods via ref
          ref={globeRef}
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
