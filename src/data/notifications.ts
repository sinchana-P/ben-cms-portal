import type { Notification } from "@/types";

export const NOTIFICATIONS: Notification[] = [
  { id: "N-1", forRole: ["beo"], icon: "inbox", kind: "approval", title: "P&L awaiting your review", body: "Maria Delgado submitted the August P&L for Courthouse Café.", at: "2026-08-18T14:22:00", read: false },
  { id: "N-2", forRole: ["chief"], icon: "inbox", kind: "approval", title: "Loan application awaiting final approval", body: "James Okonkwo — $8,000 startup stock (BEO recommended).", at: "2026-08-15T14:01:00", read: false },
  { id: "N-3", forRole: ["operator"], forOperatorId: "op-maria", icon: "check", kind: "review", title: "Your P&L is under BEO review", body: "August P&L submitted — under review by Ben Alvarez.", at: "2026-08-18T14:22:05", read: false },
  { id: "N-4", forRole: ["operator"], forOperatorId: "op-priya", icon: "dollar", kind: "payment", title: "Set-aside payment received", body: "Your $74 set-aside for Sawyer Building Market was received. Thank you.", at: "2026-08-17T13:30:00", read: true },
  { id: "N-5", forRole: ["operator"], forOperatorId: "op-darnell", icon: "wrench", kind: "ticket", title: "Vendor assigned to your ticket", body: "Crane Field Service assigned to Machine #4 — technician on site.", at: "2026-08-14T10:00:00", read: false },
  { id: "N-6", forRole: ["operator"], forOperatorId: "op-darnell", icon: "signature", kind: "review", title: "Site review needs your signature", body: "Your Downtown Route monthly review is ready to acknowledge & sign.", at: "2026-08-11T13:00:05", read: false },
  { id: "N-7", forRole: ["operator", "beo", "chief", "fiscal", "admin"], icon: "megaphone", kind: "broadcast", title: "Reminder: August P&L due the 20th", body: "All operators — please submit August P&L statements by the 20th.", at: "2026-08-14T08:00:00", read: true },
  { id: "N-8", forRole: ["fiscal"], icon: "alert", kind: "payment", title: "Failed set-aside payment", body: "Darnell Price — $268 ACH failed. Reminder re-sent to operator.", at: "2026-08-20T11:05:00", read: false },
];
