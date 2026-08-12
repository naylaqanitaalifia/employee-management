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
import type { Payroll } from "@/hooks/use-payrolls";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PiWarning } from "react-icons/pi";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payroll: Payroll | null;
  action: "process" | "pay";
}

export function ProcessDialog({ open, onOpenChange, payroll, action }: Props) {
  const queryClient = useQueryClient();

  const isPaying = action === "pay";

  const process = useMutation({
    mutationFn: async () => {
      if (!payroll) return;

      const status = isPaying ? "paid" : "processed";

      const { data } = await axios.patch(
        `${apiConfig.API_URL}/payrolls/${payroll?.id}/status`,
        {
          status,
        },
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["payrolls"],
      });

      toast.success(
        isPaying
          ? "Payroll paid successfully"
          : "Payroll processed successfully",
      );

      onOpenChange(false);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            (isPaying ? "Failed to paid payroll" : "Failed to process payroll"),
        );
        return;
      }

      toast.error(
        isPaying ? "Failed to paid payroll" : "Failed to process payroll",
      );
    },
  });

  const onSubmit = () => {
    if (!payroll) return;

    process.mutate();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* <DialogHeader>
          <DialogTitle>Delete Dialog</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader> */}

        <DialogBody className="flex flex-col items-center justify-center gap-4">
          <div className="size-16 flex items-center justify-center rounded-full bg-primary/10 text-primary">
            <PiWarning className="size-8" />
          </div>

          <div className="text-center space-y-1">
            <p className="font-semibold text-lg">
              {isPaying ? "Mark Payroll as Paid" : "Process Payroll"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isPaying
                ? "Are you sure you want to pay this payroll?"
                : "Are you sure you want to process this payroll?"}
            </p>
          </div>

          <div className="flex w-full justify-end gap-3">
            <Button
              variant="outline"
              className="w-20"
              disabled={process.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="w-32"
              onClick={onSubmit}
              disabled={process.isPending}
            >
              {isPaying ? "Yes, mark as paid" : "Yes, process it"}
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
