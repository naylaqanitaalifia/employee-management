import { useState } from "react";
import { AddDialog } from "./blocks/add-dialog";
import { EditDialog } from "./blocks/edit-dialog";
import { DeleteDialog } from "./blocks/delete-dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { Spinner } from "@/components/ui/spinner";
import { DataTable } from "@/components/ui/data-table";
import { ListToolbar } from "./blocks/list-toolbar";
import { useDebounce } from "use-debounce";
import { getColumns } from "./blocks/columns";

export interface Position {
  id: string;
  name: string;
  created_at: string;
  department: {
    id: string;
    name: string;
    created_at: string;
  };
}

export function Page() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const {
    data: positions = [],
    isLoading,
    isError,
  } = useQuery<Position[]>({
    queryKey: ["positions", debouncedSearch],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/positions`, {
        params: {
          search: debouncedSearch,
        },
      });
      return data.data;
    },
    placeholderData: (prev) => prev,
  });

  const handleReset = () => {
    setSearch("");
  };

  const handleEdit = (position: Position) => {
    setSelectedPosition(position);
    setEditDialogOpen(true);
  };

  const handleDelete = (position: Position) => {
    setSelectedPosition(position);
    setDeleteDialogOpen(true);
  };

  const columns = getColumns(handleEdit, handleDelete);

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  if (isError) {
    return <div className="">Failed to load positions.</div>;
  }

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Positions
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your organization members and their roles.
        </p>
      </div>

      <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      <DataTable
        columns={columns}
        data={positions}
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
        position={selectedPosition}
      />

      {/* DELETE DIALOG */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        position={selectedPosition}
      />
    </div>
  );
}
