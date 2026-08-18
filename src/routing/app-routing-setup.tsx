import { MainLayout } from "@/layouts/layout";
import { Route, Routes } from "react-router";
import { lazyLayout, SuspenseOutlet } from "@/routing/routing-helpers";

const LoginPage = lazyLayout(() => import("@/pages/auth"));
const DashboardPage = lazyLayout(() => import("@/pages/dashboard"));
const DepartmentPage = lazyLayout(() => import("@/pages/department"));
const PositionPage = lazyLayout(() => import("@/pages/position"));
const EmployeePage = lazyLayout(() => import("@/pages/employee"));
const AttendancePage = lazyLayout(() => import("@/pages/attendance"));
const LeavePage = lazyLayout(() => import("@/pages/leave"));
const PayrollPage = lazyLayout(() => import("@/pages/payroll"));

export function AppRoutingSetup() {
  return (
    <Routes>
      <Route path="/signin" element={<LoginPage />} />
      <Route element={<MainLayout />}>
        <Route element={<SuspenseOutlet />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/department" element={<DepartmentPage />} />
          <Route path="/position" element={<PositionPage />} />
          <Route path="/employee" element={<EmployeePage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/leave" element={<LeavePage />} />
          <Route path="/payroll" element={<PayrollPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
