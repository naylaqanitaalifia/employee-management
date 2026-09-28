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
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useEmployees } from "@/hooks/use-employees";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  title: z.string().trim().min(1, { message: "Title is required." }),
  type: z.string().trim().min(1, { message: "Type is required." }),
  description: z.string().trim().optional(),
  // start_date: z
  //   .string()
  //   .trim()
  //   .min(1, { message: "Start date is required." }),
  // end_date: z.string().trim().min(1, { message: "End date is required." }),
  date: z.object({
    from: z.date({ message: "Start date is required." }),
    to: z.date({ message: "End date is required." }),
  }),
  start_time: z.string().trim().min(1, { message: "Start time is required." }),
  end_time: z.string().trim().min(1, { message: "End time is required." }),
  location_type: z
    .string()
    .trim()
    .min(1, { message: "Location type is required." }),
  location: z.string().trim().optional(),
  online_meeting_link: z.string().trim().optional(),
  employee_ids: z
    .array(z.string())
    .min(1, { message: "At least one participant is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

interface SchedulePayload {
  title: string;
  type: string;
  description?: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  location_type: string;
  location?: string;
  online_meeting_link?: string;
  employee_ids: string[];
}

const types = [
  { id: "meeting", name: "Meeting", color: "bg-blue-500" },
  { id: "leave", name: "Leave", color: "bg-orange-500" },
  { id: "holiday", name: "Holiday", color: "bg-red-500" },
  { id: "task", name: "Task", color: "bg-yellow-500" },
  { id: "training", name: "Training", color: "bg-purple-500" },
  { id: "event", name: "Event", color: "bg-green-500" },
  { id: "other", name: "Other", color: "bg-gray-500" },
];

export function AddDialog({ open, onOpenChange }: Props) {
  const queryClient = useQueryClient();
  const { data: employees = [] } = useEmployees();

  const [typePopoverOpen, setTypePopoverOpen] = useState(false);
  const [employeePopoverOpen, setEmployeePopoverOpen] = useState(false);

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      type: "",
      description: "",
      date: undefined,
      start_time: "",
      end_time: "",
      location_type: "",
      location: "",
      online_meeting_link: "",
      employee_ids: [],
    },
  });

  const locationType = form.watch("location_type");

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open]);

  const create = useMutation({
    mutationFn: async (values: SchedulePayload) => {
      const { data } = await axios.post(
        `${apiConfig.API_URL}/schedules`,
        values,
      );

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["schedules"],
      });

      toast.success("Schedule created successfully");

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
    const payload: SchedulePayload = {
      title: values.title,
      type: values.type,
      description: values.description,
      start_date: format(values.date.from, "yyyy-MM-dd"),
      end_date: format(values.date.to, "yyyy-MM-dd"),
      start_time: values.start_time,
      end_time: values.end_time,
      location_type: values.location_type,
      location: values.location,
      online_meeting_link: values.online_meeting_link,
      employee_ids: values.employee_ids,
    };

    create.mutate(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180">
        <DialogHeader>
          <DialogTitle>Add Schedule</DialogTitle>
          <DialogDescription>
            Add a new schedule to the system.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="scrollable-y overflow-scroll">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* TITLE */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* TYPE */}
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
                          >
                            {field.value
                              ? types.find((type) => type.id === field.value)
                                  ?.name
                              : "Select type"}
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
                              <CommandEmpty>No type found.</CommandEmpty>
                              <CommandGroup>
                                {types.map((type) => (
                                  <CommandItem
                                    key={type.id}
                                    value={type.name}
                                    onSelect={() => {
                                      field.onChange(type.id);
                                      setTypePopoverOpen(false);
                                    }}
                                  >
                                    {type.name}
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

              {/* DESCRIPTION */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Description
                      <span className="text-xs text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* START END - END DATE */}
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

              <div className="grid grid-cols-2 gap-3">
                {/* START TIME */}
                <FormField
                  control={form.control}
                  name="start_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="Enter title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* END TIME */}
                <FormField
                  control={form.control}
                  name="end_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          placeholder="Enter title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* LOCATION TYPE */}
              <FormField
                control={form.control}
                name="location_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="online" id="online" />
                          <Label htmlFor="online">Online</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="offline" id="offline" />
                          <Label htmlFor="offline">Offline</Label>
                        </div>
                        <div className="flex items-center gap-2">
                          <RadioGroupItem value="hybrid" id="hybrid" />
                          <Label htmlFor="hybrid">Hybrid</Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* LOCATION */}
              {(locationType === "offline" || locationType === "hybrid") && (
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter location" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* ONLINE MEETING */}
              {(locationType === "online" || locationType === "hybrid") && (
                <FormField
                  control={form.control}
                  name="online_meeting_link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Online Meeting Link</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter online meeting link"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* PARTICIPANTS */}
              {/* <FormField
                control={form.control}
                name="employee_ids"
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
              /> */}

              <FormField
                control={form.control}
                name="employee_ids"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Participants</FormLabel>

                    <Popover
                      open={employeePopoverOpen}
                      onOpenChange={setEmployeePopoverOpen}
                    >
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-full justify-between font-normal"
                          >
                            <span
                              className={
                                field.value.length === 0
                                  ? "text-muted-foreground"
                                  : ""
                              }
                            >
                              {field.value.length === 0
                                ? "Select participants"
                                : `${field.value.length} participant${
                                    field.value.length > 1 ? "s" : ""
                                  } selected`}
                            </span>

                            <ChevronDownIcon className="size-4 text-muted-foreground" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0"
                        align="start"
                        onWheel={(e) => e.stopPropagation()}
                      >
                        <Command>
                          <CommandInput placeholder="Search employee..." />

                          <CommandList className="max-h-60 overflow-y-auto">
                            <CommandEmpty>No employee found.</CommandEmpty>

                            <CommandGroup>
                              {employees.map((employee) => {
                                const isSelected = field.value.includes(
                                  String(employee.id),
                                );

                                return (
                                  <CommandItem
                                    key={employee.id}
                                    value={employee.name}
                                    onSelect={() => {
                                      const employeeId = String(employee.id);

                                      if (isSelected) {
                                        field.onChange(
                                          field.value.filter(
                                            (id) => id !== employeeId,
                                          ),
                                        );
                                      } else {
                                        field.onChange([
                                          ...field.value,
                                          employeeId,
                                        ]);
                                      }
                                    }}
                                  >
                                    <div className="flex w-full items-center gap-2">
                                      <div
                                        className={cn(
                                          "flex size-4 items-center justify-center rounded-sm border",
                                          isSelected
                                            ? "border-primary bg-primary text-primary-foreground"
                                            : "border-input",
                                        )}
                                      >
                                        {isSelected && (
                                          <CheckIcon className="size-3" />
                                        )}
                                      </div>

                                      <span>{employee.name}</span>
                                    </div>
                                  </CommandItem>
                                );
                              })}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

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
