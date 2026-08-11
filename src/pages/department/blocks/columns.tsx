import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { PiPencil, PiTrash } from "react-icons/pi";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type Department = {
  id: string;
  name: string;
  created_at: string;
};

export const getColumns = (
  onEdit: (department: Department) => void,
  onDelete: (department: Department) => void,
): ColumnDef<Department>[] => [
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
    accessorKey: "name",
    header: "Name",
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
