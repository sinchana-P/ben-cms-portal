import {
  LayoutDashboard, CheckSquare, FileText, Users, MapPin, Package,
  Wrench, CreditCard, BarChart3, Megaphone, Palette, ClipboardCheck,
  ShieldCheck, FilePlus2, Receipt, FolderOpen, Accessibility, FileSearch, Send,
} from "lucide-react";
import type { Portal, Role } from "@/types";

export type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  portal: Portal;
  roles: Role[];
  badgeKey?: "approvals" | "acks";
};

const ALL_STAFF: Role[] = ["chief", "beo", "fiscal", "admin"];

export const NAV: NavItem[] = [
  // ---- Staff portal ----
  { to: "/staff", label: "Dashboard", icon: LayoutDashboard, portal: "staff", roles: ALL_STAFF },
  { to: "/staff/approvals", label: "Approvals", icon: CheckSquare, portal: "staff", roles: ["chief", "beo"], badgeKey: "approvals" },
  { to: "/staff/cases", label: "Submissions", icon: FileText, portal: "staff", roles: ALL_STAFF },
  { to: "/staff/operators", label: "Operators", icon: Users, portal: "staff", roles: ALL_STAFF },
  { to: "/staff/sites", label: "Sites", icon: MapPin, portal: "staff", roles: ALL_STAFF },
  { to: "/staff/equipment", label: "Equipment", icon: Package, portal: "staff", roles: ALL_STAFF },
  { to: "/staff/tickets", label: "Maintenance", icon: Wrench, portal: "staff", roles: ["chief", "beo", "admin"] },
  { to: "/staff/payments", label: "Payments & Loans", icon: CreditCard, portal: "staff", roles: ["chief", "fiscal", "admin"] },
  { to: "/staff/reports", label: "Reports", icon: BarChart3, portal: "staff", roles: ALL_STAFF },
  { to: "/staff/announcements", label: "Site Announcements", icon: Megaphone, portal: "staff", roles: ["chief", "beo", "admin"] },
  { to: "/staff/broadcasts", label: "Broadcasts", icon: Send, portal: "staff", roles: ["chief", "beo", "admin"] },
  { to: "/staff/branding", label: "Branding & Theme", icon: Palette, portal: "staff", roles: ["chief", "admin"] },
  { to: "/staff/coverage", label: "RFP Coverage", icon: ClipboardCheck, portal: "staff", roles: ALL_STAFF },
  { to: "/staff/security", label: "Security & Audit", icon: ShieldCheck, portal: "staff", roles: ["chief", "admin"] },

  // ---- Operator portal ----
  { to: "/operator", label: "My Dashboard", icon: LayoutDashboard, portal: "operator", roles: ["operator"] },
  { to: "/operator/new", label: "New Submission", icon: FilePlus2, portal: "operator", roles: ["operator"] },
  { to: "/operator/submissions", label: "My Submissions", icon: FileText, portal: "operator", roles: ["operator"], badgeKey: "acks" },
  { to: "/operator/sites", label: "My Site", icon: MapPin, portal: "operator", roles: ["operator"] },
  { to: "/operator/equipment", label: "My Equipment", icon: Package, portal: "operator", roles: ["operator"] },
  { to: "/operator/tickets", label: "My Tickets", icon: Wrench, portal: "operator", roles: ["operator"] },
  { to: "/operator/account", label: "My Account", icon: Receipt, portal: "operator", roles: ["operator"] },
  { to: "/operator/documents", label: "Documents", icon: FolderOpen, portal: "operator", roles: ["operator"] },
  { to: "/operator/announcements", label: "Announcements", icon: Megaphone, portal: "operator", roles: ["operator"] },
  { to: "/operator/applications", label: "My Applications", icon: FileSearch, portal: "operator", roles: ["operator"] },
  { to: "/operator/accessibility", label: "Accessibility", icon: Accessibility, portal: "operator", roles: ["operator"] },
];

export function navFor(portal: Portal, role: Role): NavItem[] {
  return NAV.filter((n) => n.portal === portal && n.roles.includes(role));
}
