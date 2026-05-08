export type MockWorkspace = {
  id: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
};

export const mockWorkspaces: MockWorkspace[] = [
  {
    id: "ws-bj",
    name: "Beijing HQ",
    city: "Beijing",
    country: "China",
    lat: 39.9042,
    lng: 116.4074,
  },
  {
    id: "ws-sg",
    name: "Singapore Hub",
    city: "Singapore",
    country: "Singapore",
    lat: 1.3521,
    lng: 103.8198,
  },
  {
    id: "ws-ldn",
    name: "London Office",
    city: "London",
    country: "United Kingdom",
    lat: 51.5072,
    lng: -0.1276,
  },
  {
    id: "ws-sfo",
    name: "San Francisco Lab",
    city: "San Francisco",
    country: "United States",
    lat: 37.7749,
    lng: -122.4194,
  },
  {
    id: "ws-dub",
    name: "Dubai Branch",
    city: "Dubai",
    country: "United Arab Emirates",
    lat: 25.2048,
    lng: 55.2708,
  },
];
