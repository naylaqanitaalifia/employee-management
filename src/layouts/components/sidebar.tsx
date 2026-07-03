import { SidebarHeader } from "./sidebar-header";
import { SidebarMenu } from "./sidebar-menu";

export function Sidebar() {
  return (
    <div className="w-64 min-h-screen border-r border-muted-foreground/15">
      <SidebarHeader />
      <SidebarMenu />
    </div>
  );
}
