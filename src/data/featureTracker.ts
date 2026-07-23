import type { TrackerItem } from "@/types";

/** Mirrors the internal BEN Feature Tracker so the whole RFP scope is visible
 *  inside the product itself. Presentation factors: Accessibility (#1, 500 pts)
 *  and BEN Forms & Workflows (#2, 400 pts). */
export const TRACKER: TrackerItem[] = [
  { id: "AX-1", area: "Accessibility", requirement: "Screen-reader support (JAWS / NVDA) across operator workflows", ref: "Req5/Q37", status: "Gap", buildType: "Build", priority: "P1", notes: "Operator portal + new features" },
  { id: "AX-2", area: "Accessibility", requirement: "Keyboard-only operation of all primary workflows", ref: "Req5", status: "Partial", buildType: "Build", priority: "P1" },
  { id: "AX-3", area: "Accessibility", requirement: "Dark background / light font", ref: "Req5/Q37", status: "Have", buildType: "Native", priority: "P1", notes: "Default operator theme" },
  { id: "AX-4", area: "Accessibility", requirement: "200% zoom, magnification, visible focus, non-color status", ref: "Req5", status: "Partial", buildType: "Build", priority: "P1" },
  { id: "AX-5", area: "Accessibility", requirement: "WCAG 2.1 AA conformance + VPAT/ACR evidence", ref: "Req5", status: "Gap", buildType: "Build+Ops", priority: "P1", notes: "Audit + 2-operator + DETR test (Q37)" },

  { id: "OP-1", area: "Operator Portal", requirement: "Client login redirected to operator portal", ref: "Q34/roles", status: "Gap", buildType: "Build", priority: "P1" },
  { id: "OP-2", area: "Operator Portal", requirement: "Operator sees data ONLY for their sites (server-side scoping)", ref: "Q34", status: "Partial", buildType: "Build", priority: "P1" },
  { id: "OP-3", area: "Operator Portal", requirement: "Operator creates BEN-form cases from the portal", ref: "Req/Q23", status: "Partial", buildType: "Config", priority: "P1" },
  { id: "OP-4", area: "Operator Portal", requirement: "Site-wise equipment list (read + open ticket)", ref: "Q31/Q47", status: "Gap", buildType: "Build", priority: "P1" },
  { id: "OP-5", area: "Operator Portal", requirement: "Open R&M service tickets; see status", ref: "Q31", status: "Gap", buildType: "Build", priority: "P1" },
  { id: "OP-6", area: "Operator Portal", requirement: "View own submissions & status, upload documents", ref: "Req", status: "Partial", buildType: "Config", priority: "P2" },

  { id: "ST-1", area: "Sites & Operators", requirement: "Site/Location entity (café / gift shop / micro market / vending route)", ref: "Q44/Q51", status: "Gap", buildType: "Build", priority: "P1" },
  { id: "ST-2", area: "Sites & Operators", requirement: "Operator-to-site assignment (max 2 sites per operator)", ref: "Q44/Q50", status: "Gap", buildType: "Build", priority: "P1" },

  { id: "FM-1", area: "BEN Forms", requirement: "P&L Monthly Statement with categories + computed totals", ref: "Req/Q40", status: "Partial", buildType: "Config", priority: "P1" },
  { id: "FM-2", area: "BEN Forms", requirement: "Request to Purchase Equipment", ref: "Req", status: "Partial", buildType: "Config", priority: "P1" },
  { id: "FM-3", area: "BEN Forms", requirement: "Monthly / Annual Site Review", ref: "Req", status: "Partial", buildType: "Config", priority: "P2" },
  { id: "FM-4", area: "BEN Forms", requirement: "Health Insurance Enrollment + Reimbursement", ref: "Req/Q3", status: "Partial", buildType: "Config", priority: "P2" },
  { id: "FM-5", area: "BEN Forms", requirement: "Loan Application (startup costs)", ref: "Req/Q4", status: "Partial", buildType: "Config", priority: "P2" },
  { id: "FM-6", area: "BEN Forms", requirement: "Request for Prior Approval of Expenses", ref: "Req", status: "Partial", buildType: "Config", priority: "P2" },
  { id: "FM-7", area: "BEN Forms", requirement: "Equipment Maintenance Log (ties to equipment)", ref: "Req", status: "Partial", buildType: "Config", priority: "P2" },
  { id: "FM-8", area: "BEN Forms", requirement: "Site Daily Throw Log (one per site per month)", ref: "Req/Q9/Q45", status: "Partial", buildType: "Config", priority: "P2" },
  { id: "FM-9", area: "BEN Forms", requirement: "Uniform approval workflow (every site & operator)", ref: "Q41", status: "Partial", buildType: "Config", priority: "P1" },

  { id: "EQ-1", area: "Equipment", requirement: "Equipment entity (mfr, model, tag, price, photos, invoice)", ref: "Q47/Q5", status: "Gap", buildType: "Build", priority: "P1" },
  { id: "EQ-2", area: "Equipment", requirement: "Equipment list + detail UI (staff)", ref: "Req", status: "Gap", buildType: "Build", priority: "P1" },
  { id: "EQ-3", area: "Equipment", requirement: "Equipment linked to site & assigned operator", ref: "Req", status: "Gap", buildType: "Build", priority: "P1" },
  { id: "EQ-4", area: "Equipment", requirement: "Bulk import of 1,035 Sortly records", ref: "Q5/Q15", status: "Gap", buildType: "Build", priority: "P2" },

  { id: "SR-1", area: "Ticketing", requirement: "Maintenance ticket entity (type, description, date, status)", ref: "Req/Q31", status: "Gap", buildType: "Build", priority: "P1" },
  { id: "SR-2", area: "Ticketing", requirement: "Operator opens ticket; staff manages full lifecycle", ref: "Q31", status: "Gap", buildType: "Build", priority: "P1" },
  { id: "SR-3", area: "Ticketing", requirement: "Route to approver, notify, reschedule", ref: "Req", status: "Partial", buildType: "Config", priority: "P2" },

  { id: "RP-1", area: "Reporting", requirement: "Report builder + export to PDF / Excel", ref: "Req", status: "Have", buildType: "Native", priority: "P1" },
  { id: "RP-2", area: "Reporting", requirement: "Fiscal-calendar reporting (SFY / FFY / CY), by site + program", ref: "Q36", status: "Gap", buildType: "Build", priority: "P1" },
  { id: "RP-3", area: "Reporting", requirement: "BEN report set over the new data", ref: "Req", status: "Partial", buildType: "Config", priority: "P2" },

  { id: "PY-1", area: "Payments", requirement: "Credit/Debit + ACH (State Treasurer / CyberSource)", ref: "Req/Q2/Q58", status: "Gap", buildType: "Build/Integrate", priority: "P2" },
  { id: "PY-2", area: "Payments", requirement: "Payment notifications (success / failure / reminder)", ref: "Req", status: "Gap", buildType: "Build", priority: "P3" },

  { id: "BR-1", area: "Branding", requirement: "Logo-based header banner + footer", ref: "Req", status: "Gap", buildType: "Build", priority: "P2" },
  { id: "BR-2", area: "Branding", requirement: "7-slot color theme (Heading, Sub-Heading, Highlight, Accent, Auxiliary, Primary, Secondary Text)", ref: "Req", status: "Gap", buildType: "Build", priority: "P2", notes: "Must pass WCAG contrast" },

  { id: "NS-1", area: "Announcements", requirement: "New-site announcements on landing page", ref: "Req", status: "Gap", buildType: "Build", priority: "P3" },
  { id: "NS-2", area: "Announcements", requirement: "Operator application for new site + approval", ref: "Req", status: "Partial", buildType: "Config", priority: "P3" },

  { id: "SE-1", area: "Security", requirement: "MFA (username + password + OTP)", ref: "Req5", status: "Have", buildType: "Native", priority: "P1" },
  { id: "SE-2", area: "Security", requirement: "Active Directory SSO (SAML)", ref: "Q7/Q48", status: "Have", buildType: "Native", priority: "P2" },
  { id: "SE-3", area: "Security", requirement: "Row-level operator isolation (only own sites)", ref: "Q34", status: "Partial", buildType: "Config", priority: "P1" },
  { id: "SE-4", area: "Security", requirement: "Audit trail (timestamps, user actions)", ref: "Req", status: "Have", buildType: "Native", priority: "P1" },
  { id: "SE-5", area: "Security", requirement: "Document storage (types, size, virus scan, versioning, purge)", ref: "Q38", status: "Partial", buildType: "Config+Build", priority: "P2" },
  { id: "SE-6", area: "Infrastructure", requirement: "FedRAMP Moderate CSP + US-only residency + NIST 800-53B", ref: "Req5", status: "Gap", buildType: "Ops", priority: "P1", notes: "Azure Gov / GovCloud — long lead" },
  { id: "SE-7", area: "Infrastructure", requirement: "DR: RPO 4 hours", ref: "Q19", status: "Partial", buildType: "Ops", priority: "P2" },

  { id: "NT-1", area: "Notifications", requirement: "Email + in-application notifications (RFP minimum)", ref: "Q33", status: "Have", buildType: "Native", priority: "P1" },
  { id: "NT-2", area: "Notifications", requirement: "SMS notifications (optional — not the stated minimum)", ref: "Req", status: "Partial", buildType: "Build", priority: "P3" },
];

export const TRACKER_SUMMARY = {
  have: TRACKER.filter((t) => t.status === "Have").length,
  partial: TRACKER.filter((t) => t.status === "Partial").length,
  gap: TRACKER.filter((t) => t.status === "Gap").length,
  total: TRACKER.length,
};
