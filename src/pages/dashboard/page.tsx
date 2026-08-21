import { Card, CardContent } from "@/components/ui/card";
import { getColumns } from "./blocks/leave-columns";
import { format } from "date-fns";
import { DataTable } from "@/components/ui/data-table";
import { useLeaves } from "@/hooks/use-leaves";
import { AttendanceCard } from "./blocks/attendance-card";
import { WeeklyCalendar } from "@/components/ui/weekly-calendar";
import { useState } from "react";

const schedules = [
  {
    id: 1,
    time: "09:00",
    location: "Meeting Room A",
    title: "Weekly HR Team Meeting",
    description:
      "Weekly meeting to review employee attendance, leave requests, and ongoing HR activities.",
  },
  {
    id: 2,
    time: "14:00",
    location: "Training Room",
    title: "Employee Onboarding",
    description:
      "Introduction session for new employees covering company policies, workplace guidelines, and team procedures.",
  },
  {
    id: 3,
    time: "15:00",
    location: "Meeting Room B",
    title: "Performance Review",
    description:
      "Monthly performance review to discuss employee progress, achievements, and areas for improvement.",
  },
  {
    id: 4,
    time: "12:00",
    location: "Finance Department",
    title: "Payroll Review",
    description:
      "Review payroll data, employee allowances, deductions, overtime, and payment status before processing.",
  },
  {
    id: 5,
    time: "10:00",
    location: "Meeting Room A",
    title: "Leave Request Review",
    description:
      "Review and approve pending employee leave requests based on schedules and available leave balances.",
  },
];

export function Page() {
  const leaveColumns = getColumns();
  const { data: leaves = [] } = useLeaves();
  // const [date, setDate] = useState<DateRange | undefined>({
  //   from: new Date(new Date().getFullYear(), 0, 12),
  //   to: addDays(new Date(new Date().getFullYear(), 0, 12), 30),
  // });

  const [date, setDate] = useState<Date | undefined>(new Date());

  const today = new Date();
  const formattedDate = format(today, "EEEE, MMMM dd yyyy");

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Good Afternoon, Nayla 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here’s what’s happening with your workspace today.
        </p>
      </div>

      <div className="">
        <AttendanceCard />
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent>
            <div className="flex flex-col gap-2">
              <h6 className="text-sm text-muted-foreground">
                Remaining Annual Leave
              </h6>
              <p className="text-xl font-semibold">
                8 / 12{" "}
                <span className="text-xs text-muted-foreground">Days</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex flex-col gap-2">
              <h6 className="text-sm text-muted-foreground">
                Monthly Attendance
              </h6>
              <p className="text-xl font-semibold">
                19 / 19{" "}
                <span className="text-xs text-muted-foreground">Days</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex flex-col gap-2">
              <h6 className="text-sm text-muted-foreground">Pending Request</h6>
              <p className="text-xl font-semibold">
                2{" "}
                <span className="text-xs text-muted-foreground">Requests</span>
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <div className="flex flex-col gap-2">
              <h6 className="text-sm text-muted-foreground">Total Overtime</h6>
              <p className="text-xl font-semibold">
                12.5{" "}
                <span className="text-xs text-muted-foreground">Hours</span>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* <div className="flex flex-col gap-4 col-span-5">
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
        </div> */}
        <div className="flex flex-col gap-4 col-span-8">
          <h3>Recent Requests</h3>
          <DataTable columns={leaveColumns} data={leaves} />
        </div>

        <div className="flex flex-col gap-4 col-span-4">
          <Card>
            <CardContent className="space-y-6">
              <WeeklyCalendar value={date} onChange={setDate} />

              <div className="flex flex-col gap-4">
                <h4 className="text-base">Schedule</h4>

                <div className="max-h-[200px] overflow-y-scroll space-y-6">
                  {[...schedules]
                    .sort((a, b) => a.time.localeCompare(b.time))
                    .map((schedule) => (
                      <div className="flex items-start gap-4" key={schedule.id}>
                        <span className="w-8 shrink-0 text-xs text-muted-foreground">
                          {schedule.time}
                        </span>
                        <div className="min-w-0 flex-1 space-y-1 border-l pl-4">
                          <p className="text-xs text-primary">
                            {schedule.location}
                          </p>
                          <p className="font-bold">{schedule.title}</p>
                          <p className="text-muted-foreground/70 line-clamp-2">
                            {schedule.description}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
