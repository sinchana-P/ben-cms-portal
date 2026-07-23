import type { Equipment } from "@/types";

/** Representative equipment (program has 1,035 items migrated from Sortly). */
export const EQUIPMENT: Equipment[] = [
  {
    id: "EQ-0087", tagId: "BEN-0087", name: "Espresso Machine", category: "Coffee Equipment",
    manufacturer: "La Marzocco", model: "Linea PB 2-Group", serial: "LM-88231",
    purchasedOn: "2021-04-12", vendor: "Nevada Restaurant Supply", price: 8200,
    warrantyUntil: "2026-04-12", siteId: "site-cafe-1", operatorId: "op-maria",
    status: "maintenance", hasPhoto: true,
    locationHistory: [{ siteId: "site-cafe-1", movedOn: "2021-04-12", reason: "Initial placement" }],
  },
  {
    id: "EQ-0088", tagId: "BEN-0088", name: "Reach-in Refrigerator", category: "Refrigeration",
    manufacturer: "True", model: "T-49", serial: "TR-49-2201",
    purchasedOn: "2020-09-01", vendor: "Nevada Restaurant Supply", price: 3400,
    warrantyUntil: "2025-09-01", siteId: "site-cafe-1", operatorId: "op-maria",
    status: "in_service", hasPhoto: true,
    locationHistory: [{ siteId: "site-cafe-1", movedOn: "2020-09-01", reason: "Initial placement" }],
  },
  {
    id: "EQ-0231", tagId: "BEN-0231", name: "Snack Vending Machine", category: "Vending Machine",
    manufacturer: "Crane", model: "Merchant 6", serial: "CR-M6-5521",
    purchasedOn: "2019-02-15", vendor: "Crane Merchandising", price: 4100,
    warrantyUntil: "2024-02-15", siteId: "site-vend-1", operatorId: "op-darnell",
    status: "maintenance", hasPhoto: true,
    locationHistory: [
      { siteId: "site-vend-2", movedOn: "2019-02-15", reason: "Initial placement" },
      { siteId: "site-vend-1", movedOn: "2023-06-10", reason: "Route rebalancing — moved to Downtown" },
    ],
  },
  {
    id: "EQ-0232", tagId: "BEN-0232", name: "Beverage Vending Machine", category: "Vending Machine",
    manufacturer: "Dixie-Narco", model: "5591", serial: "DN-5591-8890",
    purchasedOn: "2018-07-20", vendor: "Crane Merchandising", price: 3800,
    warrantyUntil: "2023-07-20", siteId: "site-vend-1", operatorId: "op-darnell",
    status: "in_service", hasPhoto: false,
    locationHistory: [{ siteId: "site-vend-1", movedOn: "2018-07-20", reason: "Initial placement" }],
  },
  {
    id: "EQ-0450", tagId: "BEN-0450", name: "Glass-door Cooler", category: "Refrigeration",
    manufacturer: "True", model: "GDM-49", serial: "TG-49-1180",
    purchasedOn: "2022-03-01", vendor: "Restaurant Depot", price: 2900,
    warrantyUntil: "2027-03-01", siteId: "site-mm-1", operatorId: "op-priya",
    status: "in_service", hasPhoto: true,
    locationHistory: [{ siteId: "site-mm-1", movedOn: "2022-03-01", reason: "Initial placement" }],
  },
  {
    id: "EQ-0451", tagId: "BEN-0451", name: "Self-checkout Kiosk", category: "POS / IT",
    manufacturer: "365 Retail", model: "MicroMarket Kiosk v4", serial: "365-4-2231",
    purchasedOn: "2022-03-01", vendor: "365 Retail Markets", price: 5600,
    warrantyUntil: "2027-03-01", siteId: "site-mm-1", operatorId: "op-priya",
    status: "in_service", hasPhoto: true,
    locationHistory: [{ siteId: "site-mm-1", movedOn: "2022-03-01", reason: "Initial placement" }],
  },
  {
    id: "EQ-0512", tagId: "BEN-0512", name: "Display Shelving Unit", category: "Fixtures",
    manufacturer: "Lozier", model: "Gondola 4ft", serial: "LZ-4-7781",
    purchasedOn: "2021-06-05", vendor: "Store Fixtures Inc", price: 620,
    warrantyUntil: "2024-06-05", siteId: "site-gift-1", operatorId: "op-james",
    status: "in_service", hasPhoto: false,
    locationHistory: [{ siteId: "site-gift-1", movedOn: "2021-06-05", reason: "Initial placement" }],
  },
  {
    id: "EQ-0600", tagId: "BEN-0600", name: "Chest Freezer", category: "Refrigeration",
    manufacturer: "Frigidaire", model: "FFFC15M4TW", serial: "FR-15-9902",
    purchasedOn: "2023-01-15", vendor: "Restaurant Depot", price: 780,
    warrantyUntil: "2028-01-15", siteId: "site-mm-2", operatorId: "op-priya",
    status: "storage", hasPhoto: false,
    locationHistory: [{ siteId: "site-mm-2", movedOn: "2023-01-15", reason: "Initial placement" }],
  },
];

export const EQUIPMENT_STATUS_LABEL: Record<Equipment["status"], string> = {
  in_service: "In Service",
  maintenance: "In Maintenance",
  storage: "In Storage",
  retired: "Retired",
};

export function equipmentForSites(siteIds: string[]): Equipment[] {
  return EQUIPMENT.filter((e) => siteIds.includes(e.siteId));
}
export function equipmentById(id: string): Equipment | undefined {
  return EQUIPMENT.find((e) => e.id === id);
}
