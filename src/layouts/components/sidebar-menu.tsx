import {
  PiBank,
  PiBankBold,
  PiBankFill,
  PiBuildingOffice,
  PiBuildingOfficeBold,
  PiCalendarCheck,
  PiCalendarCheckBold,
  PiCalendarCheckFill,
  PiIdentificationBadge,
  PiIdentificationBadgeBold,
  PiSquaresFour,
  PiSquaresFourBold,
  PiSquaresFourFill,
  PiUsers,
  PiUsersBold,
  PiUsersFill,
} from "react-icons/pi";
import { NavLink } from "react-router";

export function SidebarMenu() {
  const MENUS = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: PiSquaresFour,
      // activeIcon: PiSquaresFourFill,
      activeIcon: PiSquaresFourBold,
      path: "/",
    },
    {
      id: "department",
      label: "Department",
      icon: PiBuildingOffice,
      // activeIcon: PiUsersFill,
      activeIcon: PiBuildingOfficeBold,
      path: "/department",
    },
    {
      id: "position",
      label: "Position",
      icon: PiIdentificationBadge,
      // activeIcon: PiUsersFill,
      activeIcon: PiIdentificationBadgeBold,
      path: "/position",
    },
    {
      id: "employee",
      label: "Employee",
      icon: PiUsers,
      // activeIcon: PiUsersFill,
      activeIcon: PiUsersBold,
      path: "/employee",
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: PiBank,
      // activeIcon: PiBankFill,
      activeIcon: PiBankBold,
      path: "/payroll",
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: PiCalendarCheck,
      // activeIcon: PiCalendarCheckFill,
      activeIcon: PiCalendarCheckBold,
      path: "/attendance",
    },
  ];

  return (
    <div className="flex flex-col gap-1 px-4 py-2">
      {MENUS.map((menu) => {
        return (
          <NavLink key={menu.id} to={menu.path} end={menu.path === "/"}>
            {({ isActive }) => {
              const Icon = isActive ? menu.activeIcon : menu.icon;

              return (
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-200 cursor-pointer select-none ${isActive ? "font-medium text-primary bg-primary/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"}`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive ? "text-primary" : "text-muted-foreground"
                    }
                  />
                  <span className="tracking-wide">{menu.label}</span>
                </div>
              );
            }}
          </NavLink>
        );
      })}
    </div>
  );
}
