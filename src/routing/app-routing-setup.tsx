import { MainLayout } from "@/layouts/layout";
import { Route, Routes } from "react-router";
import { Layout as DashboardPage } from "@/pages/dashboard";
import { Layout as DepartmentPage } from "@/pages/department";
import { Layout as PositionPage } from "@/pages/position";
import { Layout as EmployeePage } from "@/pages/employee";
import { Layout as AttendancePage } from "@/pages/attendance";
import { Layout as LeavePage } from "@/pages/leave";
import { Layout as PayrollPage } from "@/pages/payroll";

export function AppRoutingSetup() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="department" element={<DepartmentPage />} />
        <Route path="position" element={<PositionPage />} />
        <Route path="employee" element={<EmployeePage />} />
        <Route path="attendance" element={<AttendancePage />} />
        <Route path="leave" element={<LeavePage />} />
        <Route path="payroll" element={<PayrollPage />} />
      </Route>
    </Routes>
  );
}
