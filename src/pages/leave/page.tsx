import { useState } from "react";
import {
  ListToolbar,
  AddDialog,
  DetailDialog,
  EditDialog,
  DeleteDialog,
  RejectDialog,
  LeaveCards,
} from "./";
import { DataTable } from "@/components/ui/data-table";
import { useDebounce } from "use-debounce";
import { getColumns } from "./blocks/columns";
// import { Spinner } from "@/components/ui/spinner";
import { useLeaves, type Leave } from "@/hooks/use-leaves";
import { ContentLoader } from "@/components/common/content-loader";
import { useAuth } from "@/auth/auth-context";
import { useQuery } from "@tanstack/react-query";
import { apiConfig } from "@/config/api.config";
import axios from "axios";

export function Page() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  // const {
  //   data: leaves = [],
  //   isLoading,
  //   isFetching,
  // } = useLeaves(debouncedSearch);

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const {
    data: leaves = [],
    isLoading,
    isFetching,
  } = useQuery<Leave[]>({
    queryKey: ["leaves", debouncedSearch, status],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/leaves`, {
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
    isAdmin,
    handleDetail,
    handleEdit,
    // handleReject,
    handleDelete,
  );

  if (isLoading) {
    return <ContentLoader />;
  }

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Leave Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage employee leave requests, approvals, and leave records.
        </p>
      </div>

      {!isAdmin && <LeaveCards />}

      <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      <DataTable
        columns={columns}
        data={leaves}
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

      <RejectDialog
        open={rejectDialogOpen}
        onOpenChange={setRejectDialogOpen}
        leave={selectedLeave}
      />
    </div>
  );
}
