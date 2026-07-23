import type { Announcement } from "@/types";

export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "AN-14",
    siteName: "Grant Sawyer Annex Market",
    siteType: "micro_market",
    hostAgency: "Grant Sawyer State Office Building",
    postedOn: "2026-07-15",
    closesOn: "2026-08-30",
    status: "open",
    applicants: 3,
    body: "A new micro market location is available at the Grant Sawyer Annex, 2nd floor. Licensed operators in good standing may apply. Submit a business plan, resume, and two letters of recommendation.",
  },
  {
    id: "AN-13",
    siteName: "Reno Federal Building Café",
    siteType: "cafe",
    hostAgency: "US GSA — Reno",
    postedOn: "2026-06-01",
    closesOn: "2026-07-01",
    status: "awarded",
    applicants: 5,
    body: "New café concession at the Reno Federal Building. Awarded following committee scoring.",
  },
  {
    id: "AN-12",
    siteName: "Southern NV Vending Route Expansion",
    siteType: "vending_route",
    hostAgency: "Multiple — Henderson complex",
    postedOn: "2026-05-10",
    closesOn: "2026-06-10",
    status: "closed",
    applicants: 2,
    body: "Route expansion covering three additional Henderson buildings.",
  },
];
