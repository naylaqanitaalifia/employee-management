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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { useDepartments } from "@/hooks/use-departments";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }),
  department_id: z.string().min(1, { message: "Department is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

export function AddDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const { data: departments = [] } = useDepartments();

  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      department_id: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const create = useMutation({
    mutationFn: async (values: SchemaType) => {
      const { data } = await axios.post(
        `${apiConfig.API_URL}/positions`,
        values,
      );

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["positions"],
      });

      toast.success("Position created successfully");

      onOpenChange(false);
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "An unexpected error";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const onSubmit = (values: SchemaType) => {
    create.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180">
        <DialogHeader>
          <DialogTitle>Add Position</DialogTitle>
          <DialogDescription>
            Complete the form below to add a new position to the system.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="scrollable-y overflow-scroll">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* NAME */}
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

              {/* DEPARTMENTS */}
              <FormField
                control={form.control}
                name="department_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <FormControl>
                      <Popover
                        open={departmentPopoverOpen}
                        onOpenChange={setDepartmentPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            placeholder={!field.value}
                          >
                            {field.value
                              ? departments.find(
                                  (department) => department.id === field.value,
                                )?.name
                              : "Select department"}
                            <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0"
                          align="start"
                          onWheel={(e) => e.stopPropagation()}
                        >
                          <Command>
                            <CommandInput placeholder="Search..." />
                            <CommandList className="max-h-60 overflow-y-auto w-full">
                              <CommandEmpty>No department found.</CommandEmpty>
                              <CommandGroup>
                                {departments.map((department) => (
                                  <CommandItem
                                    key={department.id}
                                    value={department.name}
                                    onSelect={() => {
                                      field.onChange(department.id);
                                      setDepartmentPopoverOpen(false);
                                    }}
                                  >
                                    {department.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
                  disabled={create.isPending}
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-30"
                  disabled={create.isPending}
                >
                  {create.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
