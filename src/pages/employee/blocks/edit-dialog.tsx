import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DEPARTMENTS = [
  { label: "Information Technology", value: "it" },
  { label: "Human Resources", value: "hr" },
  { label: "Finance & Accounting", value: "finance" },
  { label: "Marketing", value: "marketing" },
  { label: "Operations", value: "operations" },
];

const POSITIONS = [
  { label: "Manager", value: "manager" },
  { label: "Team Lead", value: "team_lead" },
  { label: "Staff", value: "staff" },

  // IT roles
  { label: "Frontend Developer", value: "frontend_developer" },
  { label: "Backend Developer", value: "backend_developer" },
  { label: "Fullstack Developer", value: "fullstack_developer" },
  { label: "UI/UX Designer", value: "ui_ux_designer" },

  // HR / Business roles
  { label: "HR Specialist", value: "hr_specialist" },
  { label: "Recruiter", value: "recruiter" },

  // Finance
  { label: "Accountant", value: "accountant" },
  { label: "Finance Analyst", value: "finance_analyst" },
];

const CONTRACT_TYPES = [
  { label: "Permanent", value: "permanent" },
  { label: "Contract", value: "contract" },
  { label: "Internship", value: "internship" },
];

const STATUS = [
  { label: "Active", value: "active" },
  { label: "On Leave", value: "on_leave" },
  { label: "Resigned", value: "resigned" },
  { label: "Terminated", value: "terminated" },
];

const formSchema = () => {
  return z.object({
    name: z.string().trim().min(1, { message: "Name is required." }),
    email: z.string().trim().min(1, { message: "Email is required." }),
    phone: z.string().trim().min(1, { message: "Phone is required." }),
    department: z
      .string()
      .trim()
      .min(1, { message: "Department is required." }),
    position: z.string().trim().min(1, { message: "Position is required." }),
    contract_type: z
      .string()
      .trim()
      .min(1, { message: "Contract type is required." }),
    start_date: z.date().optional(),
    status: z.string().trim().min(1, { message: "Status is required." }),
    account_number: z
      .string()
      .trim()
      .min(1, { message: "Account number is required." }),
    address: z.string().trim().min(1, { message: "Address is required." }),
  });
};

type SchemaType = z.infer<ReturnType<typeof formSchema>>;

export function EditDialog({ open, onOpenChange }: Props) {
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema()),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      department: "",
      position: "",
      contract_type: "",
      start_date: new Date(),
      status: "",
      account_number: "",
      address: "",
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-180">
        <DialogHeader>
          <DialogTitle>Edit Employee</DialogTitle>
          <DialogDescription>
            Update the employee information below.
          </DialogDescription>
        </DialogHeader>

        <DialogBody className="scrollable-y h-[70vh] overflow-scroll">
          <Form {...form}>
            <form className="space-y-4">
              {/* Name */}
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter employee name" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
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
                  </FormItem>
                )}
              />

              {/* Phone */}
              <FormField
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
                  </FormItem>
                )}
              />

              {/* Department */}
              <FormField
                name="department"
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
                          {DEPARTMENTS.map((department) => (
                            <SelectItem
                              key={department.value}
                              value={department.value}
                            >
                              {department.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Position */}
              <FormField
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent>
                          {POSITIONS.map((position) => (
                            <SelectItem
                              key={position.value}
                              value={position.value}
                            >
                              {position.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Contract Type */}
              <FormField
                name="contract_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contract Type</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select contract type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTRACT_TYPES.map((contract_type) => (
                            <SelectItem
                              key={contract_type.value}
                              value={contract_type.value}
                            >
                              {contract_type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Start Date */}
              <FormField
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
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {STATUS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Account Number */}
              <FormField
                name="account_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter account number"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Address */}
              <FormField
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
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <div className="flex justify-end gap-3 mt-8">
            <Button
              variant="outline"
              className="w-20"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button variant="default" className="w-30">
              Save
            </Button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
