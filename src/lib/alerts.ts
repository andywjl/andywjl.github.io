export type AlertLevel = null | "黄色" | "橙色" | "红色";

interface AlertConfig {
  value: number;
  yellowThreshold: number | null;
  orangeThreshold: number | null;
  redThreshold: number | null;
  direction: "above" | "below";
}

export function checkAlert(config: AlertConfig): AlertLevel {
  const { value, yellowThreshold, orangeThreshold, redThreshold, direction } =
    config;
  const compare =
    direction === "above"
      ? (v: number, t: number) => v >= t
      : (v: number, t: number) => v <= t;

  if (redThreshold !== null && compare(value, redThreshold)) return "红色";
  if (orangeThreshold !== null && compare(value, orangeThreshold)) return "橙色";
  if (yellowThreshold !== null && compare(value, yellowThreshold)) return "黄色";
  return null;
}
