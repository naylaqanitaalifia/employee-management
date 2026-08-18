import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ChevronDownIcon } from "lucide-react";
import { format } from "date-fns";
import { useEmployees } from "@/hooks/use-employees";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LEAVES_TYPE = [
  { name: "Cuti Tahunan", id: "annual" },
  { name: "Cuti Sakit", id: "sick" },
  { name: "Cuti Tanpa Gaji", id: "unpaid" },
  { name: "Cuti Melahirkan", id: "maternity" },
  { name: "Cuti Ayah", id: "paternity" },
  { name: "Cuti Pernikahan", id: "marriage" },
  { name: "Cuti Duka", id: "bereavement" },
  { name: "Cuti Khusus", id: "special" },
];

const formSchema = z.object({
  employee_id: z.string().trim().min(1, { message: "Employee is required." }),
  type: z.string().trim().min(1, { message: "Type is required." }),
  date: z.object({
    from: z.date({ message: "Start date is required." }),
    to: z.date({ message: "End date is required." }),
  }),
  reason: z.string().trim().min(1, { message: "Reason is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

type LeavePayload = {
  employee_id: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
};

export function AddDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const { data: employees = [] } = useEmployees();

  const [employeePopoverOpen, setEmployeePopoverOpen] = useState(false);
  const [typePopoverOpen, setTypePopoverOpen] = useState(false);

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: "",
      type: "",
      date: undefined,
      reason: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        employee_id: "",
        type: "",
        date: undefined,
        reason: "",
      });
    }
  }, [open]);

  const create = useMutation({
    mutationFn: async (values: LeavePayload) => {
      const { data } = await axios.post(`${apiConfig.API_URL}/leaves`, values);
      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["leaves"],
      });

      toast.success("Leave created successfully");

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
    create.mutate({
      ...values,
      start_date: format(values.date.from, "yyyy-MM-dd"),
      end_date: format(values.date.to, "yyyy-MM-dd"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180">
        <DialogHeader>
          <DialogTitle>Add Leave</DialogTitle>
          <DialogDescription>
            Complete the form below to add a new employee to the system.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="scrollable-y overflow-scroll">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Employee */}
              <FormField
                control={form.control}
                name="employee_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Employee</FormLabel>
                    <FormControl>
                      <Popover
                        open={employeePopoverOpen}
                        onOpenChange={setEmployeePopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            placeholder={!field.value}
                          >
                            {field.value
                              ? employees.find(
                                  (employee) => employee.id === field.value,
                                )?.name
                              : "Select employee"}
                            <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="p-0 w-[320px]" align="start">
                          <Command>
                            <CommandInput placeholder="Search..." />
                            <CommandList>
                              <CommandEmpty>No employee found.</CommandEmpty>
                              <CommandGroup>
                                {employees.map((employee) => (
                                  <CommandItem
                                    key={employee.id}
                                    value={employee.id}
                                    onSelect={() => {
                                      field.onChange(employee.id);
                                      setEmployeePopoverOpen(false);
                                    }}
                                  >
                                    {employee.name}
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
              {/* Type */}
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <FormControl>
                      <Popover
                        open={typePopoverOpen}
                        onOpenChange={setTypePopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            placeholder={!field.value}
                          >
                            {field.value
                              ? LEAVES_TYPE.find(
                                  (contract_type) =>
                                    contract_type.id === field.value,
                                )?.name
                              : "Select type"}
                            <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent className="p-0 w-[320px]" align="start">
                          <Command>
                            <CommandInput placeholder="Search..." />
                            <CommandList>
                              <CommandEmpty>No type found.</CommandEmpty>
                              <CommandGroup>
                                {LEAVES_TYPE.map((contract_type) => (
                                  <CommandItem
                                    key={contract_type.id}
                                    value={contract_type.name}
                                    onSelect={() => {
                                      field.onChange(contract_type.id);
                                      setTypePopoverOpen(false);
                                    }}
                                  >
                                    {contract_type.name}
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

              {/* Start Date - End Ddate */}
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <DateRangePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reason */}
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reason</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter reason"
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
