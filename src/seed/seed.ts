/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");

const dbPath = path.join(process.cwd(), "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });

// Use require for the generated client since tsx resolves it as CJS
const { PrismaClient } = require("../generated/prisma/client.js");
const prisma = new PrismaClient({ adapter });

type RiskLevel = "低" | "中" | "高";
function calculateRiskLevel(input: { likelihood: number; exposureObj: number; exposureRange: number; hasBottomLine: boolean }): RiskLevel {
  const baseScore = input.likelihood * input.exposureObj * input.exposureRange;
  let level: RiskLevel;
  if (baseScore <= 5) level = "低";
  else if (baseScore <= 17) level = "中";
  else level = "高";
  if (input.hasBottomLine && level !== "高") {
    level = level === "低" ? "中" : "高";
  }
  return level;
}

type AlertLevel = null | "黄色" | "橙色" | "红色";
function checkAlert(config: { value: number; yellowThreshold: number | null; orangeThreshold: number | null; redThreshold: number | null; direction: "above" | "below" }): AlertLevel {
  const { value, yellowThreshold, orangeThreshold, redThreshold, direction } = config;
  const compare = direction === "above" ? (v: number, t: number) => v >= t : (v: number, t: number) => v <= t;
  if (redThreshold !== null && compare(value, redThreshold)) return "红色";
  if (orangeThreshold !== null && compare(value, orangeThreshold)) return "橙色";
  if (yellowThreshold !== null && compare(value, yellowThreshold)) return "黄色";
  return null;
}

async function main() {
  console.log("Seeding database...");

  // ── 1. Campuses ──
  const campusData = [
    { name: "新江湾", city: "上海", deliveryDate: new Date("2015-06-01"), propertyType: "自有产权", totalArea: 28, workstations: 15734, ifmVendor: "安锐盟", managementTier: "精细化", businessLines: JSON.stringify(["研发", "销售", "职能"]), topGoals: JSON.stringify(["温度适宜", "乘梯有速", "节能降耗", "及时响应", "技术先进"]) },
    { name: "大钟寺", city: "北京", deliveryDate: new Date("2009-03-15"), propertyType: "自有", totalArea: 34, workstations: 12524, ifmVendor: "金地", ifmSwitchDate: new Date("2024-01-01"), managementTier: "改造期", businessLines: JSON.stringify(["研发", "运营"]), topGoals: JSON.stringify(["温度适宜", "空气清新", "设施完善", "节能降耗", "业务连续"]) },
    { name: "方恒", city: "北京", deliveryDate: new Date("2018-09-01"), propertyType: "自有", totalArea: 6.1, workstations: 6544, ifmVendor: "索迪斯", managementTier: "改造期", businessLines: JSON.stringify(["研发", "测试"]), topGoals: JSON.stringify(["空气清新", "温度适宜", "噪音无扰", "节能降耗", "及时响应"]) },
    { name: "景湖大厦", city: "深圳", deliveryDate: new Date("2020-01-01"), propertyType: "自建", totalArea: 7.8, workstations: 3438, ifmVendor: "招商积余", managementTier: "磨合期", businessLines: JSON.stringify(["研发", "市场"]), topGoals: JSON.stringify(["环境安全", "温度适宜", "乘梯有速", "设施完善", "技术先进"]) },
    { name: "桂溪", city: "成都", deliveryDate: new Date("2016-11-01"), propertyType: "自有产权", totalArea: 14.5, workstations: 9738, ifmVendor: "安锐盟", managementTier: "精细化", businessLines: JSON.stringify(["研发", "客服", "运维"]), topGoals: JSON.stringify(["温度适宜", "节能降耗", "乘梯有速", "及时响应", "空气清新"]) },
    { name: "仓南广场", city: "杭州", deliveryDate: new Date("2021-05-01"), propertyType: "自有", totalArea: 21, workstations: 8389, ifmVendor: "特发", managementTier: "磨合期", businessLines: JSON.stringify(["研发", "产品", "设计"]), topGoals: JSON.stringify(["温度适宜", "空气清新", "设施完善", "环境安全", "及时响应"]) },
  ];

  const campuses: Record<string, string> = {};
  for (const c of campusData) {
    const campus = await prisma.campus.create({ data: c });
    campuses[campus.name] = campus.id;
  }
  console.log(`  Created ${Object.keys(campuses).length} campuses`);

  // ── 2. Metric Definitions ──
  const metricDefs = [
    { name: "人梯比", goal: "乘梯有速", formula: "总人数/客梯数", unit: "人/台", industryStd: "≤350", companyTarget: "≤300", source: "人工填报", frequency: "季", yellowThreshold: 350, orangeThreshold: 400, redThreshold: 450, thresholdDir: "above" },
    { name: "五分钟运力", goal: "乘梯有速", formula: "5分钟可运载人数/总人数", unit: "%", industryStd: "≥10%", companyTarget: "≥12%", source: "自动采集", frequency: "日", yellowThreshold: 10, orangeThreshold: 8, redThreshold: 6, thresholdDir: "below" },
    { name: "千人报单率", goal: "及时响应", formula: "月工单数/千人", unit: "单/千人", industryStd: "≤8", companyTarget: "≤6", source: "自动采集", frequency: "月", yellowThreshold: 8, orangeThreshold: 10, redThreshold: 12, thresholdDir: "above" },
    { name: "CO2浓度", goal: "空气清新", formula: "CO2传感器均值", unit: "ppm", industryStd: "≤800", companyTarget: "≤700", source: "自动采集", frequency: "实时", yellowThreshold: 800, orangeThreshold: 1000, redThreshold: 1200, thresholdDir: "above" },
    { name: "COP值", goal: "节能降耗", formula: "制冷量/输入功率", unit: "", industryStd: "≥4.0", companyTarget: "≥4.5", source: "自动采集", frequency: "日", yellowThreshold: 4.0, orangeThreshold: 3.5, redThreshold: 3.0, thresholdDir: "below" },
    { name: "PM2.5浓度", goal: "空气清新", formula: "PM2.5传感器均值", unit: "μg/m³", industryStd: "≤35", companyTarget: "≤25", source: "自动采集", frequency: "实时", yellowThreshold: 35, orangeThreshold: 50, redThreshold: 75, thresholdDir: "above" },
    { name: "温度达标率", goal: "温度适宜", formula: "达标区域数/总区域数", unit: "%", industryStd: "≥90%", companyTarget: "≥95%", source: "自动采集", frequency: "日", yellowThreshold: 90, orangeThreshold: 85, redThreshold: 80, thresholdDir: "below" },
    { name: "湿度达标率", goal: "温度适宜", formula: "达标区域数/总区域数", unit: "%", industryStd: "≥85%", companyTarget: "≥90%", source: "自动采集", frequency: "日", yellowThreshold: 85, orangeThreshold: 80, redThreshold: 75, thresholdDir: "below" },
    { name: "照度达标率", goal: "照明亮堂", formula: "达标区域/总区域", unit: "%", industryStd: "≥90%", companyTarget: "≥95%", source: "人工填报", frequency: "月", yellowThreshold: 90, orangeThreshold: 85, redThreshold: 80, thresholdDir: "below" },
    { name: "噪音达标率", goal: "噪音无扰", formula: "达标区域/总区域", unit: "%", industryStd: "≥90%", companyTarget: "≥95%", source: "人工填报", frequency: "月", yellowThreshold: 90, orangeThreshold: 85, redThreshold: 80, thresholdDir: "below" },
    { name: "卫生间满意度", goal: "厕所干净", formula: "满意评价数/总评价数", unit: "%", industryStd: "≥80%", companyTarget: "≥90%", source: "人工填报", frequency: "月", yellowThreshold: 80, orangeThreshold: 70, redThreshold: 60, thresholdDir: "below" },
    { name: "直饮水合格率", goal: "喝水方便", formula: "合格检测点/总检测点", unit: "%", industryStd: "100%", companyTarget: "100%", source: "人工填报", frequency: "月", yellowThreshold: 99, orangeThreshold: 95, redThreshold: 90, thresholdDir: "below" },
    { name: "消防系统完好率", goal: "环境安全", formula: "完好设备数/总设备数", unit: "%", industryStd: "≥98%", companyTarget: "100%", source: "人工填报", frequency: "月", yellowThreshold: 98, orangeThreshold: 95, redThreshold: 90, thresholdDir: "below" },
    { name: "设备故障率", goal: "业务连续", formula: "故障次数/设备总数", unit: "%", industryStd: "≤2%", companyTarget: "≤1%", source: "自动采集", frequency: "月", yellowThreshold: 2, orangeThreshold: 3, redThreshold: 5, thresholdDir: "above" },
    { name: "工单响应时间", goal: "及时响应", formula: "接单到响应平均时长", unit: "分钟", industryStd: "≤30", companyTarget: "≤15", source: "自动采集", frequency: "日", yellowThreshold: 30, orangeThreshold: 45, redThreshold: 60, thresholdDir: "above" },
    { name: "工单完结率", goal: "及时响应", formula: "已完结/总工单", unit: "%", industryStd: "≥90%", companyTarget: "≥95%", source: "自动采集", frequency: "月", yellowThreshold: 90, orangeThreshold: 85, redThreshold: 80, thresholdDir: "below" },
    { name: "EUI能耗", goal: "节能降耗", formula: "年能耗/建筑面积", unit: "kWh/㎡", industryStd: "≤120", companyTarget: "≤100", source: "自动采集", frequency: "月", yellowThreshold: 120, orangeThreshold: 140, redThreshold: 160, thresholdDir: "above" },
    { name: "电梯故障率", goal: "乘梯有速", formula: "月故障次数/电梯总数", unit: "%", industryStd: "≤1%", companyTarget: "≤0.5%", source: "自动采集", frequency: "月", yellowThreshold: 1, orangeThreshold: 2, redThreshold: 3, thresholdDir: "above" },
    { name: "设施报修完成率", goal: "设施完善", formula: "完成数/报修总数", unit: "%", industryStd: "≥95%", companyTarget: "≥98%", source: "自动采集", frequency: "月", yellowThreshold: 95, orangeThreshold: 90, redThreshold: 85, thresholdDir: "below" },
    { name: "通道畅通率", goal: "通行有序", formula: "达标通道/总通道", unit: "%", industryStd: "100%", companyTarget: "100%", source: "人工填报", frequency: "周", yellowThreshold: 98, orangeThreshold: 95, redThreshold: 90, thresholdDir: "below" },
    { name: "标识完好率", goal: "标识清晰", formula: "完好标识/总标识", unit: "%", industryStd: "≥98%", companyTarget: "100%", source: "人工填报", frequency: "月", yellowThreshold: 98, orangeThreshold: 95, redThreshold: 90, thresholdDir: "below" },
    { name: "物资库存周转率", goal: "物资齐备", formula: "出库金额/平均库存", unit: "次", industryStd: "≥4", companyTarget: "≥6", source: "人工填报", frequency: "季", yellowThreshold: 4, orangeThreshold: 3, redThreshold: 2, thresholdDir: "below" },
    { name: "物流准时送达率", goal: "物流通畅", formula: "准时送达数/总送达数", unit: "%", industryStd: "≥95%", companyTarget: "≥98%", source: "人工填报", frequency: "月", yellowThreshold: 95, orangeThreshold: 90, redThreshold: 85, thresholdDir: "below" },
    { name: "智能化系统在线率", goal: "技术先进", formula: "在线系统数/总系统数", unit: "%", industryStd: "≥98%", companyTarget: "≥99%", source: "自动采集", frequency: "日", yellowThreshold: 98, orangeThreshold: 95, redThreshold: 90, thresholdDir: "below" },
  ];

  const metricIds: Record<string, { id: string; yellowThreshold: number | null; orangeThreshold: number | null; redThreshold: number | null; thresholdDir: string }> = {};
  for (const m of metricDefs) {
    const metric = await prisma.metricDefinition.create({ data: m });
    metricIds[metric.name] = { id: metric.id, yellowThreshold: m.yellowThreshold ?? null, orangeThreshold: m.orangeThreshold ?? null, redThreshold: m.redThreshold ?? null, thresholdDir: m.thresholdDir };
  }
  console.log(`  Created ${Object.keys(metricIds).length} metric definitions`);

  // ── 3. Equipment ──
  const equipmentTemplates = [
    { category1: "暖通空调", items: [
      { category2: "冷机", name: "离心冷水机组", brand: "开利", designLife: 20, params: '{"capacity":"500RT","cop":4.5}' },
      { category2: "冷却塔", name: "横流式冷却塔", brand: "良机", designLife: 15, params: '{"capacity":"600RT"}' },
      { category2: "AHU", name: "组合式空调机组", brand: "大金", designLife: 15, params: '{}' },
      { category2: "VRV", name: "VRV多联机", brand: "大金", designLife: 12, params: '{"capacity":"28kW"}' },
    ]},
    { category1: "电梯", items: [
      { category2: "客梯", name: "无机房乘客电梯", brand: "日立", designLife: 20, params: '{"speed":"2.5m/s","load":"1350kg"}' },
      { category2: "货梯", name: "载货电梯", brand: "三菱", designLife: 20, params: '{"speed":"1.0m/s","load":"3000kg"}' },
    ]},
    { category1: "电力", items: [
      { category2: "变配电", name: "干式变压器", brand: "施耐德", designLife: 25, params: '{"capacity":"2000kVA"}' },
      { category2: "UPS", name: "不间断电源", brand: "伊顿", designLife: 10, params: '{"capacity":"300kVA"}' },
      { category2: "柴发", name: "柴油发电机组", brand: "康明斯", designLife: 20, params: '{"capacity":"800kW"}' },
    ]},
    { category1: "消防", items: [
      { category2: "报警", name: "火灾自动报警系统", brand: "海湾", designLife: 15, params: '{}' },
      { category2: "喷淋", name: "自动喷水灭火系统", brand: "泰科", designLife: 20, params: '{}' },
    ]},
    { category1: "智能化", items: [
      { category2: "BMS", name: "楼宇自控系统", brand: "霍尼韦尔", designLife: 10, params: '{}' },
    ]},
    { category1: "新风", items: [
      { category2: "新风机组", name: "全热交换新风机组", brand: "松下", designLife: 12, params: '{"airVolume":"5000m³/h"}' },
    ]},
  ];

  const locations = ["A栋1层机房", "A栋B1层", "B栋1层大堂", "B栋屋顶", "C栋地下室", "中央能源站"];
  const eqStatuses = ["正常", "正常", "正常", "正常", "预警", "正常"];
  let equipCount = 0;

  for (const [campusName, campusId] of Object.entries(campuses)) {
    for (const group of equipmentTemplates) {
      for (let i = 0; i < group.items.length; i++) {
        const item = group.items[i];
        const yearsBack = Math.floor(Math.random() * 8) + 3;
        await prisma.equipment.create({
          data: {
            campusId,
            name: `${campusName}-${item.name}${i > 0 ? `-${i + 1}` : ""}`,
            category1: group.category1,
            category2: item.category2,
            location: locations[Math.floor(Math.random() * locations.length)],
            brand: item.brand,
            model: `${item.brand}-${item.category2}-${Math.floor(Math.random() * 1000)}`,
            installDate: new Date(2026 - yearsBack, Math.floor(Math.random() * 12), 1),
            designLife: item.designLife,
            status: eqStatuses[Math.floor(Math.random() * eqStatuses.length)],
            params: item.params,
          },
        });
        equipCount++;
      }
    }
  }
  console.log(`  Created ${equipCount} equipment records`);

  // ── 4. Issues ──
  const goals = ["环境安全", "业务连续", "温度适宜", "空气清新", "乘梯有速", "照明亮堂", "噪音无扰", "厕所干净", "喝水方便", "设施完善", "空间合理", "通行有序", "标识清晰", "及时响应", "节能降耗", "物资齐备", "物流通畅", "技术先进"];
  const goalToPhilosophy: Record<string, string> = { 环境安全: "安全可靠", 业务连续: "安全可靠", 温度适宜: "身心健康", 空气清新: "身心健康", 乘梯有速: "身心健康", 照明亮堂: "身心健康", 噪音无扰: "身心健康", 厕所干净: "身心健康", 喝水方便: "身心健康", 设施完善: "少花精力", 空间合理: "少花精力", 通行有序: "少花精力", 标识清晰: "少花精力", 及时响应: "少花精力", 节能降耗: "精益高效", 物资齐备: "精益高效", 物流通畅: "精益高效", 技术先进: "精益高效" };

  const issueTemplates: Record<string, string[]> = {
    温度适宜: ["暖通报修量偏大", "温控精度不足", "冬季供热不均匀", "会议室温度波动大", "靠窗区域过热", "地下车库潮湿"],
    空气清新: ["CO2浓度偏高", "新风量不足", "PM2.5超标", "卫生间异味扩散", "装修异味残留"],
    乘梯有速: ["高峰等梯时间长", "人梯比超标", "电梯故障频发", "五分钟运力不足"],
    照明亮堂: ["办公区照度不均", "灯具老化严重", "感应灯失灵", "应急照明不足"],
    噪音无扰: ["空调机房噪音扰民", "电梯机房共振", "外部施工噪音", "设备运行低频噪音"],
    厕所干净: ["卫生间清洁频次不够", "洁具老化需更换", "除臭系统失效"],
    喝水方便: ["直饮水点不足", "水质检测不达标", "热水供应不稳定"],
    设施完善: ["会议室设备老化", "充电桩不足", "母婴室设施缺失", "无障碍设施不完善"],
    空间合理: ["工位利用率偏低", "会议室供不应求", "储物空间不足"],
    通行有序: ["消防通道被占", "地库导视混乱", "大堂通行拥堵"],
    标识清晰: ["楼层导视缺失", "安全标识褪色", "停车场标识不清"],
    及时响应: ["报修响应超时", "投诉闭环率偏低", "夜间值班响应慢"],
    环境安全: ["消防设施巡检不到位", "监控覆盖盲区", "配电室安全隐患", "化学品存放不规范"],
    业务连续: ["UPS容量不足", "柴发自启失败", "网络冗余不够", "水管老化漏水"],
    节能降耗: ["COP值偏低", "照明能耗偏高", "空调系统能效差", "未利用余热回收"],
    物资齐备: ["备件库存不足", "关键耗材断供", "采购周期过长"],
    物流通畅: ["收发室拥堵", "快递柜不足", "大件运输通道受阻"],
    技术先进: ["BMS系统老旧", "未接入IoT传感器", "缺少能耗分析平台"],
  };

  const issueStatuses = ["待确认", "已确认", "整改中", "已闭环", "持续监控"];
  let issueCount = 0;

  for (const [campusName, campusId] of Object.entries(campuses)) {
    for (const goal of goals) {
      const templates = issueTemplates[goal] || [];
      const numIssues = Math.min(templates.length, Math.floor(Math.random() * 3) + 1);
      for (let i = 0; i < numIssues; i++) {
        const l = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
        const e1 = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
        const e2 = (Math.floor(Math.random() * 3) + 1) as 1 | 2 | 3;
        const bl = Math.random() > 0.7;
        const rl = calculateRiskLevel({ likelihood: l, exposureObj: e1, exposureRange: e2, hasBottomLine: bl });
        await prisma.issue.create({
          data: { campusId, title: templates[i], description: `${campusName}园区${templates[i]}问题，需关注${goal}目标改善。`, category: goalToPhilosophy[goal], goal, nature: Math.random() > 0.3 ? "问题记录" : "稳定项", likelihood: l, exposureObj: e1, exposureRange: e2, hasBottomLine: bl, riskLevel: rl, status: issueStatuses[Math.floor(Math.random() * issueStatuses.length)], solution: Math.random() > 0.5 ? `针对${templates[i]}制定整改方案` : null },
        });
        issueCount++;
      }
    }
  }
  console.log(`  Created ${issueCount} issues`);

  // ── 5. Metric Records (last 6 months) ──
  let recordCount = 0;
  const now = new Date();
  for (const [metricName, metricInfo] of Object.entries(metricIds)) {
    for (const [, campusId] of Object.entries(campuses)) {
      for (let m = 5; m >= 0; m--) {
        const date = new Date(now.getFullYear(), now.getMonth() - m, 15);
        let baseValue: number;
        switch (metricName) {
          case "人梯比": baseValue = 280 + Math.random() * 120; break;
          case "五分钟运力": baseValue = 7 + Math.random() * 8; break;
          case "千人报单率": baseValue = 4 + Math.random() * 8; break;
          case "CO2浓度": baseValue = 500 + Math.random() * 600; break;
          case "COP值": baseValue = 3.0 + Math.random() * 2.5; break;
          case "PM2.5浓度": baseValue = 15 + Math.random() * 40; break;
          case "温度达标率": baseValue = 80 + Math.random() * 20; break;
          case "湿度达标率": baseValue = 78 + Math.random() * 22; break;
          case "EUI能耗": baseValue = 80 + Math.random() * 80; break;
          default: baseValue = 75 + Math.random() * 25; break;
        }
        const value = Math.round(baseValue * 100) / 100;
        const alertLevel = checkAlert({ value, yellowThreshold: metricInfo.yellowThreshold, orangeThreshold: metricInfo.orangeThreshold, redThreshold: metricInfo.redThreshold, direction: metricInfo.thresholdDir as "above" | "below" });
        await prisma.metricRecord.create({ data: { metricId: metricInfo.id, campusId, value, recordedAt: date, alertLevel } });
        recordCount++;
      }
    }
  }
  console.log(`  Created ${recordCount} metric records`);

  // ── 6. Projects ──
  const projectData = [
    { campus: "大钟寺", name: "1号楼大堂增加VRV空调", goal: "温度适宜", budget: 45, duration: "6个月内", status: "实施中", expectedEffect: "大堂温度达标率提升至95%", replicable: true },
    { campus: "大钟寺", name: "照明系统LED改造", goal: "节能降耗", budget: 120, duration: "8个月内", status: "审批中", expectedEffect: "照明能耗降低40%", replicable: true },
    { campus: "方恒", name: "新风系统增容改造", goal: "空气清新", budget: 80, duration: "4个月内", status: "实施中", expectedEffect: "CO2浓度降至700ppm以下", replicable: false },
    { campus: "方恒", name: "会议室智能温控改造", goal: "温度适宜", budget: 35, duration: "3个月内", status: "立项", expectedEffect: "会议室温度投诉降低80%", replicable: true },
    { campus: "桂溪", name: "EC风机节能改造", goal: "节能降耗", budget: 60, duration: "5个月内", status: "实施中", expectedEffect: "风机能耗降低50%", replicable: true },
    { campus: "桂溪", name: "电梯群控系统升级", goal: "乘梯有速", budget: 90, duration: "6个月内", status: "审批中", expectedEffect: "五分钟运力提升至12%", replicable: true },
    { campus: "新江湾", name: "BMS系统升级", goal: "技术先进", budget: 200, duration: "12个月内", status: "实施中", expectedEffect: "实现全面智能化监控", replicable: true },
    { campus: "新江湾", name: "光伏发电系统安装", goal: "节能降耗", budget: 350, duration: "10个月内", status: "立项", expectedEffect: "年发电量覆盖公共区域用电15%", replicable: false },
    { campus: "景湖大厦", name: "消防系统联动改造", goal: "环境安全", budget: 55, duration: "4个月内", status: "验收中", expectedEffect: "消防系统联动响应时间≤30s", replicable: false },
    { campus: "仓南广场", name: "直饮水系统升级", goal: "喝水方便", budget: 25, duration: "2个月内", status: "已完成", expectedEffect: "直饮水点覆盖率100%", actualEffect: "已实现全楼层覆盖", replicable: true },
    { campus: "仓南广场", name: "智能化停车导视系统", goal: "通行有序", budget: 40, duration: "3个月内", status: "实施中", expectedEffect: "地库寻车时间减少60%", replicable: true },
  ];

  for (const p of projectData) {
    await prisma.project.create({
      data: {
        campusId: campuses[p.campus],
        name: p.name,
        goal: p.goal,
        budget: p.budget,
        duration: p.duration,
        status: p.status,
        expectedEffect: p.expectedEffect,
        actualEffect: ("actualEffect" in p ? (p as Record<string, unknown>).actualEffect as string : null),
        replicable: p.replicable,
        startDate: p.status !== "立项" ? new Date(2025, Math.floor(Math.random() * 6), 1) : null,
        endDate: p.status === "已完成" ? new Date(2026, Math.floor(Math.random() * 4), 1) : null,
      },
    });
  }
  console.log(`  Created ${projectData.length} projects`);

  console.log("Seed completed!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
