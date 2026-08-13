import { Button } from "@/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Banknote, BanknoteArrowUp, Eye } from "lucide-react";
import { capitalize, formatRupiah } from "@/lib/helpers";
import { PiPencil, PiTrash } from "react-icons/pi";
import type { Payroll } from "@/hooks/use-payrolls";
import { format } from "date-fns";

export const getColumns = (
  onDetail: (payroll: Payroll) => void,
  onEdit: (payroll: Payroll) => void,
  onProcess: (payroll: Payroll) => void,
  onPay: (payroll: Payroll) => void,
  onDelete: (payroll: Payroll) => void,
): ColumnDef<Payroll>[] => [
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
    accessorFn: (row) => row.employee?.name || "-",
    id: "employee_name",
    header: "Employee",
  },
  {
    accessorKey: "period_month",
    header: "Period Month",
    cell: ({ row }) => {
      return format(row.original.period_month, "MMM yyyy");
    },
  },
  {
    accessorKey: "basic_salary",
    header: "Basic Salary",
    cell: ({ row }) => {
      return formatRupiah(row.original.basic_salary);
    },
  },
  {
    accessorKey: "allowance",
    header: "Allowance",
    cell: ({ row }) => {
      return formatRupiah(row.original.allowance);
    },
  },
  {
    accessorKey: "overtime_pay",
    header: "Overtime Pay",
    cell: ({ row }) => {
      return formatRupiah(row.original.overtime_pay);
    },
  },
  {
    accessorKey: "deduction",
    header: "Deduction",
    cell: ({ row }) => {
      return formatRupiah(row.original.deduction);
    },
  },
  {
    accessorKey: "net_salary",
    header: "Net Salary",
    cell: ({ row }) => {
      return formatRupiah(row.original.net_salary);
    },
  },
  {
    accessorKey: "status",
    header: () => <div className="text-center">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusVariant = (status: string) => {
        switch (status) {
          case "paid":
            return "success";
          case "processed":
            return "info";
          case "draft":
            return "warning";
          case "cancel":
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
      const payroll = row.original;
      return (
        <div className="flex items-center justify-center">
          {/* <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" onClick={() => onDetail(payroll)}>
                <Eye />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Detail</TooltipContent>
          </Tooltip> */}
          {payroll.status === "draft" && (
            <>
              {/* EDIT */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => onEdit(payroll)}>
                    <PiPencil size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>

              {/* PROCESS */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" onClick={() => onProcess(payroll)}>
                    <BanknoteArrowUp size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Process</TooltipContent>
              </Tooltip>

              {/* DELETE */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-red-500 cursor-pointer hover:bg-red-500/10 hover:text-red-500 rounded-md"
                    onClick={() => onDelete(payroll)}
                  >
                    <PiTrash size={18} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </>
          )}
          {payroll?.status === "processed" && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" onClick={() => onPay(payroll)}>
                  <Banknote size={18} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Mark as Paid</TooltipContent>
            </Tooltip>
          )}
        </div>
      );
    },
  },
];
