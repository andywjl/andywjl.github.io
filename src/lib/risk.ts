export type RiskLevel = "低" | "中" | "高";

interface RiskInput {
  likelihood: 1 | 2 | 3;
  exposureObj: 1 | 2 | 3;
  exposureRange: 1 | 2 | 3;
  hasBottomLine: boolean;
}

export function calculateRiskLevel(input: RiskInput): RiskLevel {
  const baseScore =
    input.likelihood * input.exposureObj * input.exposureRange;

  let level: RiskLevel;
  if (baseScore <= 5) level = "低";
  else if (baseScore <= 17) level = "中";
  else level = "高";

  if (input.hasBottomLine && level !== "高") {
    level = level === "低" ? "中" : "高";
  }

  return level;
}
