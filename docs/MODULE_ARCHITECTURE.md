# BEN Case Management — Module Architecture & Specifications

**RFP 90DETR-S3794 · Nevada DETR / Business Enterprise of Nevada**

This is the architecture the team builds against — every module written the way we wrote the Sites spec: *what the thing is in plain English, how it relates to everything else, how each portal treats it, and the business rules that must not be violated.* Each module has a **top-level entity** at its center; everything else is a child record.

There are **two portals, one truth**: the **Staff Portal** (8 DETR staff, AD SSO, full program visibility) and the **Operator Portal** (18+ blind/visually-impaired operators, MFA+OTP, own-data-only, accessibility-first). There is no third "client" portal — the Operator Portal *is* the external-user portal.

The one-line entity map for the whole program:

```
operators (1) ──< site_operator_assignments >── (1) sites (1) ──< equipment (many)
       │                                              │                  │
       └──< cases/forms (many) ─── per site           └──< reviews       └──< maintenance_tickets
       └──< payments (many, in + out)                 └──< pl_history
       └──< loans (1..many)                            └──< host_agency_contract
       └──< applications (many) ── for announced sites
```

---

## 1. Site — the top-level location

**In plain English.** A Site is a physical vending location — a cafeteria, gift shop, micro market, or a vending route — inside a government building. BEN licenses the spot from the building owner (the **Host Agency**) and assigns a blind operator to run it. The Site is the central unit everything hangs off: equipment lives at a site, an operator works a site, P&L is reported per site per month, reviews happen at sites. Think of it the way Avikto thinks of a Client — the top-level account.

**Top-level entity & relationships.**
```
sites (1) ──< equipment (many)          one site, many pieces of equipment
sites (1) ──< site_operator_assignments >── operators   (many-to-many, with history)
sites (1) ──< site_reviews (many)
sites (1) ──< pl_history (many months)
sites (1) ──1 host_agency_contract
```

**Staff Portal.** Full control — create sites, assign/reassign operators, manage the lifecycle (active → pending closure → closed), post announcements, run location reports. Sites list → Site Detail (Overview, Equipment, Assignments, Site Reviews, P&L History) → Add New Site → Site Closure workflow.

**Operator Portal.** Read-only view of *their* site(s) — "My Site" shows the site, its equipment, and quick actions. Every form they submit is auto-tied to the site; they never pick it manually.

**Screens (built).** Staff: Sites list, Site Detail (5 tabs), Add New Site (5 sections + conditional vending-route stops + 2-site-max warning), Site Closure workflow. Operator: My Site.

**Key rules.**
- Site types are exactly four: **Micro Market (9), Vending Route (7), Cafeteria (4), Gift Shop (2)** = 22 today, +2/yr.
- Set-aside is a **% of net profit**, configured per site — never gross revenue, never hardcoded.
- P&L is due the **20th of each month**, program-wide.
- A **vending route** has stops across multiple buildings; equipment is assigned per stop.
- Closing a site is a formal workflow (closing agreement → equipment removal → vacate → archive); the record is archived, never deleted.

---

## 2. Operator — the licensed blind entrepreneur

**In plain English.** An Operator is a legally blind/visually-impaired person licensed by BEN to run the business at one or two sites. They are the external user. They move through a lifecycle before they're fully licensed, and they can be reassigned between sites over their career — so we never overwrite "which site" they're on; we keep a history.

**Top-level entity & relationships.**
```
operators (1) ──< site_operator_assignments >── sites   (≤ 2 active sites per operator)
operators (1) ──< cases (their submissions)
operators (1) ──< payments (in + out) and loans
operators (1) ──< applications (for announced sites)
```
The **assignment table** is the heart of it: `{ site_id, operator_id, role (Primary|Relief|Trainee), start_date, end_date (null = active), assigned_by, notes }`. Moving an operator = set `end_date` on the current row + insert a new row. One site can have a Primary + a Trainee simultaneously; only the **Primary** owns P&L and set-aside.

