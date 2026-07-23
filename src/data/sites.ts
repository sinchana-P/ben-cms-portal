import type { Site, SiteType, SitePlRow } from "@/types";

export const SITE_TYPE_LABEL: Record<SiteType, string> = {
  cafe: "Cafeteria",
  gift_shop: "Gift Shop",
  micro_market: "Micro Market",
  vending_route: "Vending Route",
};

export const SITE_STATUS_LABEL: Record<string, string> = {
  active: "Active",
  onboarding: "Onboarding",
  open: "Open — No Operator",
  pending_closure: "Pending Closure",
  closed: "Closed",
};

/** Representative set of the program's 22 sites, covering all four types,
 *  plus an unassigned "open" site and a "pending closure" site. */
export const SITES: Site[] = [
  {
    id: "site-cafe-1", benId: "BEN-001", name: "Courthouse Café", code: "CAF-01", type: "cafe",
    hostAgency: "Clark County Courthouse", hostAgencyType: "County Government",
    hostContact: "James Walker", hostEmail: "facilities@clarkcountynv.gov",
    contractStart: "2024-01-01", contractEnd: "2026-12-31",
    address: "200 Lewis Ave", city: "Las Vegas", county: "Clark", building: "Courthouse Main", floor: "Ground Floor",
    operatorId: "op-maria", status: "active", openedOn: "2017-03-01", contractOnFile: true,
    setAsidePct: 6.5, monthlyRevenue: 18420, plStatus: "submitted",
  },
  {
    id: "site-cafe-2", benId: "BEN-004", name: "Capitol Grounds Café", code: "CAF-02", type: "cafe",
    hostAgency: "NV State Capitol", hostAgencyType: "State Agency",
    hostContact: "Dena Ruiz", hostEmail: "facilities@admin.nv.gov",
    contractStart: "2023-07-01", contractEnd: "2027-06-30",
    address: "101 N Carson St", city: "Carson City", county: "Carson City", building: "Capitol Annex", floor: "1st Floor",
    operatorId: "op-linda", status: "active", openedOn: "2015-08-15", contractOnFile: true,
    setAsidePct: 6.5, monthlyRevenue: 14980, plStatus: "approved",
  },
  {
    id: "site-gift-1", benId: "BEN-009", name: "NHP HQ Gift Shop", code: "GFT-01", type: "gift_shop",
    hostAgency: "Nevada Highway Patrol HQ", hostAgencyType: "State Agency",
    hostContact: "Marcus Reed", hostEmail: "admin@nhp.nv.gov",
    contractStart: "2021-06-01", contractEnd: "2026-05-31",
    address: "555 Wright Way", city: "Carson City", county: "Carson City", building: "NHP Headquarters", floor: "Lobby",
    operatorId: "op-james", status: "active", openedOn: "2021-06-01", contractOnFile: true,
    setAsidePct: 6.0, monthlyRevenue: 9240, plStatus: "overdue",
  },
  {
    id: "site-mm-1", benId: "BEN-002", name: "DMV Las Vegas Micro Market", code: "MMK-01", type: "micro_market",
    hostAgency: "NV DMV — Sahara", hostAgencyType: "State Agency",
    hostContact: "Angela Pruitt", hostEmail: "facilities@dmv.nv.gov",
    contractStart: "2024-02-01", contractEnd: "2027-01-31",
    address: "8250 W Flamingo Rd", city: "Las Vegas", county: "Clark", building: "DMV Sahara", floor: "Ground Floor",
    operatorId: "op-priya", status: "active", openedOn: "2019-01-10", contractOnFile: true,
    setAsidePct: 6.5, monthlyRevenue: 11120, plStatus: "due",
  },
  {
    id: "site-mm-2", benId: "BEN-011", name: "Sawyer Building Market", code: "MMK-02", type: "micro_market",
    hostAgency: "Grant Sawyer State Office Bldg", hostAgencyType: "State Agency",
    hostContact: "Angela Pruitt", hostEmail: "facilities@admin.nv.gov",
    contractStart: "2022-02-01", contractEnd: "2027-01-31",
    address: "555 E Washington Ave", city: "Las Vegas", county: "Clark", building: "Grant Sawyer", floor: "1st Floor",
    operatorId: "op-priya", status: "active", openedOn: "2022-02-01", contractOnFile: true,
    setAsidePct: 6.5, monthlyRevenue: 8760, plStatus: "submitted",
  },
  {
    id: "site-vend-1", benId: "BEN-005", name: "Clark County / Henderson Route", code: "VND-01", type: "vending_route",
    hostAgency: "Multiple — LV Downtown Complex", hostAgencyType: "County Government",
    hostContact: "Route Coordinator", hostEmail: "vending@clarkcountynv.gov",
    contractStart: "2023-01-01", contractEnd: "2026-12-31",
    address: "Route — 6 buildings", city: "Las Vegas", county: "Clark", building: "Multiple", floor: "—",
    operatorId: "op-darnell", status: "active", openedOn: "2018-05-20", contractOnFile: true,
    setAsidePct: 6.0, monthlyRevenue: 22300, plStatus: "submitted",
    routeStops: [
      { building: "Regional Justice Center", address: "200 Lewis Ave", county: "Clark" },
      { building: "Clark County Gov Center", address: "500 S Grand Central Pkwy", county: "Clark" },
      { building: "Henderson City Hall", address: "240 Water St", county: "Clark" },
    ],
  },
  {
    id: "site-vend-2", benId: "BEN-014", name: "Reno Complex Route", code: "VND-02", type: "vending_route",
    hostAgency: "Multiple — Reno State Offices", hostAgencyType: "State Agency",
    hostContact: "Route Coordinator", hostEmail: "vending@admin.nv.gov",
    contractStart: "2022-10-01", contractEnd: "2026-09-30",
    address: "Route — 4 buildings", city: "Reno", county: "Washoe", building: "Multiple", floor: "—",
    operatorId: "op-linda", status: "active", openedOn: "2016-11-01", contractOnFile: true,
    setAsidePct: 6.0, monthlyRevenue: 16850, plStatus: "submitted",
    routeStops: [
      { building: "Nevada State Bldg — Reno", address: "1325 Corporate Blvd", county: "Washoe" },
      { building: "Washoe County Complex", address: "1001 E 9th St", county: "Washoe" },
    ],
  },
  {
    id: "site-mm-4", benId: "BEN-018", name: "Henderson City Hall Micro Market", code: "MMK-04", type: "micro_market",
    hostAgency: "City of Henderson", hostAgencyType: "City Government",
    hostContact: "Public Works", hostEmail: "facilities@cityofhenderson.com",
    contractStart: "2020-03-01", contractEnd: "2026-02-28",
    address: "240 Water St", city: "Henderson", county: "Clark", building: "City Hall", floor: "2nd Floor",
    operatorId: "op-robert", status: "pending_closure", openedOn: "2020-03-01", contractOnFile: true,
    setAsidePct: 6.0, monthlyRevenue: 6100, plStatus: "submitted",
  },
  {
    id: "site-mm-3", benId: "BEN-021", name: "Reno Federal Building Micro Market", code: "MMK-03", type: "micro_market",
    hostAgency: "US GSA — Reno", hostAgencyType: "Federal Building (GSA)",
    hostContact: "GSA Property Mgr", hostEmail: "pm@gsa.gov",
    contractStart: null, contractEnd: null,
    address: "300 Booth St", city: "Reno", county: "Washoe", building: "Federal Building", floor: "Ground Floor",
    operatorId: null, status: "open", openedOn: "2026-07-01", contractOnFile: false,
    setAsidePct: 6.5, monthlyRevenue: 0, plStatus: "none",
  },
];

