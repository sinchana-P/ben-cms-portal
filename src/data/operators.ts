import type { Operator, OperatorStatus } from "@/types";

export const OPERATOR_STATUS_LABEL: Record<OperatorStatus, string> = {
  applicant: "Applicant",
  orientation: "Orientation",
  training: "BEN Training",
  interim: "Interim (12–18 mo)",
  licensed: "Licensed",
  suspended: "Suspended",
  archived: "Archived",
};

export const OPERATOR_LIFECYCLE: OperatorStatus[] = [
  "applicant",
  "orientation",
  "training",
  "interim",
  "licensed",
];

export const OPERATORS: Operator[] = [
  {
    id: "op-maria",
    name: "Maria Delgado",
    email: "maria.delgado@benoperator.nv.gov",
    phone: "(702) 555-0142",
    status: "licensed",
    licensedOn: "2017-03-01",
    siteIds: ["site-cafe-1"],
    assignedBeoId: "beo-1",
    visualAccommodation: "Screen reader (JAWS), high-contrast",
    outstandingLoanBalance: 0,
  },
  {
    id: "op-priya",
    name: "Priya Nair",
    email: "priya.nair@benoperator.nv.gov",
    phone: "(702) 555-0173",
    status: "licensed",
    licensedOn: "2019-01-10",
    siteIds: ["site-mm-1", "site-mm-2"],
    assignedBeoId: "beo-1",
    visualAccommodation: "Screen magnification (ZoomText 300%)",
    outstandingLoanBalance: 4200,
  },
  {
    id: "op-darnell",
    name: "Darnell Price",
    email: "darnell.price@benoperator.nv.gov",
    phone: "(702) 555-0199",
    status: "licensed",
    licensedOn: "2018-05-20",
    siteIds: ["site-vend-1"],
    assignedBeoId: "beo-1",
    visualAccommodation: "Screen reader (NVDA), keyboard-only",
    outstandingLoanBalance: 0,
  },
  {
    id: "op-james",
    name: "James Okonkwo",
    email: "james.okonkwo@benoperator.nv.gov",
    phone: "(775) 555-0121",
    status: "interim",
    licensedOn: null,
    siteIds: ["site-gift-1"],
    assignedBeoId: "beo-2",
    visualAccommodation: "VoiceOver (macOS), high-contrast",
    outstandingLoanBalance: 6800,
  },
  {
    id: "op-linda",
    name: "Linda Cho",
    email: "linda.cho@benoperator.nv.gov",
    phone: "(775) 555-0188",
    status: "licensed",
    licensedOn: "2015-08-15",
    siteIds: ["site-cafe-2", "site-vend-2"],
    assignedBeoId: "beo-2",
    visualAccommodation: "Low vision — 200% zoom, dark theme",
    outstandingLoanBalance: 0,
  },
  {
    id: "op-robert",
    name: "Robert Davis",
    email: "robert.davis@benoperator.nv.gov",
    phone: "(702) 555-0164",
    status: "licensed",
    licensedOn: "2020-03-01",
    siteIds: ["site-mm-4"],
    assignedBeoId: "beo-2",
    visualAccommodation: "Screen reader (JAWS)",
    outstandingLoanBalance: 0,
  },
  {
    id: "op-applicant-1",
    name: "Terrence Boyd",
    email: "terrence.boyd@example.com",
    phone: "(702) 555-0250",
    status: "applicant",
    licensedOn: null,
    siteIds: [],
    assignedBeoId: "beo-1",
    visualAccommodation: "Screen reader (JAWS)",
    outstandingLoanBalance: 0,
  },
];

export function operatorById(id: string | null): Operator | undefined {
  if (!id) return undefined;
  return OPERATORS.find((o) => o.id === id);
}
