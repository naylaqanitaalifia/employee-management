import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePayrolls } from "@/hooks/use-payrolls";
import { capitalize, formatRupiah } from "@/lib/helpers";
import { format } from "date-fns";
import { Download, Eye } from "lucide-react";

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

export function PayrollCard() {
  const { data: payrolls } = usePayrolls();
  const latestPayroll = payrolls?.[0];

  if (!latestPayroll) {
    return (
      <Card>
        <CardHeader className="bg-primary/10">
          <CardTitle className="text-primary">Latest Payroll</CardTitle>
          <CardDescription className="text-secondary-foreground">
            View your history and download your monthly payslips.
          </CardDescription>
        </CardHeader>

        <CardContent className="py-10 text-center text-muted-foreground">
          No payroll data available.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="bg-primary/10">
        <CardTitle className="text-primary">Latest Payroll</CardTitle>
        <CardDescription className="text-secondary-foreground">
          View your history and download your monthly payslips.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span>August 2026</span>
            <span>
              <Badge
                variant="success"
                appearance="light"
                className="rounded-full"
              >
                Paid
              </Badge>
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Net Salary</span>
            <span className="text-muted-foreground">Rp 5.650.000</span>
          </div>
        </div> */}

        <div className="grid grid-cols-3 gap-12">
          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-center text-muted-foreground">
              Salary Breakdown
            </h3>
            <div className="flex flex-col gap-2">
              {/* Basic Salary */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Basic Salary</span>
                <span className="text-muted-foreground">
                  {formatRupiah(latestPayroll?.basic_salary)}
                </span>
              </div>

              {/* Allowance */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Allowance</span>
                <span className="text-muted-foreground">
                  {formatRupiah(latestPayroll?.allowance)}
                </span>
              </div>

              {/* Overtime */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Overtime</span>
                <span className="text-muted-foreground">
                  {formatRupiah(latestPayroll?.overtime_pay)}
                </span>
              </div>

              {/* Deduction */}
              <div className="flex items-center justify-between">
                <span className="text-sm">Deduction</span>
                <span className="text-muted-foreground">
                  {formatRupiah(latestPayroll?.deduction)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <h3 className="font-bold text-muted-foreground">
              {format(latestPayroll?.period_month, "MMMM yyyy")} • Net Salary
            </h3>
            <span className="text-2xl font-bold">
              {formatRupiah(latestPayroll?.net_salary)}
            </span>
            <span>
              <Badge
                variant={getStatusVariant(latestPayroll?.status ?? "") as any}
                appearance="light"
                className="rounded-full"
              >
                {capitalize(latestPayroll?.status ?? "-")}
              </Badge>
            </span>

            {/* Basic Salary */}
            {/* <div className="flex items-center justify-between">
              <span className="text-sm">Basic Salary</span>
              <span className="text-muted-foreground">Rp 5.650.000</span>
            </div> */}
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-bold text-center text-muted-foreground">
              Action
            </h3>
            {/* Basic Salary */}
            <Button variant="primary">
              <Download className="text-secondary" /> Download
            </Button>
            <Button variant="outline">
              <Eye className="text-secondary-foreground" /> View Detail
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
