import { useState } from "react";
import { ListToolbar, DetailDialog, RejectDialog } from "./";
import { DataTable } from "@/components/ui/data-table";
import { useDebounce } from "use-debounce";
import { getColumns, type Leave } from "./blocks/columns";
import { Spinner } from "@/components/ui/spinner";
import { useLeaves } from "@/hooks/use-leaves";

export function Page() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: leaves = [], isLoading, isError } = useLeaves(debouncedSearch);

  const handleReset = () => {
    setSearch("");
  };

  const handleDetail = (leave: Leave) => {
    setSelectedLeave(leave);
    setDetailDialogOpen(true);
  };

  const handleApprove = (leave: Leave) => {
    setSelectedLeave(leave);
    setApproveDialogOpen(true);
  };

  const handleReject = (leave: Leave) => {
    setSelectedLeave(leave);
    setDetailDialogOpen(false);
    setRejectDialogOpen(true);
  };

  const columns = getColumns(handleDetail, handleApprove, handleReject);

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <div className="">Failed to load leaves.</div>;
  }

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Leave Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage employee leave requests, approvals, and leave records.
        </p>
      </div>

      {/* <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} /> */}

      <DataTable
        columns={columns}
        data={leaves}
        renderToolbar={() => (
          <ListToolbar
            search={search}
            onSearchChange={setSearch}
            onReset={handleReset}
            onAdd={() => setAddDialogOpen(true)}
          />
        )}
      />

      {/* DETAIL DIALOG */}
      <DetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        leave={selectedLeave}
        onReject={handleReject}
      />

      {/* APPROVE DIALOG */}
      {/* <ApproveDialog
        open={approveDialogOpen}
        onOpenChange={setApproveDialogOpen}
        leave={selectedLeave}
      /> */}

      {/* REJECT DIALOG */}
      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        leave={selectedLeave}
      />
    </div>
  );
}
