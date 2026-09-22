import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatFullDate } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";
import { capitalize } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Coffee, LogOut, MapPin } from "lucide-react";
import { format } from "date-fns";
import { useEffect, useState } from "react";

const schedules = [
  {
    id: 1,
    time: "09:00",
    title: "HR Meeting",
    location: "Meeting Room A",
    status: "present",
  },
  {
    id: 2,
    time: "11:00",
    title: "Interview",
    location: "Candidate: John Doe",
    status: "late",
  },
  {
    id: 3,
    time: "14:30",
    title: "Payroll Review",
    location: "Finance Department",
    status: "absent",
  },
  {
    id: 4,
    time: "16:00",
    title: "Employee Onboarding",
    location: "Training Room",
    status: "absent",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "present":
      return "success";
    case "processed":
      return "info";
    case "late":
      return "warning";
    case "absent":
      return "destructive";
    case "cancelled":
      return "secondary";
    default:
      return "secondary";
  }
};

export function AttendanceCard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Card>
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-primary">Today's Attendance</CardTitle>
        <CardDescription className="text-secondary-foreground">
          {formatFullDate(new Date())} • Shift Regular (08:00 - 17:00)
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:justify-between">
          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:max-w-2xl">
            <div className="grid grid-cols-2 gap-4 border-b pb-4 sm:grid-cols-4">
              <div className="flex flex-col gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-muted-foreground">Clocked In</h4>
                <span className="text-base sm:text-lg">08:02 AM</span>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-muted-foreground">Clocked Out</h4>
                <span className="text-base sm:text-lg">--</span>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-muted-foreground">Duration</h4>
                <span className="text-base sm:text-lg">5h 22m</span>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-xs sm:text-sm font-bold text-muted-foreground">Status</h4>
                <Badge
                  variant={getStatusVariant(schedules[0]?.status ?? "") as any}
                  appearance="light"
                  className="w-fit rounded-full"
                >
                  {capitalize(schedules[0]?.status ?? "-")}
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin size={14} />
                <span className="text-xs">Office • Jakarta</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <Coffee size={14} />
                <span className="text-xs">Break 12:00 - 13:00</span>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col items-center justify-center gap-4 border-t pt-6 lg:w-64 lg:border-t-0 lg:pt-0 xl:w-80">
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-3xl sm:text-4xl font-semibold tabular-nums">
                {format(time, "HH:mm:ss")}
              </h1>
              <span className="text-muted-foreground">Current Time</span>
            </div>

            <Button variant="primary" className="w-full">
              Clock Out
              <LogOut />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
