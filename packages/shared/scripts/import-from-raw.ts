import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type RegionId = "CN" | "APAC" | "EMEA" | "AMS";

type WorkspaceSeed = {
  code: string;
  name: string;
  countryId: string;
  province: string | null;
  city: string;
  district: string | null;
  address: string;
  buildingName: string | null;
  floor: string | null;
  lng: number;
  lat: number;
  leaseStartDate: string | null;
  deliveryDate: string | null;
  moveInDate: string | null;
  leaseEndDate: string | null;
  actualEndDate: string | null;
  floorStatus: string | null;
  status: "ACTIVE" | "PLANNING" | "CLOSED";
  seatCount: number;
  allocatedSeats: number | null;
  leasedAreaSqm: number | null;
  decoratedAreaSqm: number | null;
  usableAreaSqm: number | null;
  ownerName: string | null;
  ownerEmail: string | null;
  description: string | null;
  tags: string[];
};

type CountryMeta = {
  id: string;
  nameZh: string;
  nameEn: string;
  defaultRegionId: RegionId;
  aliases: string[];
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const seedDir = path.resolve(__dirname, "../seed");
const rawPath = path.join(seedDir, "workspaces_raw.json");

const REGION_META: Record<RegionId, { nameZh: string; nameEn: string }> = {
  CN: { nameZh: "中国", nameEn: "China" },
  APAC: { nameZh: "亚太", nameEn: "APAC" },
  EMEA: { nameZh: "欧洲中东非洲", nameEn: "EMEA" },
  AMS: { nameZh: "美洲", nameEn: "AMS" },
};

const COUNTRY_META: CountryMeta[] = [
  { id: "CHN", nameZh: "中国", nameEn: "China", defaultRegionId: "CN", aliases: ["china", "cn", "中国大陆"] },
  { id: "HKG", nameZh: "中国香港", nameEn: "Hong Kong", defaultRegionId: "CN", aliases: ["hong kong", "hk", "香港", "中国香港"] },
  { id: "SGP", nameZh: "新加坡", nameEn: "Singapore", defaultRegionId: "APAC", aliases: ["singapore", "sg"] },
  { id: "JPN", nameZh: "日本", nameEn: "Japan", defaultRegionId: "APAC", aliases: ["japan", "jp"] },
  { id: "IND", nameZh: "印度", nameEn: "India", defaultRegionId: "APAC", aliases: ["india", "in"] },
  { id: "AUS", nameZh: "澳大利亚", nameEn: "Australia", defaultRegionId: "APAC", aliases: ["australia", "au"] },
  { id: "KOR", nameZh: "韩国", nameEn: "South Korea", defaultRegionId: "APAC", aliases: ["south korea", "korea", "kr"] },
  { id: "THA", nameZh: "泰国", nameEn: "Thailand", defaultRegionId: "APAC", aliases: ["thailand", "th"] },
  { id: "MYS", nameZh: "马来西亚", nameEn: "Malaysia", defaultRegionId: "APAC", aliases: ["malaysia", "my"] },
  { id: "IDN", nameZh: "印度尼西亚", nameEn: "Indonesia", defaultRegionId: "APAC", aliases: ["indonesia", "id"] },
  { id: "VNM", nameZh: "越南", nameEn: "Vietnam", defaultRegionId: "APAC", aliases: ["vietnam", "vn"] },
  { id: "PHL", nameZh: "菲律宾", nameEn: "Philippines", defaultRegionId: "APAC", aliases: ["philippines", "ph"] },
  { id: "NZL", nameZh: "新西兰", nameEn: "New Zealand", defaultRegionId: "APAC", aliases: ["new zealand", "nz"] },
  { id: "PAK", nameZh: "巴基斯坦", nameEn: "Pakistan", defaultRegionId: "APAC", aliases: ["pakistan", "pk"] },
  { id: "GBR", nameZh: "英国", nameEn: "United Kingdom", defaultRegionId: "EMEA", aliases: ["uk", "united kingdom", "gb", "great britain"] },
  { id: "DEU", nameZh: "德国", nameEn: "Germany", defaultRegionId: "EMEA", aliases: ["germany", "de"] },
  { id: "FRA", nameZh: "法国", nameEn: "France", defaultRegionId: "EMEA", aliases: ["france", "fr"] },
  { id: "ARE", nameZh: "阿联酋", nameEn: "United Arab Emirates", defaultRegionId: "EMEA", aliases: ["uae", "united arab emirates", "ae"] },
  { id: "RUS", nameZh: "俄罗斯", nameEn: "Russia", defaultRegionId: "APAC", aliases: ["russia", "ru", "俄罗斯联邦"] },
  { id: "ISR", nameZh: "以色列", nameEn: "Israel", defaultRegionId: "EMEA", aliases: ["israel", "il"] },
  { id: "LUX", nameZh: "卢森堡", nameEn: "Luxembourg", defaultRegionId: "EMEA", aliases: ["luxembourg", "lu"] },
  { id: "MAR", nameZh: "摩洛哥", nameEn: "Morocco", defaultRegionId: "EMEA", aliases: ["morocco", "ma"] },
  { id: "BEL", nameZh: "比利时", nameEn: "Belgium", defaultRegionId: "EMEA", aliases: ["belgium", "be"] },
  { id: "PRT", nameZh: "葡萄牙", nameEn: "Portugal", defaultRegionId: "EMEA", aliases: ["portugal", "pt"] },
  { id: "ROU", nameZh: "罗马尼亚", nameEn: "Romania", defaultRegionId: "EMEA", aliases: ["romania", "ro"] },
  { id: "IRL", nameZh: "爱尔兰", nameEn: "Ireland", defaultRegionId: "EMEA", aliases: ["ireland", "ie"] },
  { id: "NLD", nameZh: "荷兰", nameEn: "Netherlands", defaultRegionId: "EMEA", aliases: ["netherlands", "nl"] },
  { id: "ESP", nameZh: "西班牙", nameEn: "Spain", defaultRegionId: "EMEA", aliases: ["spain", "es"] },
  { id: "ITA", nameZh: "意大利", nameEn: "Italy", defaultRegionId: "EMEA", aliases: ["italy", "it"] },
  { id: "CHE", nameZh: "瑞士", nameEn: "Switzerland", defaultRegionId: "EMEA", aliases: ["switzerland", "ch"] },
  { id: "SWE", nameZh: "瑞典", nameEn: "Sweden", defaultRegionId: "EMEA", aliases: ["sweden", "se"] },
  { id: "NOR", nameZh: "挪威", nameEn: "Norway", defaultRegionId: "EMEA", aliases: ["norway", "no"] },
  { id: "DNK", nameZh: "丹麦", nameEn: "Denmark", defaultRegionId: "EMEA", aliases: ["denmark", "dk"] },
  { id: "POL", nameZh: "波兰", nameEn: "Poland", defaultRegionId: "EMEA", aliases: ["poland", "pl"] },
  { id: "TUR", nameZh: "土耳其", nameEn: "Turkey", defaultRegionId: "EMEA", aliases: ["turkey", "tr"] },
  { id: "SAU", nameZh: "沙特阿拉伯", nameEn: "Saudi Arabia", defaultRegionId: "EMEA", aliases: ["saudi arabia", "sa"] },
  { id: "QAT", nameZh: "卡塔尔", nameEn: "Qatar", defaultRegionId: "EMEA", aliases: ["qatar", "qa"] },
  { id: "EGY", nameZh: "埃及", nameEn: "Egypt", defaultRegionId: "EMEA", aliases: ["egypt", "eg"] },
  { id: "ZAF", nameZh: "南非", nameEn: "South Africa", defaultRegionId: "EMEA", aliases: ["south africa", "za"] },
  { id: "NGA", nameZh: "尼日利亚", nameEn: "Nigeria", defaultRegionId: "EMEA", aliases: ["nigeria", "ng"] },
  { id: "KEN", nameZh: "肯尼亚", nameEn: "Kenya", defaultRegionId: "EMEA", aliases: ["kenya", "ke"] },
  { id: "KAZ", nameZh: "哈萨克斯坦", nameEn: "Kazakhstan", defaultRegionId: "APAC", aliases: ["kazakhstan", "kz", "哈萨克斯坦共和国"] },
  { id: "USA", nameZh: "美国", nameEn: "United States", defaultRegionId: "AMS", aliases: ["us", "usa", "united states"] },
  { id: "CAN", nameZh: "加拿大", nameEn: "Canada", defaultRegionId: "AMS", aliases: ["canada", "ca"] },
  { id: "BRA", nameZh: "巴西", nameEn: "Brazil", defaultRegionId: "AMS", aliases: ["brazil", "br"] },
  { id: "MEX", nameZh: "墨西哥", nameEn: "Mexico", defaultRegionId: "AMS", aliases: ["mexico", "mx"] },
  { id: "ARG", nameZh: "阿根廷", nameEn: "Argentina", defaultRegionId: "AMS", aliases: ["argentina", "ar"] },
  { id: "CHL", nameZh: "智利", nameEn: "Chile", defaultRegionId: "AMS", aliases: ["chile", "cl"] },
  { id: "COL", nameZh: "哥伦比亚", nameEn: "Colombia", defaultRegionId: "AMS", aliases: ["colombia", "co"] },
  { id: "PER", nameZh: "秘鲁", nameEn: "Peru", defaultRegionId: "AMS", aliases: ["peru", "pe"] },
  { id: "URY", nameZh: "乌拉圭", nameEn: "Uruguay", defaultRegionId: "AMS", aliases: ["uruguay", "uy"] },
  { id: "PAN", nameZh: "巴拿马", nameEn: "Panama", defaultRegionId: "AMS", aliases: ["panama", "pa"] },
  { id: "CRI", nameZh: "哥斯达黎加", nameEn: "Costa Rica", defaultRegionId: "AMS", aliases: ["costa rica", "cr"] },
  { id: "DOM", nameZh: "多米尼加", nameEn: "Dominican Republic", defaultRegionId: "AMS", aliases: ["dominican republic", "do"] },
];

const countryById = new Map(COUNTRY_META.map((item) => [item.id, item]));
const countryByAlias = new Map<string, CountryMeta>();
for (const country of COUNTRY_META) {
  const allAliases = [country.id, country.nameZh, country.nameEn, ...country.aliases];
  for (const alias of allAliases) {
    countryByAlias.set(normalizeKey(alias), country);
  }
}

function normalizeKey(value: string): string {
  return value.toLowerCase().replace(/\s+/g, "").replace(/[-_()/]/g, "");
}

function toNullish(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  if (
    !text ||
    text === "(null)" ||
    text.toLowerCase() === "null" ||
    text === "-" ||
    text === "--"
  ) {
    return null;
  }
  return text;
}

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value).replace(/,/g, "").trim();
  const num = Number(text);
  return Number.isFinite(num) ? num : null;
}

