import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiConfig } from "@/config/api.config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Leave } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BriefcaseBusiness,
  CalendarDays,
  Clock,
  MessageSquareText,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { capitalize, formatDateRange } from "@/lib/helpers";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave: Leave | null;
  onReject: (leave: Leave) => void;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "destructive";
    case "cancelled":
      return "secondary";
    default:
      return "secondary";
  }
};

const leaveTypeMap: Record<string, string> = {
  annual: "Cuti Tahunan",
  sick: "Cuti Sakit",
  unpaid: "Cuti Tanpa Gaji",
  maternity: "Cuti Melahirkan",
  paternity: "Cuti Ayah",
  marriage: "Cuti Pernikahan",
  bereavement: "Cuti Duka",
  special: "Cuti Khusus",
};

export function DetailDialog({ open, onOpenChange, leave, onReject }: Props) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["leave", leave?.id],
    queryFn: async () => {
      if (!leave?.id) {
        throw new Error("Leave ID is required");
      }

      const { data } = await axios.get(
        `${apiConfig.API_URL}/leaves/${leave?.id}`,
      );
      return data.data;
    },
    enabled: open && !!leave?.id,
  });

  const { type, days, start_date, end_date, reason, status, employee } =
    data ?? {};

  const approve = useMutation({
    mutationFn: async () => {
      if (!leave?.id) {
        throw new Error("Leave ID is required");
      }

      const { data } = await axios.patch(
        `${apiConfig.API_URL}/leaves/${leave?.id}/approve`,
      );
      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });

      toast.success("Leave approved successfully");

      onOpenChange(false);
    },
  });

  const handleApprove = () => {
    approve.mutate();
  };

  if (!data) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Leave Approval</DialogTitle>
          <DialogDescription>
            Review the details before making a decision.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col items-center justify-center gap-4">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="src/assets/images/profile.jpeg"
                alt=""
                className="size-12 rounded-full object-cover"
              />

              <div>
                <p className="text-sm font-semibold">{employee?.name || "-"}</p>
                <span className="text-xs text-muted-foreground">
                  {employee?.position?.name || "-"}
                </span>
              </div>
            </div>
            <Badge
              variant={getStatusVariant(status ?? "") as any}
              appearance="light"
              className="rounded-full"
            >
              {capitalize(status ?? "-")}
            </Badge>
          </div>
          <Card className="w-full">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BriefcaseBusiness size={16} />
                  <p className="text-sm">Types of Leave</p>
                </div>

                <p className="text-sm font-medium">
                  {(leaveTypeMap[type] ?? type) || "-"}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays size={16} />
                  <p>Date</p>
                </div>
                <p className="text-sm font-medium">{`${formatDateRange(start_date, end_date)}`}</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock size={16} />
                  <p>Duration</p>
                </div>
                <p className="text-sm font-medium">{`${days} days` || days}</p>
              </div>

              <Separator />

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageSquareText size={16} />
                  <h4 className="text-muted-foreground">Reason</h4>
                </div>
                <p className="text-sm leading-relaxed text-foreground">
                  {reason}
                </p>
              </div>
            </CardContent>
          </Card>

          {leave?.status === "pending" && (
            <div className="flex w-full justify-end gap-3">
              <Button
                variant="destructive"
                appearance="outline"
                className="w-30"
                onClick={() => {
                  if (leave) {
                    onReject(leave);
                  }
                }}
              >
                Reject
              </Button>
              <Button
                variant="primary"
                className="w-30"
                onClick={handleApprove}
                disabled={approve.isPending}
              >
                Approve
              </Button>
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
