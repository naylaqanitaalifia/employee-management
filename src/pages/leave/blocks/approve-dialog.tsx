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
import type { Employee } from "@/hooks/use-employees";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PiWarning } from "react-icons/pi";
import type { Leave } from "./columns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave: Leave | null;
}

export function ApproveDialog({ open, onOpenChange, leave }: Props) {
  const queryClient = useQueryClient();

  const remove = useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(
        `${apiConfig.API_URL}/employees/${leave?.id}`,
      );

      return data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      onOpenChange(false);
    },
  });

  const onSubmit = () => {
    remove.mutate();
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Dialog</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <DialogBody className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="src/assets/images/profile.jpeg"
                alt=""
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex flex-col">
                <p className="text-sm font-semibold">John Doe</p>
                <span className="text-xs text-muted-foreground">
                  Software Engineer
                </span>
              </div>
            </div>
            <Badge
              variant="warning"
              appearance="outline"
              className="rounded-full"
            >
              Waiting
            </Badge>
          </div>
          <Card className="w-full">
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p>Jenis Cuti</p>
                <p>Cuti Tahunan</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Tanggal</p>
                <p>14 – 16 Jul 2026</p>
              </div>
              <div className="flex items-center justify-between">
                <p>Durasi</p>
                <p>3 days</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-semibold text-muted-foreground">Reason</h4>
                <p>Menghadiri acara pernikahan keluarga di luar kota.</p>
              </div>
            </CardContent>
          </Card>

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
              Approve
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
