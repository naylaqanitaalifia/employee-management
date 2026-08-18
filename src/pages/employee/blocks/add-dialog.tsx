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
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDepartments } from "@/hooks/use-departments";
import { usePositions } from "@/hooks/use-positions";
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
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CONTRACT_TYPES = [
  { name: "Permanent", id: "permanent" },
  { name: "Contract", id: "contract" },
  { name: "Internship", id: "internship" },
];

const STATUSES = [
  { name: "Active", id: "active" },
  { name: "On Leave", id: "on_leave" },
  { name: "Resigned", id: "resigned" },
  { name: "Terminated", id: "terminated" },
];

const formSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required." }),
  email: z.string().trim().min(1, { message: "Email is required." }),
  phone: z.string().trim().min(1, { message: "Phone is required." }),
  department_id: z
    .string()
    .trim()
    .min(1, { message: "Department is required." }),
  position_id: z.string().trim().min(1, { message: "Position is required." }),
  contract_type: z
    .string()
    .trim()
    .min(1, { message: "Contract type is required." }),
  start_date: z.date({ message: "Start date is required." }),
  status: z.string().trim().min(1, { message: "Status is required." }),
  account_number: z.string().trim().optional(),
  // .transform((val) => (val === "" ? undefined : val))
  // .refine((val) => !val || /^\d+$/.test(val), {
  //   message: "Account number must contain only digits.",
  // }),
  address: z.string().trim().min(1, { message: "Address is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

type EmployeePayload = Omit<SchemaType, "start_date"> & {
  start_date: string;
};

export function AddDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();

  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);
  const [positionPopoverOpen, setPositionPopoverOpen] = useState(false);
  const [contractTypePopoverOpen, setContractTypePopoverOpen] = useState(false);
  const [statusPopoverOpen, setStatusPopoverOpen] = useState(false);

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department_id: "",
      position_id: "",
      contract_type: "",
      start_date: new Date(),
      status: "",
      account_number: "",
      address: "",
    },
  });

  const selectedDepartmentId = form.watch("department_id");
  const filteredPositions = positions.filter(
    (position) => position.department.id === selectedDepartmentId,
  );

  useEffect(() => {
    if (!open) {
      form.reset({
        name: "",
        email: "",
        phone: "",
        department_id: "",
        position_id: "",
        contract_type: "",
        start_date: new Date(),
        status: "",
        account_number: "",
        address: "",
      });
    }
  }, [open]);

  const create = useMutation({
    mutationFn: async (values: EmployeePayload) => {
      const { data } = await axios.post(
        `${apiConfig.API_URL}/employees`,
        values,
      );
      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["employees"],
      });

      toast.success("Employee created successfully");

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
      start_date: format(values.start_date, "yyyy-MM-dd"),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180">
        <DialogHeader>
          <DialogTitle>Add Employee</DialogTitle>
          <DialogDescription>
            Complete the form below to add a new employee to the system.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="scrollable-y h-[70vh] overflow-scroll">
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
                      <Input placeholder="Enter employee name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="Enter phone number"
                        {...field}
                      />
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
                                      form.setValue("position_id", "");
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

              {/* Position */}
              <FormField
                control={form.control}
                name="position_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Popover
                        open={positionPopoverOpen}
                        onOpenChange={setPositionPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            placeholder={!field.value}
                            disabled={!selectedDepartmentId}
                          >
                            {field.value
                              ? positions.find(
                                  (position) => position.id === field.value,
                                )?.name
                              : "Select position"}
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
                              <CommandEmpty>No position found.</CommandEmpty>
                              <CommandGroup>
                                {filteredPositions.map((position) => (
                                  <CommandItem
                                    key={position.id}
                                    value={position.name}
                                    onSelect={() => {
                                      field.onChange(position.id);
                                      setPositionPopoverOpen(false);
                                    }}
                                  >
                                    {position.name}
                                  </CommandItem>
                                ))}
                                {/* {filteredPositions.length > 0 ? (
                                ) : (
                                  <CommandEmpty>
                                    No positions found in this department.
                                  </CommandEmpty>
                                )} */}
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

              {/* Contract Type */}
              <FormField
                control={form.control}
                name="contract_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <FormControl>
                      <Popover
                        open={contractTypePopoverOpen}
                        onOpenChange={setContractTypePopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            placeholder={!field.value}
                          >
                            {field.value
                              ? CONTRACT_TYPES.find(
                                  (contract_type) =>
                                    contract_type.id === field.value,
                                )?.name
                              : "Select contract type"}
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
                              <CommandEmpty>
                                No contract type found.
                              </CommandEmpty>
                              <CommandGroup>
                                {CONTRACT_TYPES.map((contract_type) => (
                                  <CommandItem
                                    key={contract_type.id}
                                    value={contract_type.id}
                                    onSelect={() => {
                                      field.onChange(contract_type.id);
                                      setContractTypePopoverOpen(false);
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

              {/* Start Date */}
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Popover
                        open={statusPopoverOpen}
                        onOpenChange={setStatusPopoverOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between"
                            placeholder={!field.value}
                          >
                            {field.value
                              ? STATUSES.find(
                                  (status) => status.id === field.value,
                                )?.name
                              : "Select status"}
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
                              <CommandEmpty>No status found.</CommandEmpty>
                              <CommandGroup>
                                {STATUSES.map((status) => (
                                  <CommandItem
                                    key={status.id}
                                    value={status.id}
                                    onSelect={() => {
                                      field.onChange(status.id);
                                      setStatusPopoverOpen(false);
                                    }}
                                  >
                                    {status.name}
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

              {/* Account Number */}
              <FormField
                control={form.control}
                name="account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Account Number{" "}
                      <span className="text-muted-foreground/70 font-normal">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter account number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter address"
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
