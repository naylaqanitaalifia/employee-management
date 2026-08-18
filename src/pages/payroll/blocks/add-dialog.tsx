import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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
import { MonthPicker } from "@/components/ui/month-picker";
import { CurrencyInput } from "@/components/ui/currency-input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  employee_id: z.string().trim().min(1, { message: "Employee is required." }),
  period_month: z.date({
    message: "Period month is required.",
  }),
  basic_salary: z
    .string()
    .trim()
    .min(1, { message: "Basic salary is required." }),
  allowance: z.string().trim().min(1, { message: "Allowance is required." }),
  overtime_pay: z
    .string()
    .trim()
    .min(1, { message: "Overtime pay is required." }),
  deduction: z.string().trim().min(1, { message: "Deduction is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

type PayrollPayload = {
  employee_id: string;
  period_month: string;
  basic_salary: string;
  allowance: string;
  overtime_pay: string;
  deduction: string;
};

export function AddDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const { data: employees = [] } = useEmployees();

  const [employeePopoverOpen, setEmployeePopoverOpen] = useState(false);

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      employee_id: "",
      period_month: undefined,
      basic_salary: "",
      allowance: "",
      overtime_pay: "",
      deduction: "",
    },
  });

  useEffect(() => {
    if (!open) {
      form.reset({
        employee_id: "",
        period_month: undefined,
        basic_salary: "",
        allowance: "",
        overtime_pay: "",
        deduction: "",
      });
    }
  }, [open]);

  const create = useMutation({
    mutationFn: async (values: PayrollPayload) => {
      const { data } = await axios.post(
        `${apiConfig.API_URL}/payrolls`,
        values,
      );
      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["payrolls"],
      });

      toast.success("Payroll created successfully");

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
      period_month: format(values.period_month, "yyyy-MM-05"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180">
        <DialogHeader>
          <DialogTitle>Add Payroll</DialogTitle>
          <DialogDescription>
            Complete the form below to create a new payroll record for an
            employee.
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
              {/* Period Month */}
              <FormField
                control={form.control}
                name="period_month"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Period Month</FormLabel>
                    <FormControl>
                      <MonthPicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Basic Salary */}
              <FormField
                control={form.control}
                name="basic_salary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Basic Salary</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="Enter basic salary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Allowance */}
              <FormField
                control={form.control}
                name="allowance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Allowance</FormLabel>
                    <FormControl>
                      <CurrencyInput placeholder="Enter allowance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Overtime Pay */}
              <FormField
                control={form.control}
                name="overtime_pay"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Overtime Pay</FormLabel>
                    <FormControl>
                      <CurrencyInput
                        placeholder="Enter overtime pay"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Deduction */}
              <FormField
                control={form.control}
                name="deduction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deduction</FormLabel>
                    <FormControl>
                      <CurrencyInput placeholder="Enter deduction" {...field} />
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
