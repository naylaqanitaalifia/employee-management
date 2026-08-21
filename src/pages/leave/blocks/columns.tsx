import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Ban, Check, Eye } from "lucide-react";
import { capitalize, formatDate, getLabel } from "@/lib/helpers";
import { PiPencil, PiTrash } from "react-icons/pi";
import { useAuth } from "@/auth/auth-context";
import { LEAVE_TYPE_OPTIONS } from "@/constants/leave";

export type Leave = {
  id: string;
  type: string;
  employee: {
    id: string;
    name: string;
  };
  days: number;
  start_date: string;
  end_date: string;
  reason: string;
  status: string;
  approved_by: string | null;
  approved_at: string | null;
  created_at: string;
  updated_at: string;
};

export const getColumns = (
  isAdmin: boolean,
  onDetail: (leave: Leave) => void,
  onEdit: (leave: Leave) => void,
  onReject: (leave: Leave) => void,
  onDelete: (leave: Leave) => void,
): ColumnDef<Leave>[] => [
  // {
  //   accessorKey: "created_at",
  //   header: "Created",
  //   size: 100,
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex flex-col">
  //         {row.original.created_at
  //           ? format(new Date(row.original.created_at), "MMM dd, yyyy")
  //           : "-"}
  //       </div>
  //     );
  //   },
  // },
  ...(isAdmin
    ? [
        {
          accessorKey: "employee_name",
          header: "Employee",
          cell: ({ row }) => row.original.employee?.name ?? "-",
        },
      ]
    : []),
  {
    accessorKey: "type",
    header: "Leave Type",
    cell: ({ row }) => {
      return getLabel(row.original.type, LEAVE_TYPE_OPTIONS);
    },
  },
  {
    accessorKey: "start_date",
    header: "Start Date",
    cell: ({ row }) => {
      return formatDate(row.original.start_date);
    },
  },
  {
    accessorKey: "end_date",
    header: "End Date",
    cell: ({ row }) => {
      return formatDate(row.original.end_date);
    },
  },
  {
    accessorKey: "days",
    header: "Days",
  },
  {
    accessorKey: "created_at",
    header: "Applied At",
    cell: ({ row }) => {
      return formatDate(row.original.created_at);
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusVariant = (status: string) => {
        switch (status) {
          case "approved":
            return "success";
          case "pending":
            return "warning";
          case "rejected":
            return "destructive";
          case "cancelled":
            return "secondary";
          default:
            return "secondary";
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
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    size: 150,
    cell: ({ row }) => {
      const { user } = useAuth();
      console.log(user);
      const isAdmin = user?.role === "ADMIN";
      const leave = row.original;

      return (
        <div className="flex items-center justify-center">
          {isAdmin && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => onDetail(leave)}>
                  <Eye />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Detail</TooltipContent>
            </Tooltip>
          )}
          {!isAdmin && leave.status === "pending" && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => onEdit(leave)}>
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
                    onClick={() => onDelete(leave)}
                  >
                    <PiTrash size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </>
          )}
        </div>
      );
    },
  },
];