export function siteById(id: string | null): Site | undefined {
  if (!id) return undefined;
  return SITES.find((s) => s.id === id);
}
export function siteByBenId(benId: string): Site | undefined {
  return SITES.find((s) => s.benId === benId);
}

/** Sample per-site P&L history (set-aside computed on NET profit). */
export function plHistoryForSite(siteId: string): SitePlRow[] {
  const s = siteById(siteId);
  const pct = (s?.setAsidePct ?? 6.5) / 100;
  const base = s?.monthlyRevenue ?? 12000;
  const months = ["Jul 2026", "Jun 2026", "May 2026", "Apr 2026", "Mar 2026", "Feb 2026"];
  return months.map((m, i) => {
    const gross = Math.round(base * (0.9 + (i % 3) * 0.08));
    const net = Math.round(gross * 0.68);
    const setAside = Math.round(net * pct);
    const status = i === 0 ? (s?.plStatus === "overdue" ? "overdue" : "due") : "approved";
    return {
      month: m,
      status: status as SitePlRow["status"],
      grossRevenue: gross,
      netProfit: net,
      setAside,
      payment: i === 0 ? (status === "overdue" ? "due" : "pending") : "paid",
    };
  });
}

/** Program totals (full program is larger than the representative sample above). */
export const PROGRAM_STATS = {
  totalSites: 22,
  cafes: 4,
  giftShops: 2,
  microMarkets: 9,
  vendingRoutes: 7,
  activeOperators: 18,
  staff: 8,
  equipmentItems: 1035,
  legacyFiles: 10000,
  yearsOfHistory: 13,
};
