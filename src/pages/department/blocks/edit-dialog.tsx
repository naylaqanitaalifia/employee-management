import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Department } from "../page";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiConfig } from "@/config/api.config";
import axios from "axios";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  department: Department | null;
}

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

export function EditDialog({ open, onOpenChange, department }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (open && department) {
      form.reset({
        name: department.name,
      });
    } else if (!open) {
      form.reset();
    }
  }, [open, department]);

  const update = useMutation({
    mutationFn: async (values: SchemaType) => {
      const { data } = await axios.put(
        `${apiConfig.API_URL}/departments/${department?.id}`,
        values,
      );

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["departments"],
      });

      onOpenChange(false);
    },
  });

  const onSubmit = (values: SchemaType) => {
    update.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180">
        <DialogHeader>
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Update the department information below.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="scrollable-y overflow-scroll">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter department name" {...field} />
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
                  disabled={update.isPending}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="default"
                  className="w-30"
                  disabled={update.isPending}
                >
                  {update.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
