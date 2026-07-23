import type { SiteApplication, ApplicationStage } from "@/types";

/** Simplified new-site applications (no numeric ranking — eligibility is a
 *  staff judgement). Pipeline: submitted → BEO review → Chief interview →
 *  decision → assignment. */
export const APPLICATION_STAGES: { key: ApplicationStage; label: string }[] = [
  { key: "submitted", label: "Application Submitted" },
  { key: "beo_review", label: "BEO Review" },
  { key: "chief_interview", label: "Chief Interview" },
  { key: "decision", label: "Decision" },
  { key: "assignment", label: "Site Assignment" },
];

export const APPLICATIONS: SiteApplication[] = [
  { id: "APP-301", announcementId: "AN-14", siteName: "Reno Federal Building Micro Market (BEN-021)", operatorId: "op-priya", submittedOn: "2026-07-18", stage: "chief_interview", outcome: "in_progress" },
  { id: "APP-290", announcementId: "AN-13", siteName: "Reno Federal Building Café (BEN-013)", operatorId: "op-maria", submittedOn: "2026-06-05", stage: "assignment", outcome: "awarded" },
  { id: "APP-275", announcementId: "AN-12", siteName: "Southern NV Vending Route Expansion", operatorId: "op-darnell", submittedOn: "2026-05-12", stage: "decision", outcome: "declined" },
];

export function applicationsForOperator(operatorId: string): SiteApplication[] {
  return APPLICATIONS.filter((a) => a.operatorId === operatorId);
}
