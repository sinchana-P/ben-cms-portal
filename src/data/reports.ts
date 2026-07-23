import type { ReportDef } from "@/types";

export const FISCAL_LABEL = {
  SFY: "State FY (Jul–Jun)",
  FFY: "Federal FY (Oct–Sep)",
  CY: "Calendar Year (Jan–Dec)",
};

export const REPORTS: ReportDef[] = [
  { id: "r-pnl", name: "P&L Summary", category: "Financial", description: "Revenue, expenses, profit, and set-aside by site and program-wide.", calendars: ["SFY", "FFY", "CY"], scope: "both", rfpRef: "RP-3" },
  { id: "r-setaside", name: "Set-Aside Collections", category: "Financial", description: "Set-aside fees collected — the program's funding source.", calendars: ["SFY", "CY"], scope: "both", rfpRef: "RP-3" },
  { id: "r-reimburse", name: "Reimbursements & Outbound Payments", category: "Financial", description: "Medical, life, retirement, library stipend, vending commission.", calendars: ["CY"], scope: "program", rfpRef: "RP-3" },
  { id: "r-loans", name: "Loan Portfolio", category: "Financial", description: "Disbursements, balances, and repayment progress.", calendars: ["SFY", "CY"], scope: "program", rfpRef: "RP-3" },
  { id: "r-sitereview", name: "Site Review Compliance", category: "Operations", description: "Monthly & annual review completion and findings.", calendars: ["SFY"], scope: "both", rfpRef: "RP-3" },
  { id: "r-maint", name: "Equipment Maintenance Log", category: "Equipment", description: "Ticket volume, resolution time, preventive vs corrective.", calendars: ["SFY", "CY"], scope: "both", rfpRef: "RP-3" },
  { id: "r-throw", name: "Throw Log / Shrinkage", category: "Operations", description: "Spoilage value and reasons by site.", calendars: ["SFY", "CY"], scope: "both", rfpRef: "RP-3" },
  { id: "r-inventory", name: "Equipment Inventory", category: "Equipment", description: "Full asset register by site, operator, and category.", calendars: ["CY"], scope: "both", rfpRef: "RP-3" },
  { id: "r-operators", name: "Operator Roster & Lifecycle", category: "Program", description: "Status, sites, licensing dates across the roster.", calendars: ["SFY", "FFY"], scope: "program", rfpRef: "RP-3" },
  { id: "r-rsa15", name: "RSA-15 Federal Report", category: "Federal", description: "Statutory Randolph-Sheppard report — generated on the Federal FY.", calendars: ["FFY"], scope: "program", rfpRef: "RP-2 · Q173" },
];
