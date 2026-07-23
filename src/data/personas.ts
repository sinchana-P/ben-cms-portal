import type { Persona } from "@/types";

/**
 * The account switcher cycles through these. Selecting a persona sets the
 * active PORTAL (staff vs operator), the ROLE (drives nav + permissions),
 * and — for operators — the data scope (own sites only). This single control
 * demonstrates RBAC, separation of duties, and operator data isolation live.
 */
export const PERSONAS: Persona[] = [
  {
    id: "chief-1",
    name: "Karen Whitfield",
    role: "chief",
    portal: "staff",
    title: "Bureau Chief",
    email: "kwhitfield@detr.nv.gov",
    authMethod: "AD SSO (SAML)",
  },
  {
    id: "beo-1",
    name: "Ben Alvarez",
    role: "beo",
    portal: "staff",
    title: "Bureau Enterprise Officer",
    email: "balvarez@detr.nv.gov",
    authMethod: "AD SSO (SAML)",
  },
  {
    id: "beo-2",
    name: "Dana Cole",
    role: "beo",
    portal: "staff",
    title: "Bureau Enterprise Officer",
    email: "dcole@detr.nv.gov",
    authMethod: "AD SSO (SAML)",
  },
  {
    id: "fiscal-1",
    name: "Fran Okafor",
    role: "fiscal",
    portal: "staff",
    title: "Fiscal Officer (view-only)",
    email: "fokafor@detr.nv.gov",
    authMethod: "AD SSO (SAML)",
  },
  {
    id: "admin-1",
    name: "Alex Reyes",
    role: "admin",
    portal: "staff",
    title: "Administrative Assistant",
    email: "areyes@detr.nv.gov",
    authMethod: "AD SSO (SAML)",
  },
  {
    id: "op-maria",
    name: "Maria Delgado",
    role: "operator",
    portal: "operator",
    title: "Licensed Operator — Café",
    email: "maria.delgado@benoperator.nv.gov",
    siteIds: ["site-cafe-1"],
    authMethod: "MFA (username + password + OTP)",
  },
  {
    id: "op-priya",
    name: "Priya Nair",
    role: "operator",
    portal: "operator",
    title: "Licensed Operator — 2 Micro Markets",
    email: "priya.nair@benoperator.nv.gov",
    siteIds: ["site-mm-1", "site-mm-2"],
    authMethod: "MFA (username + password + OTP)",
  },
  {
    id: "op-darnell",
    name: "Darnell Price",
    role: "operator",
    portal: "operator",
    title: "Licensed Operator — Vending Route",
    email: "darnell.price@benoperator.nv.gov",
    siteIds: ["site-vend-1"],
    authMethod: "MFA (username + password + OTP)",
  },
  {
    id: "op-james",
    name: "James Okonkwo",
    role: "operator",
    portal: "operator",
    title: "Interim Operator — Gift Shop",
    email: "james.okonkwo@benoperator.nv.gov",
    siteIds: ["site-gift-1"],
    authMethod: "MFA (username + password + OTP)",
  },
];

export const ROLE_LABEL: Record<string, string> = {
  chief: "Bureau Chief",
  beo: "Bureau Enterprise Officer",
  fiscal: "Fiscal Officer",
  admin: "Admin Assistant",
  operator: "Operator",
};

export function personaById(id: string): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}
