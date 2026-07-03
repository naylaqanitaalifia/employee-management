import { Outlet } from "react-router";
import { Sidebar } from "./components/sidebar";

export function MainLayout() {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
