# BEN Case Management System — Interactive UI Prototype

**Nevada DETR · Business Enterprise of Nevada · RFP 90DETR-S3794**

A fully interactive, front-end-only prototype of the BEN Case Management System, covering **both portals** (Staff + Operator), **every module**, and **every use case as an end-to-end loop**. Built to be handed to BEN as a walkthrough of the proposed solution. Backend/APIs are intentionally mocked — all data lives in `src/data/` and all workflow actions run client-side.

Stack: **Vite + React 18 + TypeScript + Tailwind CSS + shadcn-style components (Radix UI) + Recharts**.

---

## Running it

```bash
npm install
npm run dev      # http://localhost:5273
```

`npm run build` produces a static bundle in `dist/` (host anywhere — no server needed).

---

## The demo in 60 seconds

Everything is driven by the **portal + account switcher in the top-right header**. Switching account changes the persona → role → navigation → permissions → visible data, live.

1. **Start as the Chief / a BEO** (Staff Portal, AD SSO). Open **Approvals** → a P&L is waiting.
2. Open it → review the auto-calculated set-aside → **Approve** (routes BEO → Chief) → watch the audit trail advance.
3. **Switch account to Maria Delgado** (Operator Portal — theme flips to dark/high-contrast automatically). Notice she sees **only her own** café data.
4. **New Submission → P&L** → type revenue/expenses → the **set-aside computes live** → Submit → see the workflow chain "what happens next".
5. Switch to **Accessibility** to change theme, contrast, and text size on the fly.
6. Back in Staff, open **RFP Coverage** — the whole requirement matrix (Have / Partial / Gap) rendered inside the product.

---

## The two scored presentation factors

| Factor | Where it lives |
|---|---|
| **#1 Accessibility (500 pts)** | Dark/high-contrast themes, live text-size, visible focus rings, icon+label status (never color-only), skip link, ARIA, keyboard operability, Operator **Accessibility** settings page |
| **#2 BEN Forms & Workflows (400 pts)** | Config-driven `FormRenderer` (all 10 forms as data), the uniform Operator → BEO → Chief approval chain, live P&L → set-aside computation, reverse-init site reviews (operator signs) |

---

## Architecture (config-driven, mirrors the real product)

Screens are **generated from data**, not hand-built one by one — the same philosophy as the real Avikto form-builder/workflow engine.

```
src/
  data/            <- the whole domain as typed mock data (edit here to change the app)
    personas.ts       accounts for the switcher (staff + operators)
    forms.ts          all 10 BEN forms as field schemas  <- FormRenderer reads these
    cases.ts          submissions with workflow state + audit timeline
    sites, operators, equipment, tickets, payments, reports,
    announcements, notifications, featureTracker, nav
  components/
    ui/              shadcn-style primitives (Radix + Tailwind)
    shared/          FormRenderer, ApprovalTimeline, StatusBadge, StatCard
    app/             AppShell, Header (PortalSwitcher + AccountSwitcher), Sidebar
  context/session.tsx  active persona, portal, theme, operator data-scope
  pages/
    staff/           13 modules
    operator/        10 modules
    shared/          CaseDetail (interactive approve / reject / sign / pay)
```

**To change the set-aside rate, forms, sites, etc., edit `src/data/` — no component changes needed.**

---

## Module coverage

**Staff Portal** — Dashboard · Approvals · Submissions · Operators (+ detail & lifecycle) · Sites · Equipment (+ location history, Sortly bulk import) · Maintenance Tickets · Payments & Loans · Reports (SFY/FFY/CY + RSA-15, PDF/Excel export) · Site Announcements · Branding & 7-slot Theme editor · RFP Coverage · Security & Audit.

**Operator Portal** (accessibility-first) — My Dashboard · New Submission (all operator forms) · My Submissions · My Sites · My Equipment (+ report issue) · My Tickets · My Account (statement) · Documents · Announcements (+ apply) · Accessibility settings.

**Every use case closes its loop**: P&L → approve → pay · site review → sign · ticket → assign vendor → resolve · loan → disburse → auto-repay · purchase → warehouse check → $200 Chief gate → record created · new-site → apply → award · operator lifecycle Applicant → Interim → Licensed.

---

## Scope notes

- **UI only.** No backend, no real auth, no persistence — state resets on reload. Workflow actions mutate local React state to demonstrate the loop.
- The **set-aside %** (`SET_ASIDE_RATE` in `src/data/forms.ts`) and the **$200 purchase threshold** are shown as configurable, pending Phase-1 confirmation — not hardcoded into logic assumptions.
- Data volumes are representative samples; program totals (22 sites, 1,035 equipment items, 18 operators) are reflected in the stats.
