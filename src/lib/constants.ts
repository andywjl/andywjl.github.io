export const MANAGEMENT_GOALS = [
  "环境安全",
  "业务连续",
  "温度适宜",
  "空气清新",
  "乘梯有速",
  "照明亮堂",
  "噪音无扰",
  "厕所干净",
  "喝水方便",
  "设施完善",
  "空间合理",
  "通行有序",
  "标识清晰",
  "及时响应",
  "节能降耗",
  "物资齐备",
  "物流通畅",
  "技术先进",
] as const;

export const PHILOSOPHIES = [
  "安全可靠",
  "身心健康",
  "少花精力",
  "精益高效",
] as const;

export const GOAL_TO_PHILOSOPHY: Record<string, string> = {
  环境安全: "安全可靠",
  业务连续: "安全可靠",
  温度适宜: "身心健康",
  空气清新: "身心健康",
  乘梯有速: "身心健康",
  照明亮堂: "身心健康",
  噪音无扰: "身心健康",
  厕所干净: "身心健康",
  喝水方便: "身心健康",
  设施完善: "少花精力",
  空间合理: "少花精力",
  通行有序: "少花精力",
  标识清晰: "少花精力",
  及时响应: "少花精力",
  节能降耗: "精益高效",
  物资齐备: "精益高效",
  物流通畅: "精益高效",
  技术先进: "精益高效",
};

export const EQUIPMENT_CATEGORIES: Record<string, string[]> = {
  暖通空调: ["冷机", "冷却塔", "AHU", "FCU", "VRV", "锅炉"],
  电梯: ["客梯", "货梯", "消防梯"],
  照明: ["灯具", "灯控系统", "感应设备"],
  电力: ["变配电", "UPS", "柴发", "光伏", "储能"],
  给排水: ["供水", "排水", "直饮水", "消防水"],
  消防: ["报警", "喷淋", "排烟", "灭火器"],
  智能化: ["BMS", "BA", "IRE", "传感器", "门禁"],
  新风: ["新风机组", "排风", "油烟净化"],
};

export const CAMPUS_SEED = [
  {
    name: "新江湾",
    city: "上海",
    totalArea: 28,
    workstations: 15734,
    ifmVendor: "安锐盟",
    managementTier: "精细化",
  },
  {
    name: "大钟寺",
    city: "北京",
    totalArea: 34,
    workstations: 12524,
    ifmVendor: "金地",
    managementTier: "改造期",
  },
  {
    name: "方恒",
    city: "北京",
    totalArea: 6.1,
    workstations: 6544,
    ifmVendor: "索迪斯",
    managementTier: "改造期",
  },
  {
    name: "景湖大厦",
    city: "深圳",
    totalArea: 7.8,
    workstations: 3438,
    ifmVendor: "招商积余",
    managementTier: "磨合期",
  },
  {
    name: "桂溪",
    city: "成都",
    totalArea: 14.5,
    workstations: 9738,
    ifmVendor: "安锐盟",
    managementTier: "精细化",
  },
  {
    name: "仓南广场",
    city: "杭州",
    totalArea: 21,
    workstations: 8389,
    ifmVendor: "特发",
    managementTier: "磨合期",
  },
] as const;

export const ISSUE_STATUSES = [
  "待确认",
  "已确认",
  "整改中",
  "已闭环",
  "持续监控",
] as const;

export const PROJECT_STATUSES = [
  "立项",
  "审批中",
  "实施中",
  "验收中",
  "已完成",
] as const;

export const EQUIPMENT_STATUSES = [
  "正常",
  "预警",
  "故障",
  "维修中",
  "已报废",
] as const;

export const RISK_LEVELS = ["低", "中", "高"] as const;

export const TIER_COLORS: Record<string, string> = {
  精细化: "bg-green-100 text-green-700",
  改造期: "bg-amber-100 text-amber-700",
  磨合期: "bg-blue-100 text-blue-700",
};