function excelSerialToIso(serial: number): string | null {
  if (!Number.isFinite(serial)) return null;
  const ms = Math.round((serial - 25569) * 86400 * 1000);
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function toIsoDate(value: unknown): string | null {
  if (value === null || value === undefined || value === "") return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  if (typeof value === "number") return excelSerialToIso(value);
  const text = toNullish(value);
  if (!text) return null;
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed.toISOString();
}

function pickValue(row: Record<string, unknown>, aliases: string[]): unknown {
  const normalized = new Set(aliases.map((alias) => normalizeKey(alias)));
  const hit = Object.entries(row).find(([key]) => normalized.has(normalizeKey(key)));
  return hit ? hit[1] : undefined;
}

function toStatus(value: unknown): "ACTIVE" | "PLANNING" | "CLOSED" {
  const text = toNullish(value);
  if (!text) return "ACTIVE";
  const normalized = normalizeKey(text);
  if (["planning", "规划", "筹备", "待启用"].some((k) => normalized.includes(normalizeKey(k)))) return "PLANNING";
  if (["closed", "关闭", "终止", "结束"].some((k) => normalized.includes(normalizeKey(k)))) return "CLOSED";
  return "ACTIVE";
}

function toTags(value: unknown): string[] {
  const text = toNullish(value);
  if (!text) return [];
  return text
    .split(/[,，、;；]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeCity(city: string): string {
  const trimmed = city.trim();
  const withoutSuffix = trimmed.endsWith("市")
    ? trimmed.slice(0, -1)
    : trimmed;
  const aliasMap: Record<string, string> = {
    纽约: "New York",
    纽约市: "New York",
    香港: "香港",
    慕尼黑市: "慕尼黑",
  };
  return aliasMap[withoutSuffix] ?? withoutSuffix;
}

function resolveRegionId(rawRegion: unknown, fallback: RegionId): RegionId {
  const text = toNullish(rawRegion);
  if (!text) return fallback;
  const normalized = normalizeKey(text);
  if (["cn", "china", "中国"].some((k) => normalized.includes(normalizeKey(k)))) return "CN";
  if (["apac", "asia", "亚太"].some((k) => normalized.includes(normalizeKey(k)))) return "APAC";
  if (["emea", "europe", "middleeast", "africa", "欧洲中东非洲"].some((k) => normalized.includes(normalizeKey(k))))
    return "EMEA";
  if (["ams", "americas", "america", "美洲"].some((k) => normalized.includes(normalizeKey(k)))) return "AMS";
  return fallback;
}

function resolveCountry(rawCountry: unknown, rawIso: unknown): CountryMeta {
  const iso = toNullish(rawIso)?.toUpperCase();
  if (iso) {
    const byId = countryById.get(iso);
    if (byId) return byId;
  }
  const countryText = toNullish(rawCountry);
  if (!countryText) throw new Error("Missing country field");
  const byAlias = countryByAlias.get(normalizeKey(countryText));
  if (!byAlias) throw new Error(`Unrecognized country: ${countryText}`);
  return byAlias;
}

function normalizeRows(raw: unknown): Record<string, unknown>[] {
  if (Array.isArray(raw)) return raw as Record<string, unknown>[];
  if (raw && typeof raw === "object") {
    const obj = raw as Record<string, unknown>;
    for (const key of ["data", "rows", "items", "list"]) {
      if (Array.isArray(obj[key])) return obj[key] as Record<string, unknown>[];
    }
  }
  throw new Error("workspaces_raw.json must be an array (or { data|rows|items|list: [] })");
}

async function main() {
  const content = await readFile(rawPath, "utf-8");
  const rows = normalizeRows(JSON.parse(content));

  if (rows.length !== 215) {
    throw new Error(`Expected 215 rows in workspaces_raw.json, got ${rows.length}`);
  }

  const countryCenters = new Map<string, { lngSum: number; latSum: number; count: number; regionId: RegionId }>();
  const workspaceSeeds: WorkspaceSeed[] = [];

  for (const row of rows) {
    const country = resolveCountry(
      pickValue(row, ["国家", "country", "countryName", "国家名称"]),
      pickValue(row, ["countryId", "国家代码", "iso3", "ISO-3", "iso_3"]),
    );
    const regionId = resolveRegionId(
      pickValue(row, ["大区", "region", "regionName", "区域"]),
      country.defaultRegionId,
    );

    const code = toNullish(
      pickValue(row, ["code", "工区编码", "三字码", "编码", "职场三字码"]),
    );
    const name = toNullish(pickValue(row, ["name", "工区名称", "职场名称", "工区名"]));
    const cityRaw = toNullish(pickValue(row, ["city", "城市"]));
    const address = toNullish(
      pickValue(row, ["address", "地址", "职场地址"]),
    );
    const lng = toNumber(pickValue(row, ["lng", "longitude", "经度"]));
    const lat = toNumber(pickValue(row, ["lat", "latitude", "纬度"]));

    if (!code || !name || !cityRaw || !address || lng === null || lat === null) {
      throw new Error(`Missing required fields in row: ${JSON.stringify(row)}`);
    }
    let city = normalizeCity(cityRaw);
    if (city === "伦敦" && name.includes("Hylo")) {
      city = "London";
    }

    const current = countryCenters.get(country.id) ?? {
      lngSum: 0,
      latSum: 0,
      count: 0,
      regionId,
    };
    current.lngSum += lng;
    current.latSum += lat;
    current.count += 1;
    current.regionId = regionId;
    countryCenters.set(country.id, current);

    workspaceSeeds.push({
      code,
      name,
      countryId: country.id,
      province: toNullish(pickValue(row, ["province", "省份"])),
      city,
      district: toNullish(pickValue(row, ["district", "房产分区", "区域分区"])),
      address:
        toNullish(pickValue(row, ["address", "地址", "职场地址"])) ??
        address,
      buildingName: toNullish(
        pickValue(row, [
          "buildingName",
          "楼宇名称",
          "楼宇",
          "楼栋",
          "building",
        ]),
      ),
      floor: toNullish(pickValue(row, ["floor", "楼层", "电梯楼层"])),
      lng,
      lat,
      leaseStartDate: toIsoDate(
        pickValue(row, ["leaseStartDate", "租赁开始日期", "起租日期"]),
      ),
      deliveryDate: toIsoDate(
        pickValue(row, ["deliveryDate", "交付日期", "实际交付日期"]),
      ),
      moveInDate: toIsoDate(
        pickValue(row, ["moveInDate", "入驻日期", "搬入日期", "搬家入住日期"]),
      ),
      leaseEndDate: toIsoDate(
        pickValue(row, ["leaseEndDate", "租赁到期日期", "租赁结束日期", "退租日期"]),
      ),
      actualEndDate: toIsoDate(
        pickValue(row, ["actualEndDate", "实际结束日期", "实际退租日期"]),
      ),
      floorStatus: toNullish(pickValue(row, ["floorStatus", "楼层状态"])),
      status: toStatus(pickValue(row, ["status", "工区状态", "状态"])),
      seatCount:
        toNumber(pickValue(row, ["seatCount", "工位数", "座位数"])) ?? 0,
      allocatedSeats: toNumber(
        pickValue(row, [
          "allocatedSeats",
          "已分配工位",
          "已分配座位",
          "分配工位数(含共享)",
        ]),
      ),
      leasedAreaSqm: toNumber(
        pickValue(row, ["leasedAreaSqm", "租赁面积", "租赁面积(平方米)"]),
      ),
      decoratedAreaSqm: toNumber(
        pickValue(row, ["decoratedAreaSqm", "装修面积", "装修面积(平方米)"]),
      ),
      usableAreaSqm: toNumber(
        pickValue(row, [
          "usableAreaSqm",
          "可用面积",
          "使用面积",
          "使用面积(平方米)",
        ]),
      ),
      ownerName: toNullish(pickValue(row, ["ownerName", "业主姓名"])),
      ownerEmail: toNullish(pickValue(row, ["ownerEmail", "业主邮箱"])),
      description: toNullish(pickValue(row, ["description", "描述", "备注"])),
      tags: toTags(pickValue(row, ["tags", "标签"])),
    });
  }

  const distinctCountryCount = new Set(workspaceSeeds.map((item) => item.countryId)).size;
  if (distinctCountryCount !== 44) {
    throw new Error(`Expected 44 distinct countries, got ${distinctCountryCount}`);
  }
  if (workspaceSeeds.some((item) => !item.code)) {
    throw new Error("Found workspace with null code");
  }

  const regions = (Object.keys(REGION_META) as RegionId[]).map((id) => ({
    id,
    nameZh: REGION_META[id].nameZh,
    nameEn: REGION_META[id].nameEn,
  }));

  const countries = Array.from(countryCenters.entries())
    .map(([countryId, center]) => {
      const meta = countryById.get(countryId);
      if (!meta) throw new Error(`Missing country meta for ${countryId}`);
      return {
        id: meta.id,
        nameZh: meta.nameZh,
        nameEn: meta.nameEn,
        regionId: center.regionId,
        centerLng: Number((center.lngSum / center.count).toFixed(6)),
        centerLat: Number((center.latSum / center.count).toFixed(6)),
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  if (countries.length !== 44) {
    throw new Error(`Expected 44 countries in countries.json, got ${countries.length}`);
  }

  await writeFile(path.join(seedDir, "regions.json"), JSON.stringify(regions, null, 2) + "\n", "utf-8");
  await writeFile(path.join(seedDir, "countries.json"), JSON.stringify(countries, null, 2) + "\n", "utf-8");
  await writeFile(path.join(seedDir, "workspaces.json"), JSON.stringify(workspaceSeeds, null, 2) + "\n", "utf-8");

  console.log(`Loaded raw rows: ${rows.length}`);
  console.log(`Generated regions: ${regions.length}`);
  console.log(`Generated countries: ${countries.length}`);
  console.log(`Generated workspaces: ${workspaceSeeds.length}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
