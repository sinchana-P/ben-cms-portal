import type { SiteAssignment } from "@/types";

/**
 * site_operator_assignments — the many-to-many join with history.
 * Moving an operator = set endDate on the current row + insert a new row.
 * One site can have several concurrent roles (Primary / Relief / Trainee);
 * only the Primary owns P&L and set-aside. One operator can hold ≤ 2 sites.
 */
export const ASSIGNMENTS: SiteAssignment[] = [
  // Courthouse Café (BEN-001) — Maria is Interim primary; history shows a prior operator
  { id: "A-101", siteId: "site-cafe-1", operatorId: "op-maria", role: "Primary", startDate: "2026-01-05", endDate: null, assignedBy: "BEO Ben Alvarez", operatorStatusAtSite: "Interim", notes: "Interim operatorship — month 7 of 12–18." },
  { id: "A-100", siteId: "site-cafe-1", operatorId: "op-linda", role: "Primary", startDate: "2017-03-01", endDate: "2025-12-20", assignedBy: "Chief K. Whitfield", operatorStatusAtSite: "Licensed", notes: "Transferred to Reno route (BEN-014)." },

  // DMV Micro Market (BEN-002) — Priya primary + a trainee alongside
  { id: "A-110", siteId: "site-mm-1", operatorId: "op-priya", role: "Primary", startDate: "2019-01-10", endDate: null, assignedBy: "BEO Ben Alvarez", operatorStatusAtSite: "Licensed" },
  { id: "A-111", siteId: "site-mm-1", operatorId: "op-applicant-1", role: "Trainee", startDate: "2026-06-01", endDate: null, assignedBy: "BEO Ben Alvarez", operatorStatusAtSite: "Interim", notes: "On-the-job training under Priya, not independently responsible." },

  // Sawyer Building Market (BEN-011) — Priya (her 2nd site)
  { id: "A-120", siteId: "site-mm-2", operatorId: "op-priya", role: "Primary", startDate: "2022-02-01", endDate: null, assignedBy: "Chief K. Whitfield", operatorStatusAtSite: "Licensed" },

  // Downtown Vending Route (BEN-005) — Darnell
  { id: "A-130", siteId: "site-vend-1", operatorId: "op-darnell", role: "Primary", startDate: "2018-05-20", endDate: null, assignedBy: "Chief K. Whitfield", operatorStatusAtSite: "Licensed" },

  // Gift Shop (BEN-009) — James (Interim)
  { id: "A-140", siteId: "site-gift-1", operatorId: "op-james", role: "Primary", startDate: "2024-09-01", endDate: null, assignedBy: "BEO Dana Cole", operatorStatusAtSite: "Interim" },

  // Capitol Café (BEN-004) + Reno route (BEN-014) — Linda holds 2 sites
  { id: "A-150", siteId: "site-cafe-2", operatorId: "op-linda", role: "Primary", startDate: "2015-08-15", endDate: null, assignedBy: "Chief K. Whitfield", operatorStatusAtSite: "Licensed" },
  { id: "A-160", siteId: "site-vend-2", operatorId: "op-linda", role: "Primary", startDate: "2026-01-01", endDate: null, assignedBy: "Chief K. Whitfield", operatorStatusAtSite: "Licensed" },

  // Henderson (BEN-018) — Robert, pending closure
  { id: "A-170", siteId: "site-mm-4", operatorId: "op-robert", role: "Primary", startDate: "2020-03-01", endDate: null, assignedBy: "BEO Dana Cole", operatorStatusAtSite: "Licensed" },
];

export function assignmentsForSite(siteId: string): SiteAssignment[] {
  return ASSIGNMENTS.filter((a) => a.siteId === siteId).sort((a, b) => (a.endDate ? 1 : -1) - (b.endDate ? 1 : -1));
}
export function currentAssignments(siteId: string): SiteAssignment[] {
  return ASSIGNMENTS.filter((a) => a.siteId === siteId && a.endDate === null);
}
export function assignmentsForOperator(operatorId: string): SiteAssignment[] {
  return ASSIGNMENTS.filter((a) => a.operatorId === operatorId);
}
export function primaryOperatorId(siteId: string): string | null {
  return currentAssignments(siteId).find((a) => a.role === "Primary")?.operatorId ?? null;
}
