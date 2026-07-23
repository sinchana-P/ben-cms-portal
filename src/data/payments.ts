import type { Payment, Loan } from "@/types";

export const PAYMENT_KIND_LABEL: Record<Payment["kind"], string> = {
  set_aside: "Set-Aside Fee",
  loan_repayment: "Loan Repayment",
  initial_stock: "Initial Stock",
  medical_reimbursement: "Medical Reimbursement",
  life_reimbursement: "Life Insurance Reimbursement",
  retirement: "Retirement Contribution",
  library_stipend: "Library Stipend",
  vending_commission: "Vending Commission",
  loan_disbursement: "Loan Disbursement",
  refund: "Refund / Reversal",
};

export const PAYMENTS: Payment[] = [
  { id: "P-9001", direction: "inbound", kind: "set_aside", operatorId: "op-priya", siteId: "site-mm-2", amount: 74, method: "ach", status: "completed", date: "2026-08-17T13:30:00", reference: "SA-2039" },
  { id: "P-9000", direction: "inbound", kind: "set_aside", operatorId: "op-maria", siteId: "site-cafe-1", amount: 184, method: "card", status: "completed", date: "2026-07-19T10:12:00", reference: "SA-1998" },
  { id: "P-8995", direction: "inbound", kind: "loan_repayment", operatorId: "op-priya", siteId: null, amount: 350, method: "ach", status: "completed", date: "2026-08-01T06:00:00", reference: "LR-4471" },
  { id: "P-8990", direction: "outbound", kind: "medical_reimbursement", operatorId: "op-maria", siteId: null, amount: 480, method: "check", status: "processing", date: "2026-08-13T15:10:00", reference: "RB-2028" },
  { id: "P-8981", direction: "outbound", kind: "loan_disbursement", operatorId: "op-james", siteId: null, amount: 8000, method: "ach", status: "pending", date: "2026-08-16T09:00:00", reference: "LD-3350" },
  { id: "P-8975", direction: "outbound", kind: "vending_commission", operatorId: "op-darnell", siteId: "site-vend-1", amount: 1240, method: "ach", status: "completed", date: "2026-08-05T08:00:00", reference: "VC-7781" },
  { id: "P-8970", direction: "inbound", kind: "set_aside", operatorId: "op-darnell", siteId: "site-vend-1", amount: 268, method: "ach", status: "failed", date: "2026-08-20T11:00:00", reference: "SA-2055" },
  { id: "P-8960", direction: "outbound", kind: "library_stipend", operatorId: "op-linda", siteId: null, amount: 150, method: "check", status: "completed", date: "2026-07-31T12:00:00", reference: "LS-1120" },
];

export const LOANS: Loan[] = [
  { id: "L-4471", operatorId: "op-priya", principal: 8400, balance: 4200, monthlyPayment: 350, openedOn: "2024-09-01", purpose: "Initial stock — 2nd micro market", status: "active" },
  { id: "L-3350", operatorId: "op-james", principal: 8000, balance: 6800, monthlyPayment: 335, openedOn: "2026-03-01", purpose: "Gift shop startup inventory", status: "active" },
];

export function paymentsForOperator(operatorId: string): Payment[] {
  return PAYMENTS.filter((p) => p.operatorId === operatorId);
}
