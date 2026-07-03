import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PiWarning } from "react-icons/pi";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDialog({ open, onOpenChange }: Props) {
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
              This action cannot be undone. All data for this employee will be
              permanently removed.
            </p>
          </div>

          <div className="flex w-full justify-end gap-3">
            <Button
              variant="outline"
              className="w-20"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" className="w-30">
              Yes, delete it
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
