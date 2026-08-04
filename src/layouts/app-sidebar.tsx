"use client";

import * as React from "react";

import { NavMain } from "@/layouts/components/nav-main";
import { NavProjects } from "@/layouts/components/nav-projects";
import { NavSecondary } from "@/layouts/components/nav-secondary";
import { NavUser } from "@/layouts/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  TerminalIcon,
  LayoutDashboard,
  Building2,
  IdCardLanyard,
  Users,
  CalendarCheck,
  BanknoteArrowDown,
  PlaneTakeoff,
} from "lucide-react";

const data = {
  user: {
    name: "Nayla Qanita Alifia",
    email: "naylaqanita286@gmail.com",
    avatar: "/assets/images/profile.jpeg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: <LayoutDashboard />,
      // isActive: true,
    },
    {
      title: "Department",
      url: "/department",
      icon: <Building2 />,
      // isActive: true,
    },
    {
      title: "Position",
      url: "/position",
      icon: <IdCardLanyard />,
      // isActive: true,
    },
    {
      title: "Employee",
      url: "/employee",
      icon: <Users />,
      // isActive: true,
    },
    {
      title: "Attendance",
      url: "/attendance",
      icon: <CalendarCheck />,
      // isActive: true,
    },
    {
      title: "Leave",
      url: "/leave",
      icon: <PlaneTakeoff />,
      // isActive: true,
    },
    {
      title: "Payroll",
      url: "/payroll",
      icon: <BanknoteArrowDown />,
      // isActive: true,
    },
    {
      title: "Playground",
      url: "#",
      icon: <TerminalSquareIcon />,
      // isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    // {
    //   title: "Models",
    //   url: "#",
    //   icon: <BotIcon />,
    //   items: [
    //     {
    //       title: "Genesis",
    //       url: "#",
    //     },
    //     {
    //       title: "Explorer",
    //       url: "#",
    //     },
    //     {
    //       title: "Quantum",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Documentation",
    //   url: "#",
    //   icon: <BookOpenIcon />,
    //   items: [
    //     {
    //       title: "Introduction",
    //       url: "#",
    //     },
    //     {
    //       title: "Get Started",
    //       url: "#",
    //     },
    //     {
    //       title: "Tutorials",
    //       url: "#",
    //     },
    //     {
    //       title: "Changelog",
    //       url: "#",
    //     },
    //   ],
    // },
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: <Settings2Icon />,
    //   items: [
    //     {
    //       title: "General",
    //       url: "#",
    //     },
    //     {
    //       title: "Team",
    //       url: "#",
    //     },
    //     {
    //       title: "Billing",
    //       url: "#",
    //     },
    //     {
    //       title: "Limits",
    //       url: "#",
    //     },
    //   ],
    // },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
    {
      title: "Feedback",
      url: "#",
      icon: <SendIcon />,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold">WorkSphere</span>
                  <span className="truncate text-xs">HR Management System</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
