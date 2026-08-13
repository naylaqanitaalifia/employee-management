import { useState } from "react";
import {
  ListToolbar,
  AddDialog,
  EditDialog,
  ProcessDialog,
  DeleteDialog,
} from ".";
import { DataTable } from "@/components/ui/data-table";
import { useDebounce } from "use-debounce";
import { getColumns } from "./blocks/columns";
import { Spinner } from "@/components/ui/spinner";
import { usePayrolls, type Payroll } from "@/hooks/use-payrolls";
import { ContentLoader } from "@/components/common/content-loader";

export function Page() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processDialogOpen, setProcessDialogOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<Payroll | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [processAction, setProcessAction] = useState<"process" | "pay">(
    "process",
  );

  const {
    data: payrolls = [],
    isLoading,
    isError,
  } = usePayrolls(debouncedSearch);

  const handleReset = () => {
    setSearch("");
  };

  const handleDetail = (payroll: Payroll) => {
    setSelectedPayroll(payroll);
    setDetailDialogOpen(true);
  };

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
    handleDetail,
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
          Manage employee salaries, payroll records, and monthly payments.
        </p>
      </div>

      <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      <DataTable
        columns={columns}
        data={payrolls}
        renderToolbar={() => (
          <ListToolbar
            search={search}
            onSearchChange={setSearch}
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
