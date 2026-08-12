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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import type { Payroll } from "@/hooks/use-payrolls";
import { MonthPicker } from "@/components/ui/month-picker";
import { CurrencyInput } from "@/components/ui/currency-input";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payroll: Payroll | null;
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

export function EditDialog({ open, onOpenChange, payroll }: Props) {
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

  const { data: payrollDetail } = useQuery({
    queryKey: ["payroll", payroll?.id],
    queryFn: async () => {
      if (!payroll?.id) {
        throw new Error("Payroll ID is required");
      }

      const { data } = await axios.get(
        `${apiConfig.API_URL}/payrolls/${payroll?.id}`,
      );
      return data.data;
    },
    enabled: open && !!payroll?.id,
  });

  useEffect(() => {
    if (open && payrollDetail) {
      form.reset({
        employee_id: payrollDetail.employee?.id,
        period_month: payrollDetail.period_month ? new Date(payrollDetail.period_month) : undefined,
        basic_salary: payrollDetail.basic_salary,
        allowance: payrollDetail.allowance,
        overtime_pay: payrollDetail.overtime_pay,
        deduction: payrollDetail.deduction,
      });
    } else if (!open) {
      form.reset();
    }
  }, [open, payrollDetail]);

  const update = useMutation({
    mutationFn: async (values: PayrollPayload) => {
      const { data } = await axios.put(
        `${apiConfig.API_URL}/payrolls/${payroll?.id}`,
        values,
      );
      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["payrolls"],
      });

      toast.success("Payroll updated successfully");

      onOpenChange(false);
    },
  });

  const onSubmit = (values: SchemaType) => {
    update.mutate({
      ...values,
      period_month: format(values.period_month, "yyyy-MM-05"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180">
        <DialogHeader>
          <DialogTitle>Edit Payroll</DialogTitle>
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
