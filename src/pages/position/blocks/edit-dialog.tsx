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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Position } from "../page";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiConfig } from "@/config/api.config";
import axios from "axios";
import { useDepartments } from "@/hooks/use-departments";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: Position | null;
}

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }),
  department_id: z.string().min(1, { message: "Department is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

export function EditDialog({ open, onOpenChange, position }: Props) {
  const queryClient = useQueryClient();
  const { data: departments = [] } = useDepartments();

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department_id: "",
    },
  });

  useEffect(() => {
    if (open && position) {
      form.reset({
        name: position.name,
        department_id: position.department.id,
      });
    } else if (!open) {
      form.reset();
    }
  }, [open, position]);

  const update = useMutation({
    mutationFn: async (values: SchemaType) => {
      const { data } = await axios.put(
        `${apiConfig.API_URL}/positions/${position?.id}`,
        values,
      );

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["positions"],
      });

      toast.success("Position updated successfully");

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
          <DialogTitle>Edit Position</DialogTitle>
          <DialogDescription>
            Update the position information below.
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
                      <Input placeholder="Enter position name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department */}
              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((department) => (
                            <SelectItem
                              key={department.id}
                              value={department.id}
                            >
                              {department.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                  variant="primary"
                  className="w-30"
                  disabled={update.isPending}
                >
                  {update.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
