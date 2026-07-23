import type { SiteReview } from "@/types";

/** Staff-initiated reviews → operator signs. Flow:
 *  staff_completed → sent_to_operator → operator_signed → finalised. */
export const SITE_REVIEWS: SiteReview[] = [
  { id: "R-501", siteId: "site-cafe-1", kind: "monthly", period: "June 2026", createdByBeo: "BEO Ben Alvarez", createdOn: "2026-06-12", score: 94, flowState: "finalised" },
  { id: "R-502", siteId: "site-cafe-1", kind: "monthly", period: "July 2026", createdByBeo: "BEO Ben Alvarez", createdOn: "2026-07-08", score: null, flowState: "sent_to_operator" },
  { id: "R-503", siteId: "site-cafe-1", kind: "annual", period: "SFY 2026", createdByBeo: "BEO Ben Alvarez", createdOn: "2026-06-30", score: 91, flowState: "finalised" },
  { id: "R-510", siteId: "site-mm-1", kind: "monthly", period: "July 2026", createdByBeo: "BEO Ben Alvarez", createdOn: "2026-07-09", score: null, flowState: "staff_completed" },
  { id: "R-520", siteId: "site-vend-1", kind: "monthly", period: "July 2026", createdByBeo: "BEO Ben Alvarez", createdOn: "2026-07-10", score: null, flowState: "sent_to_operator" },
];

export const REVIEW_FLOW_LABEL: Record<string, string> = {
  staff_completed: "Staff Completed",
  sent_to_operator: "Sent to Operator",
  operator_signed: "Operator Signed",
  finalised: "Finalised",
};

export const REVIEW_FLOW_ORDER = ["staff_completed", "sent_to_operator", "operator_signed", "finalised"] as const;

export function reviewsForSite(siteId: string): SiteReview[] {
  return SITE_REVIEWS.filter((r) => r.siteId === siteId);
}
