import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Leave } from "./columns";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leave: Leave | null;
}

const formSchema = z.object({
  rejection_reason: z
    .string()
    .trim()
    .min(1, { message: "Rejection reason is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

export function RejectDialog({ open, onOpenChange, leave }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rejection_reason: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        rejection_reason: "",
      });
    }
  }, [open]);

  const reject = useMutation({
    mutationFn: async (values: any) => {
      const { data } = await axios.patch(
        `${apiConfig.API_URL}/leaves/${leave?.id}/reject`,
        values,
      );
      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });

      toast.success("Leave rejected successfully");

      onOpenChange(false);
    },
  });

  const onSubmit = (values: SchemaType) => {
    reject.mutate({
      ...values,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180">
        <DialogHeader>
          <DialogTitle>Reject Leave</DialogTitle>
          <DialogDescription>
            Please provide the reason for rejecting this request.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="scrollable-y overflow-scroll">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Reason */}
              <FormField
                control={form.control}
                name="rejection_reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rejection Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter reject reason"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 mt-8">
                <Button
                  type="button"
                  variant="outline"
                  className="w-20"
                  disabled={reject.isPending}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-30"
                  disabled={reject.isPending}
                >
                  {reject.isPending ? "Loading..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