**Staff Portal.** Operators roster (status, sites, assigned BEO, loan balance, accommodation), Operator Detail with the lifecycle stepper. *(Gap — see audit: the "Sites Managed" history block is being added.)*

**Operator Portal.** The operator *is* the logged-in user; their identity scopes everything they see.

**Key rules.**
- Lifecycle: **Applicant → Orientation → BEN Training → Interim (12–18 mo, enhanced review) → Licensed** → (Suspended / Archived).
- **Max 2 active sites** per operator (enforced with a warning at assignment time).
- Suspend/revoke deactivates portal access but **staff retain the site's data** for continuity and audit.

---

## 3. Equipment — the asset that lives at a site

**In plain English.** Equipment is a physical asset (vending machine, cooler, coffee machine, POS kiosk, fixture) that belongs to one site at a time. There are ~1,035 items, migrated from Sortly. When it moves between sites (common on vending routes) we keep the full location history.

**Top-level entity & relationships.**
```
sites (1) ──< equipment (many)          equipment.site_id = the FK
equipment (1) ──< maintenance_tickets (many)
equipment (1) ──< location_history (many moves)
```

**Staff Portal.** Inventory list (filter by site/operator/category), Equipment Detail slide-over (specs, warranty, photo, **location history**, maintenance history), Sortly **bulk CSV import**.

**Operator Portal.** Read-only list of equipment at *their* site + a one-click "Report an issue" that opens a maintenance ticket already knowing the equipment and site.

**Key rules.**
- Every asset carries: manufacturer, make/model, tag ID, serial, purchase date & vendor, price/invoice, warranty, category, photos, site, assigned operator.
- Moving equipment appends to `location_history` — the record is never overwritten (same pattern as operator assignments).
- Because equipment knows its site, a maintenance ticket automatically knows the site too.

---

## 4. Form / Submission (Case) — the 10 BEN workflows

**In plain English.** Every BEN paper form becomes a native digital workflow — a "case." The operator (or, for reviews, a BEO) fills a structured form; it routes through a uniform two-tier approval; notifications fire at each step. This is the contract-winning spine.

**Top-level entity & relationships.**
```
form_templates (1) ──< cases/submissions (many)
cases ── belong to ── an operator + a site
cases ──1 approval_workflow (Operator → BEO → Chief)
```

**The 10 forms** — P&L Monthly Statement, Monthly Site Review, Annual Site Review, Request to Purchase Equipment, Health Insurance Enrollment, Health Insurance Reimbursement, Loan Application, Request for Prior Approval of Expenses, Equipment Maintenance Log, Site Daily Throw Log. All defined as **data** (field schemas) rendered by one FormRenderer — adding a form is configuration, not code.

**Staff Portal.** Approvals queue (role-aware), Submissions list (all), Case Detail with the interactive approve / reject / sign / pay actions and the audit timeline.

**Operator Portal.** New Submission (pick a form → guided, validated, screen-reader-friendly → submit), My Submissions, sign pending site reviews.

**Key rules.**
- **Uniform approval:** Operator submits → **BEO reviews (tier 1)** → **Chief approves (tier 2)**, with notifications at each step.
- Exceptions: **Throw Log** stops at BEO (no Chief). **Site reviews** run *in reverse* — BEO creates & fills → operator reviews, comments & **signs** → finalised.
- **P&L auto-calc:** revenue (taxable / non-taxable / vending) − expenses (COGS / operating / payroll) = net profit; **set-aside = net profit × the site's rate**.
- Currency & percentage fields validate on entry; server-side validation happens at submission.

---

## 5. Maintenance Ticket — equipment service requests

**In plain English.** When something breaks (or is due for preventive service), the operator opens a ticket against a specific piece of equipment. A BEO manages it end-to-end — reviewing, assigning a vendor, tracking to resolution.

**Top-level entity & relationships.**
```
equipment (1) ──< maintenance_tickets (many)  ── ticket knows its site via the equipment
tickets ──1 assigned_vendor (external)
```

**Lifecycle.** Submitted → Under Review → Assigned (vendor) → In Progress → Resolved. Preventive & corrective. A reschedule loops back to Assigned with a new date without reopening the whole ticket.

