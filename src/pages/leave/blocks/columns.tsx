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
import { capitalize, formatDate } from "@/lib/helpers";

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
  onDetail: (leave: Leave) => void,
  onApprove: (leave: Leave) => void,
  onReject: (leave: Leave) => void,
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
  {
    accessorKey: "employee_name",
    header: "Employee",
    cell: ({ row }) => row.original.employee?.name ?? "-",
  },
  {
    accessorKey: "type",
    header: "Leave Type",
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
    header: "Status",
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
        <Badge
          variant={getStatusVariant(row.original.status ?? "") as any}
          appearance="light"
          className="rounded-full"
        >
          {capitalize(status ?? "-")}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    size: 150,
    cell: ({ row }) => {
      const leave = row.original;
      return (
        <div className="flex items-center justify-center">
          <Tooltip>
            <TooltipTrigger>
              <Button variant="ghost" onClick={() => onDetail(leave)}>
                <Eye />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Detail</TooltipContent>
          </Tooltip>
          {/* <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                className="text-success cursor-pointer hover:bg-success/10 hover:text-success rounded-md"
                onClick={() => onApprove(leave)}
              >
                <Check />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Approve</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <Button
                variant="ghost"
                className="text-destructive cursor-pointer hover:bg-destructive/10 hover:text-destructive rounded-md"
                onClick={() => onReject(leave)}
              >
                <Ban />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Reject</TooltipContent>
          </Tooltip> */}
        </div>
      );
    },
  },
];
