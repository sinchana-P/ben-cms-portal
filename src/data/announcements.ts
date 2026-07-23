import type { Announcement } from "@/types";

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "AN-14",
    siteName: "Grant Sawyer Annex Market",
    siteType: "micro_market",
    hostAgency: "Grant Sawyer State Office Building",
    county: "Clark",
    postedOn: "2026-07-15",
    closesOn: "2026-08-30",
    status: "open",
    applicants: 3,
    estimatedAnnual: 96000,
    body: "A new micro market location is available at the Grant Sawyer Annex, 2nd floor. Licensed operators in good standing may apply. Submit a business plan, resume, and two letters of recommendation.",
  },
  {
    id: "AN-15",
    siteName: "Reno Federal Building Micro Market",
    siteType: "micro_market",
    hostAgency: "US GSA — Reno",
    county: "Washoe",
    postedOn: "2026-07-20",
    closesOn: "2026-09-05",
    status: "open",
    applicants: 1,
    estimatedAnnual: 78000,
    body: "Ground-floor micro market in the Reno Federal Building. GSA host agency. Applications open to licensed and interim operators.",
  },
  {
    id: "AN-13",
    siteName: "Reno Federal Building Café",
    siteType: "cafe",
    hostAgency: "US GSA — Reno",
    county: "Washoe",
    postedOn: "2026-06-01",
    closesOn: "2026-07-01",
    status: "awarded",
    applicants: 5,
    estimatedAnnual: 210000,
    body: "New café concession at the Reno Federal Building. Awarded following committee review.",
  },
  {
    id: "AN-12",
    siteName: "Southern NV Vending Route Expansion",
    siteType: "vending_route",
    hostAgency: "Multiple — Henderson complex",
    county: "Clark",
    postedOn: "2026-05-10",
    closesOn: "2026-06-10",
    status: "closed",
    applicants: 2,
    estimatedAnnual: 140000,
    body: "Route expansion covering three additional Henderson buildings.",
  },
];

export function announcementById(id: string): Announcement | undefined {
  return ANNOUNCEMENTS.find((a) => a.id === id);
}
