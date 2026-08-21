import { useState } from "react";
import { AddDialog } from "./blocks/add-dialog";
import { EditDialog } from "./blocks/edit-dialog";
import { DeleteDialog } from "./blocks/delete-dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { Spinner } from "@/components/ui/spinner";
import { DataTable } from "../../components/ui/data-table";
import { getColumns, type Department } from "./blocks/columns";
import { ListToolbar } from "./blocks/list-toolbar";
import { useDebounce } from "use-debounce";
import { ContentLoader } from "@/components/common/content-loader";

const baseUrl = apiConfig.API_URL;

export function Page() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const {
    data: departments = [],
    isLoading,
    isError,
  } = useQuery<Department[]>({
    queryKey: ["departments", debouncedSearch],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/departments`, {
        params: {
          search: debouncedSearch,
        },
      });

      return data.data.list;
    },
    placeholderData: (prev) => prev,
  });

  const handleReset = () => {
    setSearch("");
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setEditDialogOpen(true);
  };

  const handleDelete = (department: Department) => {
    setSelectedDepartment(department);
    setDeleteDialogOpen(true);
  };

  const columns = getColumns(handleEdit, handleDelete);

  if (isLoading) {
    return <ContentLoader />;
  }

  if (isError) {
    return <div className="">Failed to load departments.</div>;
  }

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Departments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage departments and organizational structure.
        </p>
      </div>

      <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      <DataTable
        columns={columns}
        data={departments}
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
        department={selectedDepartment}
      />

      {/* DELETE DIALOG */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        department={selectedDepartment}
      />
    </div>
  );
}
