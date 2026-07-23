import React, { createContext, useContext, useState, useCallback } from "react";
import type { BenCase, Payment, TimelineEntry } from "@/types";
import { CASES as SEED_CASES } from "@/data/cases";
import { PAYMENTS as SEED_PAYMENTS } from "@/data/payments";

/**
 * Live app-data store so the workflow + money flows are wired end-to-end:
 * an approval on one screen moves the case out of the approval queue, a
 * set-aside payment posts to the ledger and the operator's statement, an
 * outbound reimbursement issued by Fiscal/Admin shows up for the operator.
 * (In-memory only — resets on reload, by design for a UI prototype.)
 */
type AppDataState = {
  cases: BenCase[];
  payments: Payment[];
  updateCase: (id: string, patch: Partial<BenCase>, entry?: Omit<TimelineEntry, "at">) => void;
  addPayment: (p: Omit<Payment, "id" | "date"> & { date?: string }) => Payment;
};

const AppDataContext = createContext<AppDataState | null>(null);

let paySeq = 9100;

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [cases, setCases] = useState<BenCase[]>(() => SEED_CASES.map((c) => ({ ...c, timeline: [...c.timeline] })));
  const [payments, setPayments] = useState<Payment[]>(() => [...SEED_PAYMENTS]);

  const updateCase = useCallback((id: string, patch: Partial<BenCase>, entry?: Omit<TimelineEntry, "at">) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, ...patch, timeline: entry ? [...c.timeline, { ...entry, at: new Date().toISOString() }] : c.timeline }
          : c
      )
    );
  }, []);

  const addPayment = useCallback((p: Omit<Payment, "id" | "date"> & { date?: string }) => {
    const full: Payment = { id: `P-${++paySeq}`, date: p.date ?? new Date().toISOString(), ...p } as Payment;
    setPayments((prev) => [full, ...prev]);
    return full;
  }, []);

  return (
    <AppDataContext.Provider value={{ cases, payments, updateCase, addPayment }}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppData() {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used within AppDataProvider");
  return ctx;
}
