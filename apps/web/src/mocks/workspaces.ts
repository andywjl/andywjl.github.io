export type MockWorkspace = {
  name: string;
  lat: number;
  lng: number;
};

export const mockWorkspaces: MockWorkspace[] = [
  { name: "Beijing HQ", lat: 39.9042, lng: 116.4074 },
  { name: "Singapore Hub", lat: 1.3521, lng: 103.8198 },
  { name: "London Office", lat: 51.5072, lng: -0.1276 },
  { name: "San Francisco Lab", lat: 37.7749, lng: -122.4194 },
  { name: "Dubai Branch", lat: 25.2048, lng: 55.2708 },
];
