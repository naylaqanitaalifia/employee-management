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
import type { Leave } from "@/hooks/use-leaves";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PiWarning } from "react-icons/pi";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave: Leave | null;
}

export function DeleteDialog({ open, onOpenChange, leave }: Props) {
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `${apiConfig.API_URL}/leaves/${leave?.id}`,
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });

      toast.success("Leave deleted successfully");

      onOpenChange(false);
    },
  });

  const onSubmit = () => {
    remove.mutate();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        {/* <DialogHeader>
          <DialogTitle>Delete Dialog</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader> */}

        <DialogBody className="flex flex-col items-center justify-center gap-4">
          <div className="size-16 flex items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <PiWarning className="size-8" />
          </div>

          <div className="text-center space-y-1">
            <p className="font-semibold text-lg">Are you sure?</p>
            <p className="text-sm text-muted-foreground">
              This action cannot be undone. All data for this leave will be
              permanently removed.
            </p>
          </div>

          <div className="flex w-full justify-end gap-3">
            <Button
              variant="outline"
              className="w-20"
              disabled={remove.isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="w-30"
              onClick={onSubmit}
              disabled={remove.isPending}
            >
              Yes, delete it
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
