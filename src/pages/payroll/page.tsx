import { useState } from "react";
import {
  ListToolbar,
  AddDialog,
  EditDialog,
  ProcessDialog,
  DeleteDialog,
  PayrollCard,
} from ".";
import { DataTable } from "@/components/ui/data-table";
import { useDebounce } from "use-debounce";
import { getColumns } from "./blocks/columns";
import { usePayrolls, type Payroll } from "@/hooks/use-payrolls";
import { ContentLoader } from "@/components/common/content-loader";
import { useAuth } from "@/auth/auth-context";
import { apiConfig } from "@/config/api.config";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export function Page() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // const {
  //   data: payrolls = [],
  //   isLoading,
  //   isFetching,
  // } = usePayrolls(debouncedSearch);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

  const [processAction, setProcessAction] = useState<"process" | "pay">(
    "process",
  );

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [status, setStatus] = useState("");

  const {
    data: payrolls = [],
    isLoading,
    isFetching,
  } = useQuery<Payroll[]>({
    queryKey: ["payrolls", debouncedSearch, status],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/payrolls`, {
        params: {
          page: 1,
          limit: 100,
          with_deleted: false,
          order_field: "created_at",
          order_direction: "DESC",
          filter:
            debouncedSearch || status
              ? JSON.stringify({
                  name: debouncedSearch,
                  status: status,
                })
              : "",
        },
      });

      return data.data.list;
    },
    placeholderData: (prev) => prev,
  });

  const handleReset = () => {
    setSearch("");
    setStatus("");
  };

  // const handleDetail = (payroll: Payroll) => {
  //   setSelectedPayroll(payroll);
  //   setDetailDialogOpen(true);
  // };

  const handleEdit = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setEditDialogOpen(true);
  };

  const handleProcess = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setProcessAction("process");
    setProcessDialogOpen(true);
  };

  const handlePay = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setProcessAction("pay");
    setProcessDialogOpen(true);
  };

  const handleDelete = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setDeleteDialogOpen(true);
  };

  const columns = getColumns(
    isAdmin,
    // handleDetail,
    handleEdit,
    handleProcess,
    handlePay,
    handleDelete,
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Payroll Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isAdmin
            ? "Manage employee salaries, payroll records, and monthly payments."
            : "View your salary information and monthly payroll history."}
        </p>
      </div>

      {!isAdmin && <PayrollCard />}

      <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      <DataTable
        columns={columns}
        data={payrolls}
        isLoading={isFetching}
        renderToolbar={() => (
          <ListToolbar
            search={search}
            onSearchChange={setSearch}
            status={status}
            onStatusChange={setStatus}
            onReset={handleReset}
            onAdd={() => setAddDialogOpen(true)}
          />
        )}
      />

      {/* EDIT DIALOG */}
      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        payroll={selectedPayroll}
      />

      {/* PROCESS DIALOG */}
      <ProcessDialog
        open={processDialogOpen}
        onOpenChange={setProcessDialogOpen}
        payroll={selectedPayroll}
        action={processAction}
      />

      {/* DELETE DIALOG */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        payroll={selectedPayroll}
      />
    </div>
  );
}
