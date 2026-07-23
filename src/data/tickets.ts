import type { Ticket, TicketState } from "@/types";

export const TICKET_STATE_LABEL: Record<TicketState, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  assigned: "Assigned",
  in_progress: "In Progress",
  resolved: "Resolved",
  rescheduled: "Rescheduled",
};

export const TICKET_LIFECYCLE: TicketState[] = [
  "submitted",
  "under_review",
  "assigned",
  "in_progress",
  "resolved",
];

export const TICKETS: Ticket[] = [
  {
    id: "T-3012",
    equipmentId: "EQ-0087",
    siteId: "site-cafe-1",
    operatorId: "op-maria",
    type: "corrective",
    summary: "Espresso machine not reaching temperature",
    description: "Group head not heating; drinks coming out lukewarm since this morning.",
    requestedDate: "2026-08-19",
    state: "assigned",
    vendor: "Sierra Coffee Service",
    assignedBeoId: "beo-1",
    openedOn: "2026-08-18T08:05:00",
    timeline: [
      { state: "submitted", actor: "Maria Delgado", at: "2026-08-18T08:05:00", note: "Opened ticket" },
      { state: "under_review", actor: "Ben Alvarez", at: "2026-08-18T09:10:00" },
      { state: "assigned", actor: "Ben Alvarez", at: "2026-08-18T09:40:00", note: "Assigned Sierra Coffee Service — scheduled Aug 19" },
    ],
  },
  {
    id: "T-3009",
    equipmentId: "EQ-0231",
    siteId: "site-vend-1",
    operatorId: "op-darnell",
    type: "corrective",
    summary: "Machine #4 dispensing intermittently",
    description: "Coil motor sticks; ~1 in 5 vends fail. Flagged in monthly site review.",
    requestedDate: "2026-08-15",
    state: "in_progress",
    vendor: "Crane Field Service",
    assignedBeoId: "beo-1",
    openedOn: "2026-08-12T14:30:00",
    timeline: [
      { state: "submitted", actor: "Darnell Price", at: "2026-08-12T14:30:00" },
      { state: "under_review", actor: "Ben Alvarez", at: "2026-08-12T16:00:00" },
      { state: "assigned", actor: "Ben Alvarez", at: "2026-08-13T08:00:00", note: "Crane Field Service assigned" },
      { state: "in_progress", actor: "Crane Field Service", at: "2026-08-14T10:00:00", note: "Technician on site, replacing coil motor" },
    ],
  },
  {
    id: "T-2998",
    equipmentId: "EQ-0450",
    siteId: "site-mm-1",
    operatorId: "op-priya",
    type: "preventive",
    summary: "Quarterly cooler gasket & coil cleaning",
    description: "Scheduled preventive maintenance on display cooler.",
    requestedDate: "2026-08-05",
    state: "resolved",
    vendor: "CoolTech Refrigeration",
    assignedBeoId: "beo-1",
    openedOn: "2026-07-28T11:00:00",
    timeline: [
      { state: "submitted", actor: "Priya Nair", at: "2026-07-28T11:00:00" },
      { state: "under_review", actor: "Ben Alvarez", at: "2026-07-29T09:00:00" },
      { state: "assigned", actor: "Ben Alvarez", at: "2026-07-30T09:00:00" },
      { state: "in_progress", actor: "CoolTech Refrigeration", at: "2026-08-05T13:00:00" },
      { state: "resolved", actor: "Ben Alvarez", at: "2026-08-05T16:30:00", note: "Completed — gaskets cleaned, coils clear. Cost $140." },
    ],
  },
];

export function ticketsForSites(siteIds: string[]): Ticket[] {
  return TICKETS.filter((t) => siteIds.includes(t.siteId));
}
