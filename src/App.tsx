import { Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/app/AppShell";
import Landing from "@/pages/public/Landing";
import AnnouncementPublic from "@/pages/public/AnnouncementPublic";

// Staff pages
import StaffDashboard from "@/pages/staff/Dashboard";
import Approvals from "@/pages/staff/Approvals";
import Cases from "@/pages/staff/Cases";
import Operators from "@/pages/staff/Operators";
import OperatorDetail from "@/pages/staff/OperatorDetail";
import Sites from "@/pages/staff/Sites";
import SiteDetail from "@/pages/staff/SiteDetail";
import AddSite from "@/pages/staff/AddSite";
import SiteClosure from "@/pages/staff/SiteClosure";
import Equipment from "@/pages/staff/Equipment";
import Tickets from "@/pages/staff/Tickets";
import Payments from "@/pages/staff/Payments";
import Reports from "@/pages/staff/Reports";
import Announcements from "@/pages/staff/Announcements";
import ApplicationReview from "@/pages/staff/ApplicationReview";
import Broadcasts from "@/pages/staff/Broadcasts";
import Branding from "@/pages/staff/Branding";
import Coverage from "@/pages/staff/Coverage";
import Security from "@/pages/staff/Security";

// Operator pages
import OperatorDashboard from "@/pages/operator/Dashboard";
import NewSubmission from "@/pages/operator/NewSubmission";
import Submissions from "@/pages/operator/Submissions";
import MySites from "@/pages/operator/MySites";
import ApplyNewSite from "@/pages/operator/ApplyNewSite";
import MyApplications from "@/pages/operator/MyApplications";
import MyEquipment from "@/pages/operator/MyEquipment";
import MyTickets from "@/pages/operator/MyTickets";
import MyAccount from "@/pages/operator/MyAccount";
import Documents from "@/pages/operator/Documents";
import OperatorAnnouncements from "@/pages/operator/Announcements";
import AccessibilitySettings from "@/pages/operator/Accessibility";

// Shared
import CaseDetail from "@/pages/shared/CaseDetail";

export default function App() {
  return (
    <Routes>
      {/* Public surfaces — no auth, no app shell (RFP 2.6.1 landing) */}
      <Route path="/" element={<Landing />} />
      <Route path="/opportunities/:id" element={<AnnouncementPublic />} />

      <Route element={<AppShell />}>

        {/* Staff */}
        <Route path="/staff" element={<StaffDashboard />} />
        <Route path="/staff/approvals" element={<Approvals />} />
        <Route path="/staff/cases" element={<Cases />} />
        <Route path="/staff/cases/:id" element={<CaseDetail />} />
        <Route path="/staff/operators" element={<Operators />} />
        <Route path="/staff/operators/:id" element={<OperatorDetail />} />
        <Route path="/staff/sites" element={<Sites />} />
        <Route path="/staff/sites/new" element={<AddSite />} />
        <Route path="/staff/sites/:id" element={<SiteDetail />} />
        <Route path="/staff/sites/:id/close" element={<SiteClosure />} />
        <Route path="/staff/equipment" element={<Equipment />} />
        <Route path="/staff/tickets" element={<Tickets />} />
        <Route path="/staff/payments" element={<Payments />} />
        <Route path="/staff/reports" element={<Reports />} />
        <Route path="/staff/announcements" element={<Announcements />} />
        <Route path="/staff/announcements/:id" element={<ApplicationReview />} />
        <Route path="/staff/broadcasts" element={<Broadcasts />} />
        <Route path="/staff/branding" element={<Branding />} />
        <Route path="/staff/coverage" element={<Coverage />} />
        <Route path="/staff/security" element={<Security />} />

        {/* Operator */}
        <Route path="/operator" element={<OperatorDashboard />} />
        <Route path="/operator/new" element={<NewSubmission />} />
        <Route path="/operator/new/:formId" element={<NewSubmission />} />
        <Route path="/operator/submissions" element={<Submissions />} />
        <Route path="/operator/submissions/:id" element={<CaseDetail />} />
        <Route path="/operator/sites" element={<MySites />} />
        <Route path="/operator/apply" element={<ApplyNewSite />} />
        <Route path="/operator/apply/:announcementId" element={<ApplyNewSite />} />
        <Route path="/operator/applications" element={<MyApplications />} />
        <Route path="/operator/equipment" element={<MyEquipment />} />
        <Route path="/operator/tickets" element={<MyTickets />} />
        <Route path="/operator/account" element={<MyAccount />} />
        <Route path="/operator/documents" element={<Documents />} />
        <Route path="/operator/announcements" element={<OperatorAnnouncements />} />
        <Route path="/operator/accessibility" element={<AccessibilitySettings />} />
      </Route>
    </Routes>
  );
}
