import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import type { Leave } from "@/hooks/use-leaves";
import { capitalize, formatDate, formatDateRange, getLabel } from "@/lib/helpers";
import { LEAVE_TYPE_OPTIONS } from "@/constants/leave";

export const getColumns = (
  onEdit?: (leave: Leave) => void,
  onDelete?: (leave: Leave) => void,
): ColumnDef<Leave>[] => [
  {
    accessorKey: "type",
    header: "Leave Type",
    cell: ({ row }) => {
      return getLabel(row.original.type, LEAVE_TYPE_OPTIONS);
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      return formatDateRange(row.original.start_date, row.original.end_date);
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
];
