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
  // AN-14 — Grant Sawyer Annex Market (open, 3 applicants) — staff review queue
  { id: "APP-401", announcementId: "AN-14", siteName: "Grant Sawyer Annex Market (BEN-021)", operatorId: "op-priya", applicantName: "Priya Nair", submittedOn: "2026-07-18", stage: "chief_interview", outcome: "in_progress", narrative: "Experienced micro-market operator seeking a second market in the same complex for operational efficiency.", docs: { businessPlan: true, resume: true, letters: 2 }, scoringSheet: true },
  { id: "APP-402", announcementId: "AN-14", siteName: "Grant Sawyer Annex Market (BEN-021)", operatorId: "op-applicant-1", applicantName: "Terrence Boyd", submittedOn: "2026-07-20", stage: "beo_review", outcome: "in_progress", narrative: "New licensee (interim) ready to take on a first independent site.", docs: { businessPlan: true, resume: true, letters: 3 } },
  { id: "APP-403", announcementId: "AN-14", siteName: "Grant Sawyer Annex Market (BEN-021)", operatorId: "op-james", applicantName: "James Okonkwo", submittedOn: "2026-07-22", stage: "submitted", outcome: "in_progress", narrative: "Gift-shop operator interested in diversifying into a micro market.", docs: { businessPlan: true, resume: false, letters: 1 } },
  // AN-15
  { id: "APP-410", announcementId: "AN-15", siteName: "Reno Federal Building Micro Market", operatorId: "op-linda", applicantName: "Linda Cho", submittedOn: "2026-07-25", stage: "submitted", outcome: "in_progress", docs: { businessPlan: true, resume: true, letters: 2 } },
  // Historical
  { id: "APP-290", announcementId: "AN-13", siteName: "Reno Federal Building Café (BEN-013)", operatorId: "op-maria", applicantName: "Maria Delgado", submittedOn: "2026-06-05", stage: "assignment", outcome: "awarded", docs: { businessPlan: true, resume: true, letters: 3 }, scoringSheet: true, awardLetter: true },
  { id: "APP-275", announcementId: "AN-12", siteName: "Southern NV Vending Route Expansion", operatorId: "op-darnell", applicantName: "Darnell Price", submittedOn: "2026-05-12", stage: "decision", outcome: "declined", docs: { businessPlan: true, resume: true, letters: 1 }, scoringSheet: true },
];

export function applicationsForOperator(operatorId: string): SiteApplication[] {
  return APPLICATIONS.filter((a) => a.operatorId === operatorId);
}
export function applicationsForAnnouncement(announcementId: string): SiteApplication[] {
  return APPLICATIONS.filter((a) => a.announcementId === announcementId);
}
