import { Card } from "@/components/ui/card";
import { useLeaves } from "@/hooks/use-leaves";
import { CalendarCheck2, CalendarDays, CalendarX2, Clock3 } from "lucide-react";

export function LeaveCards() {
  const { data: leaves = [] } = useLeaves();
  console.log(leaves);
  const total = leaves.length;
  const pending = leaves.filter((leave) => leave.status === "pending").length;
  const approved = leaves.filter((leave) => leave.status === "approved").length;
  const rejected = leaves.filter((leave) => leave.status === "rejected").length;

  return (
    <div className="grid grid-cols-4 gap-4">
      <Card>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-full">
            <CalendarDays size={18} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <h6 className="text-sm text-muted-foreground">Total Leave</h6>
            <p className="text-xl font-semibold">{total}</p>
            <span className="text-xs text-muted-foreground">Days</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="bg-warning-soft/80 text-warning flex h-11 w-11 items-center justify-center rounded-full">
            <Clock3 size={18} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <h6 className="text-sm text-muted-foreground">Pending</h6>
            <p className="text-xl font-semibold">{pending}</p>
            <span className="text-xs text-muted-foreground">Requests</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="bg-success-soft/50 text-success flex h-11 w-11 items-center justify-center rounded-full">
            <CalendarCheck2 size={18} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <h6 className="text-sm text-muted-foreground">Approved</h6>
            <p className="text-xl font-semibold">{approved}</p>
            <span className="text-xs text-muted-foreground">Requests</span>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between px-4 py-2">
          <div className="bg-destructive-soft/50 text-destructive flex h-11 w-11 items-center justify-center rounded-full">
            <CalendarX2 size={18} />
          </div>
          <div className="flex flex-col items-end gap-1">
            <h6 className="text-sm text-muted-foreground">Rejected</h6>
            <p className="text-xl font-semibold">{rejected}</p>
            <span className="text-xs text-muted-foreground">Requests</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