**Staff Portal.** Ticket board/list + detail with the lifecycle stepper, vendor assignment, activity log.

**Operator Portal.** Open a ticket, watch its live status, get notified when a vendor is assigned and when work is done.

---

## 6. Payment & Loan — bidirectional money

**In plain English.** Money flows both ways. **Inbound:** operators pay set-aside fees (the program's funding) and repay loans. **Outbound:** BEN pays operators medical/life reimbursements, retirement, library stipend, vending commissions, and loan disbursements. Loans are administered in-house and repaid automatically from monthly P&L profit.

**Top-level entity & relationships.**
```
operators (1) ──< payments (many; direction = inbound | outbound)
operators (1) ──< loans (disbursement → monthly repayment → balance)
payments ── may reference ── a site and/or a case
```

**Staff Portal.** Payments ledger (in/out, method, status), Loans with repayment progress. Fiscal role is **view-only** — separation of duties.

**Operator Portal.** My Account statement — the full inbound + outbound history with running balances, plus loan progress; pay set-aside online (card / ACH).

**Key rules.** Card/Debit + ACH via the State Treasurer gateway (CyberSource or equivalent). Payment notifications on success / failure / due reminder. Refunds/reversals are rare but supported.

**Who does what (grounded vs. assumed).** *Grounded in the RFP/Q&A:* operators **submit/pay inbound** (RFP §5.1.4 "Submit payments"); the **Chief/Program Administrator approves**; **Fiscal is strictly view-only** (RFP §5.1.2 — review + reports, no approval/execution). *Design decision (not specified by the RFP — a Phase-1 discovery item):* outbound disbursements are **executed by the State Treasurer's Office**, with the in-app "record/issue" trigger reserved to the **Admin Assistant** (limited write). The RFP does **not** name who executes outbound payments, so this is deliberately modeled to keep Fiscal view-only rather than assumed from the requirements.

---

## 7. Report — the three fiscal calendars

**In plain English.** BEN reports on three calendars at once: **State FY (Jul–Jun)**, **Federal FY (Oct–Sep)**, and **Calendar Year (Jan–Dec)** — each producing a different statutory view. Reports roll up program-wide and drill down per site.

**Top-level entity & relationships.**
```
report_definitions (1) ──< generated_reports
reports read across ── cases, payments, sites, equipment, reviews
```

**Staff Portal.** Report catalog + viewer with a **fiscal-calendar switch**, per-site vs program-wide scope, charts, and **PDF/Excel export**. RSA-15 federal report generated on the Federal FY.

**Key rules.** The reporting engine exists; each named report is only as real as the entity behind it. Set-aside collections, P&L, reimbursements, loan portfolio, site-review compliance, maintenance log, throw-log shrinkage, equipment inventory, operator roster, RSA-15.

---

## 8. Announcement & Application — the new-site pipeline

**In plain English.** When a new site opens, staff post an announcement to the operator landing page. Interested operators apply with a business plan, resume, and references. Staff review on merit — **there is no automated scoring or public ranking**; eligibility is a staff judgement.

**Top-level entity & relationships.**
```
announcements (1) ──< applications (many)
applications ── belong to ── an operator
applications ──1 pipeline (Submitted → BEO Review → Chief Interview → Decision → Assignment)
```

**Staff Portal.** Post/manage announcements, review applications.

**Operator Portal.** Browse announcements, apply via a 4-step wizard (Site Details → Business Plan → Documents → Review & Submit), track status in My Applications.

---

## 9. Notification — the nervous system

**In plain English.** Every workflow step, payment event, and broadcast generates a notification. The RFP minimum is **email + in-app**; SMS is optional.

**Relationships.** Notifications are addressed by role and/or specific operator. Kinds: approval, payment, ticket, review, system, **broadcast** (staff → all operators).

**Built.** In-app notification center (role/operator-scoped, unread counts). *(Gap — see audit: a staff "compose broadcast" screen and per-event notification preferences are not yet built.)*

---

## Cross-cutting A — Portals, Roles & Access (RBAC)

**Two portals, five roles.**

| Role | Portal | Auth | Scope |
|---|---|---|---|
| Bureau Chief | Staff | AD SSO | All; **final approval**; manages licenses |
| Bureau Enterprise Officer (BEO) | Staff | AD SSO | **Tier-1 approver**; initiates reviews; manages tickets & equipment |
| Fiscal Officer | Staff | AD SSO | **View-only** financial; runs reports; no approval |
| Admin Assistant | Staff | AD SSO | Support, limited write, no approval |
| Operator | Operator | MFA + OTP | **Own sites/data only** — structurally isolated |

The **account switcher** in the header proves this live: switching persona changes role → navigation → permissions, and portal → data scope.

## Cross-cutting B — Accessibility (Presentation Factor #1, 500 pts)

The largest user group is blind. Built: dark theme (operator default), **high-contrast mode**, **screen magnifier to 400%** (header + Accessibility page), live text-size, visible focus rings, **status shown with icon + text (never color alone)**, skip link, ARIA live regions (e.g. the maintenance alert), keyboard operability, a dedicated operator Accessibility page. Target: WCAG 2.1 AA + VPAT, validated with real operators + a DETR SME.

## Cross-cutting C — Branding & Security

**Branding:** logo, header banner, footer, and a **7-slot color theme** (Heading, Sub-Heading, Highlight, Accent, Auxiliary, Primary Text, Secondary Text) — live-editable, WCAG-contrast-checked. **Security:** MFA (non-disable), AD SSO, row-level operator isolation, immutable audit trail, AES-256 at rest / TLS 1.2+ in transit, FedRAMP-Moderate US-only hosting, RPO ≤ 4h.

---

## What's not yet built — honest gap audit

The prototype is UI-only (mock data, resets on reload). Beyond that, these are the **important things still missing**, ranked. Items marked ✅ were just added.

| # | Missing item | Where | Priority |
|---|---|---|---|
| 1 | ✅ **Screen magnifier (to 400%)** | Operator + header — **now built** | P1 |
| 2 | ✅ **Operator "Sites Managed" history** on Operator Detail (assignment table surfaced on the operator side) — **now built** | Staff → Operator Detail | P1 |
| 3 | ✅ **Per-site set-aside rate in the P&L form** — the form now reads the site's configured % (e.g. 6.5%) on net profit, with a site picker for dual-site operators — **now built** | Operator → New Submission (P&L) | P1 |
| 4 | ✅ **Removed the false `/`-search claim** — a global command palette is not an RFP requirement, so the misleading shortcut was removed rather than build unrequired scope | Operator → Accessibility | — |
| 5 | ✅ **Staff broadcast composer** (bulk communications, Q179) — audience + channels + recent broadcasts — **now built** | Staff → Broadcasts | P2 |
| 6 | ✅ **Site Documents tab** — host-agency contract as a first-class linked document + site files (Q190/Q38) — **now built** | Staff → Site Detail | P2 |
| 7 | ✅ **Equipment → Site link** — the equipment list now links each site to Site Detail (both directions of the link complete) — **now built** | Staff → Equipment | P2 |
| 8 | **Notification preferences** editor — *not an explicit RFP requirement* (Q33 minimum is email + in-app, which exist); intentionally not built | Both, Settings | out of scope |
| 9 | ✅ **Reduce-motion** — the toggle now actually suppresses animations/transitions (WCAG) — **now built** | Operator → Accessibility | P3 |
| 10 | **Staff document management** (versioning/virus-scan/purge) — covered functionally by the Site Documents tab + operator Documents; a standalone DMS is largely backend and not separately required | Staff | deferred |
| 11 | **Co-operators on My Site** — from the assignment-model exploration, not a hard RFP requirement; left as optional | Operator → My Site | optional |
| 12 | **Real persistence & APIs** — everything is client-side mock data by design; state resets on reload | Whole app | (by design) |

Everything the RFP/Q&A actually asks for is now built. Items 8, 10, and 11 were deliberately **not** built — they are not required (or are backend concerns), per the "only if it's in the requirements" scope call.
