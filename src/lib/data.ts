import rawData from "@/data/db.json";

// Type definitions matching the Prisma schema
export interface Campus {
  id: string;
  name: string;
  city: string;
  deliveryDate: string;
  propertyType: string;
  totalArea: number;
  workstations: number;
  ifmVendor: string;
  ifmSwitchDate: string | null;
  managementTier: string;
  businessLines: string; // JSON string
  topGoals: string; // JSON string
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  campusId: string;
  name: string;
  category1: string;
  category2: string;
  location: string;
  brand: string | null;
  model: string | null;
  installDate: string;
  designLife: number;
  status: string;
  params: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Maintenance {
  id: string;
  equipmentId: string;
  type: string;
  date: string;
  description: string;
  cost: number | null;
  vendor: string | null;
  nextDate: string | null;
  createdAt: string;
}

export interface Fault {
  id: string;
  equipmentId: string;
  occurredAt: string;
  description: string;
  severity: string;
  resolvedAt: string | null;
  resolution: string | null;
  downtime: number | null;
  createdAt: string;
}

export interface Issue {
  id: string;
  campusId: string;
  title: string;
  description: string;
  category: string;
  goal: string;
  nature: string;
  likelihood: number;
  exposureObj: number;
  exposureRange: number;
  hasBottomLine: boolean;
  riskLevel: string;
  status: string;
  solution: string | null;
  verifyResult: string | null;
  closedAt: string | null;
  projectId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MetricDefinition {
  id: string;
  name: string;
  goal: string;
  formula: string | null;
  unit: string | null;
  industryStd: string | null;
  companyTarget: string | null;
  source: string;
  frequency: string;
  yellowThreshold: number | null;
  orangeThreshold: number | null;
  redThreshold: number | null;
  thresholdDir: string;
  createdAt: string;
}

export interface MetricRecord {
  id: string;
  metricId: string;
  campusId: string;
  value: number;
  recordedAt: string;
  alertLevel: string | null;
  createdAt: string;
}

export interface Project {
  id: string;
  campusId: string;
  name: string;
  goal: string;
  budget: number;
  duration: string;
  status: string;
  expectedEffect: string;
  actualEffect: string | null;
  replicable: boolean;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  updatedAt: string;
}

// Typed data store
const db = rawData as {
  campuses: Campus[];
  equipment: Equipment[];
  issues: Issue[];
  metricDefinitions: MetricDefinition[];
  metricRecords: MetricRecord[];
  projects: Project[];
  maintenances: Maintenance[];
  faults: Fault[];
};

// ───── Query helpers ─────

export function getCampuses() {
  return db.campuses;
}

export function getCampus(id: string) {
  return db.campuses.find((c) => c.id === id) ?? null;
}

export function getCampusEquipment(campusId: string) {
  return db.equipment.filter((e) => e.campusId === campusId);
}

export function getCampusIssues(campusId: string) {
  return db.issues.filter((i) => i.campusId === campusId);
}

export function getCampusProjects(campusId: string) {
  return db.projects.filter((p) => p.campusId === campusId);
}

export function getCampusMetrics(campusId: string) {
  return db.metricRecords.filter((r) => r.campusId === campusId);
}

export function getAllEquipment() {
  return db.equipment;
}

export function getEquipment(id: string) {
  return db.equipment.find((e) => e.id === id) ?? null;
}

export function getEquipmentMaintenances(equipmentId: string) {
  return db.maintenances.filter((m) => m.equipmentId === equipmentId);
}

export function getEquipmentFaults(equipmentId: string) {
  return db.faults.filter((f) => f.equipmentId === equipmentId);
}

export function getAllIssues() {
  return db.issues;
}

export function getIssue(id: string) {
  return db.issues.find((i) => i.id === id) ?? null;
}

export function getAllMetricDefinitions() {
  return db.metricDefinitions;
}

export function getMetricDefinition(id: string) {
  return db.metricDefinitions.find((d) => d.id === id) ?? null;
}

export function getAllMetricRecords() {
  return db.metricRecords;
}

export function getMetricRecordsByCampus(campusId: string) {
  return db.metricRecords.filter((r) => r.campusId === campusId);
}

export function getAlertRecords() {
  return db.metricRecords
    .filter((r) => r.alertLevel !== null)
    .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime());
}

export function getAllProjects() {
  return db.projects;
}

export function getProject(id: string) {
  return db.projects.find((p) => p.id === id) ?? null;
}

// ───── Aggregation helpers ─────

export function getCampusStats(campusId: string) {
  const issues = getCampusIssues(campusId);
  const equipment = getCampusEquipment(campusId);
  const projects = getCampusProjects(campusId);
  const alerts = db.metricRecords.filter(
    (r) => r.campusId === campusId && r.alertLevel !== null
  );
  const equipWarnings = equipment.filter((e) => e.status !== "正常");

  return {
    issueCount: issues.length,
    equipmentCount: equipment.length,
    projectCount: projects.length,
    alertCount: alerts.length,
    equipWarningCount: equipWarnings.length,
  };
}

export function getHeatmapData() {
  const campuses = getCampuses();
  const issues = getAllIssues();
  const MANAGEMENT_GOALS = [
    "环境安全", "业务连续", "温度适宜", "空气清新", "乘梯有速",
    "照明亮堂", "噪音无扰", "厕所干净", "喝水方便", "设施完善",
    "空间合理", "通行有序", "标识清晰", "及时响应", "节能降耗",
    "物资齐备", "物流通畅", "技术先进",
  ] as const;

  const matrix: Record<
    string,
    Record<string, { count: number; highRisk: number }>
  > = {};

  for (const c of campuses) {
    matrix[c.name] = {};
    for (const g of MANAGEMENT_GOALS) {
      matrix[c.name][g] = { count: 0, highRisk: 0 };
    }
  }

  for (const issue of issues) {
    const campus = campuses.find((c) => c.id === issue.campusId);
    if (campus && matrix[campus.name]?.[issue.goal]) {
      matrix[campus.name][issue.goal].count++;
      if (issue.riskLevel === "高")
        matrix[campus.name][issue.goal].highRisk++;
    }
  }

  return {
    campuses: campuses.map((c) => c.name),
    goals: [...MANAGEMENT_GOALS],
    matrix,
  };
}
