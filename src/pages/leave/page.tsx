import { useState } from "react";
import {
  ListToolbar,
  AddDialog,
  DetailDialog,
  EditDialog,
  DeleteDialog,
} from "./";
import { DataTable } from "@/components/ui/data-table";
import { useDebounce } from "use-debounce";
import { getColumns, type Leave } from "./blocks/columns";
import { Spinner } from "@/components/ui/spinner";
import { useLeaves } from "@/hooks/use-leaves";
import { ContentLoader } from "@/components/common/content-loader";

export function Page() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
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

  const handleEdit = (leave: Leave) => {
    setSelectedLeave(leave);
    setEditDialogOpen(true);
  };

  const handleReject = (leave: Leave) => {
    setSelectedLeave(leave);
    setDetailDialogOpen(false);
    setRejectDialogOpen(true);
  };

  const handleDelete = (leave: Leave) => {
    setSelectedLeave(leave);
    setDeleteDialogOpen(true);
  };

  const columns = getColumns(
    handleDetail,
    handleEdit,
    handleReject,
    handleDelete,
  );

  if (isLoading) {
    return <ContentLoader />;
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

      <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

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

      {/* EDIT DIALOG */}
      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        leave={selectedLeave}
      />

      {/* DELETE DIALOG */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        leave={selectedLeave}
      />
    </div>
  );
}
