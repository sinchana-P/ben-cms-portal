/* ============================================================
   BEN Case Management — Domain Types
   ============================================================ */

export type Portal = "staff" | "operator";

export type Role = "chief" | "beo" | "fiscal" | "admin" | "operator";

export type SiteType = "cafe" | "gift_shop" | "micro_market" | "vending_route";

export type Persona = {
  id: string;
  name: string;
  role: Role;
  portal: Portal;
  title: string;
  email: string;
  /** operators only: the site ids they operate (max 2) */
  siteIds?: string[];
  authMethod: "AD SSO (SAML)" | "MFA (username + password + OTP)";
};

export type Site = {
  id: string;
  name: string;
  code: string;
  type: SiteType;
  hostAgency: string;
  address: string;
  operatorId: string | null;
  status: "active" | "onboarding" | "closed";
  openedOn: string;
  contractOnFile: boolean;
  monthlyRevenue: number;
};

export type OperatorStatus =
  | "applicant"
  | "orientation"
  | "training"
  | "interim"
  | "licensed"
  | "suspended"
  | "archived";

export type Operator = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: OperatorStatus;
  licensedOn: string | null;
  siteIds: string[];
  assignedBeoId: string;
  visualAccommodation: string;
  outstandingLoanBalance: number;
};

/* ---- Forms (config-driven; FormRenderer reads these) ---- */
export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "currency"
  | "percentage"
  | "date"
  | "select"
  | "checkbox"
  | "file"
  | "computed"
  | "email"
  | "phone";

export type FormField = {
  key: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  help?: string;
  options?: string[];
  /** for computed fields: keys to sum, or a formula tag */
  computeFrom?: string[];
  computeKind?: "sum" | "profit" | "setaside";
  section?: string;
  colSpan?: 1 | 2;
  min?: number;
  max?: number;
  readOnly?: boolean;
};

export type BenForm = {
  id: string;
  code: string;
  title: string;
  shortTitle: string;
  description: string;
  /** who starts the case */
  initiatedBy: Role;
  /** approval chain */
  approvalChain: Role[];
  /** operator acknowledges/signs instead of submitting (reverse init) */
  operatorAcknowledges?: boolean;
  frequency: string;
  category: "financial" | "operational" | "equipment" | "insurance" | "review";
  sections: string[];
  fields: FormField[];
  producesPayment?: "inbound" | "outbound" | null;
  rfpRef: string;
};

/* ---- Cases / submissions ---- */
export type CaseState =
  | "draft"
  | "submitted"
  | "beo_review"
  | "beo_approved"
  | "chief_review"
  | "approved"
  | "rejected"
  | "awaiting_ack"
  | "acknowledged"
  | "reviewed"
  | "paid"
  | "closed";

export type TimelineEntry = {
  state: CaseState;
  actor: string;
  role: Role;
  at: string;
  note?: string;
};

export type BenCase = {
  id: string;
  formId: string;
  title: string;
  operatorId: string;
  siteId: string;
  state: CaseState;
  submittedOn: string;
  period?: string;
  amount?: number;
  setAside?: number;
  assignedBeoId: string;
  values: Record<string, string | number | boolean>;
  timeline: TimelineEntry[];
  priority: "routine" | "high";
};

/* ---- Equipment ---- */
export type Equipment = {
  id: string;
  tagId: string;
  name: string;
  category: string;
  manufacturer: string;
  model: string;
  serial: string;
  purchasedOn: string;
  vendor: string;
  price: number;
  warrantyUntil: string;
  siteId: string;
  operatorId: string | null;
  status: "in_service" | "maintenance" | "storage" | "retired";
  hasPhoto: boolean;
  locationHistory: { siteId: string; movedOn: string; reason: string }[];
};

/* ---- Maintenance tickets ---- */
export type TicketState =
  | "submitted"
  | "under_review"
  | "assigned"
  | "in_progress"
  | "resolved"
  | "rescheduled";

export type Ticket = {
  id: string;
  equipmentId: string;
  siteId: string;
  operatorId: string;
  type: "preventive" | "corrective";
  summary: string;
  description: string;
  requestedDate: string;
  state: TicketState;
  vendor: string | null;
  assignedBeoId: string;
  openedOn: string;
  timeline: { state: TicketState; actor: string; at: string; note?: string }[];
};

/* ---- Payments & loans ---- */
export type Payment = {
  id: string;
  direction: "inbound" | "outbound";
  kind:
    | "set_aside"
    | "loan_repayment"
    | "initial_stock"
    | "medical_reimbursement"
    | "life_reimbursement"
    | "retirement"
    | "library_stipend"
    | "vending_commission"
    | "loan_disbursement"
    | "refund";
  operatorId: string;
  siteId: string | null;
  amount: number;
  method: "card" | "ach" | "check";
  status: "pending" | "processing" | "completed" | "failed";
  date: string;
  reference: string;
};

export type Loan = {
  id: string;
  operatorId: string;
  principal: number;
  balance: number;
  monthlyPayment: number;
  openedOn: string;
  purpose: string;
  status: "active" | "paid";
};

/* ---- Announcements & applications ---- */
export type Announcement = {
  id: string;
  siteName: string;
  siteType: SiteType;
  hostAgency: string;
  postedOn: string;
  closesOn: string;
  status: "open" | "under_review" | "awarded" | "closed";
  applicants: number;
  body: string;
};

/* ---- Notifications ---- */
export type Notification = {
  id: string;
  forRole: Role[];
  forOperatorId?: string;
  icon: string;
  title: string;
  body: string;
  at: string;
  read: boolean;
  kind: "approval" | "payment" | "ticket" | "review" | "system" | "broadcast";
};

/* ---- Reporting ---- */
export type FiscalCalendar = "SFY" | "FFY" | "CY";

export type ReportDef = {
  id: string;
  name: string;
  category: string;
  description: string;
  calendars: FiscalCalendar[];
  scope: "per_site" | "program" | "both";
  rfpRef: string;
};

/* ---- Feature tracker (RFP coverage, from the team tracker CSV) ---- */
export type TrackerStatus = "Have" | "Partial" | "Gap";
export type TrackerItem = {
  id: string;
  area: string;
  requirement: string;
  ref: string;
  status: TrackerStatus;
  buildType: string;
  priority: string;
  notes?: string;
};
