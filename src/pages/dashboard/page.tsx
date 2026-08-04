import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MonthlyAttendanceChart } from "./blocks/monthly-attendance-chart";
import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./blocks/columns";
import { useEmployees } from "@/hooks/use-employees";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";
import { addDays, format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarDays, ChevronRight, Clock3, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const schedules = [
  {
    id: 1,
    time: "09:00",
    title: "HR Meeting",
    location: "Meeting Room A",
  },
  {
    id: 2,
    time: "11:00",
    title: "Interview",
    location: "Candidate: John Doe",
  },
  {
    id: 3,
    time: "14:30",
    title: "Payroll Review",
    location: "Finance Department",
  },
  {
    id: 4,
    time: "16:00",
    title: "Employee Onboarding",
    location: "Training Room",
  },
];

export function Page() {
  const columns = getColumns();
  const { data: employees = [] } = useEmployees();
  // const [date, setDate] = useState<DateRange | undefined>({
  //   from: new Date(new Date().getFullYear(), 0, 12),
  //   to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  // });
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your organization members and their roles.
        </p>
      </div>

      <div className="grid grid-cols-8 gap-4">
        <div className="flex flex-col gap-4 col-span-5">
          <div className="grid grid-cols-3 gap-4">
            <Card className="px-5 py-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Employees
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight">50</h2>

                  <p className="mt-1 text-xs text-emerald-600">+4 this month</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <User className="size-5 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="px-5 py-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Employees
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight">50</h2>

                  <p className="mt-1 text-xs text-emerald-600">+4 this month</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <User className="size-5 text-primary" />
                </div>
              </div>
            </Card>

            <Card className="px-5 py-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Employees
                  </p>

                  <h2 className="mt-2 text-3xl font-bold tracking-tight">50</h2>

                  <p className="mt-1 text-xs text-emerald-600">+4 this month</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <User className="size-5 text-primary" />
                </div>
              </div>
            </Card>
          </div>

          <div className="col-span-3">
            <MonthlyAttendanceChart />
          </div>

          <DataTable columns={columns} data={employees} />
        </div>

        <div className="flex flex-col gap-4 col-span-3">
          <Card>
            <CardContent>
              <Calendar
                mode="single"
                // defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                captionLayout="dropdown"
                className="w-full"
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Event</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-background p-4 transition-colors hover:bg-muted/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 shrink-0 text-center">
                    <p className="text-2xl font-bold leading-none">09</p>
                    <p className="mt-1 text-xs uppercase text-muted-foreground">
                      Thu
                    </p>
                  </div>
                  <div className="min-w-0 flex-1 space-y-1 border-l pl-4">
                    <p className="text-xs text-primary">
                      Stone and Chald Melbourne, Docklands
                    </p>
                    <p className="font-bold">Startups metrics and dashboards</p>
                    <p className="text-muted-foreground/70 line-clamp-2">
                      The 5 keys metrics to drive your startup + how to build a
                      dashboard to track them. Your're a startup, which means
                      traditional finance metrics won't cut it. By the time
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
