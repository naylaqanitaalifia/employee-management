import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { PiPencil, PiTrash } from "react-icons/pi";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { capitalize } from "@/lib/helpers";

export type Employee = {
  id: string;
  name: string;
  created_at: string;
  department: {
    id: string;
    name: string;
  };
  position: {
    id: string;
    name: string;
  };
  status: string;
};

export const getColumns = (
  onEdit: (department: Employee) => void,
  onDelete: (department: Employee) => void,
): ColumnDef<Employee>[] => [
  {
    accessorKey: "name",
    header: "Full Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "department.name",
    header: "Department",
  },
  {
    accessorKey: "position.name",
    header: "Position",
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusVariant = (status: string) => {
        switch (status) {
          case "active":
            return "success";
          case "late":
            return "warning";
          case "resigned":
            return "destructive";
          default:
            return "success";
        }
      };
      return (
        <div className="flex justify-center">
          <Badge
            variant={getStatusVariant(row.original.status ?? "") as any}
            appearance="light"
            className="rounded-full"
          >
            {capitalize(status ?? "-")}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: "Created",
    size: 100,
    cell: ({ row }) => {
      return (
        <div className="flex flex-col">
          {row.original.created_at
            ? format(new Date(row.original.created_at), "MMM dd, yyyy")
            : "-"}
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    size: 150,
    cell: ({ row }) => {
      const department = row.original;
      return (
        <div className="flex items-center justify-center">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => onEdit(department)}>
                <PiPencil size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="text-red-500 cursor-pointer hover:bg-red-500/10 hover:text-red-500 rounded-md"
                onClick={() => onDelete(department)}
              >
                <PiTrash size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
