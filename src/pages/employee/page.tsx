import { useState } from "react";
import { AddDialog } from "./blocks/add-dialog";
import { EditDialog } from "./blocks/edit-dialog";
import { DeleteDialog } from "./blocks/delete-dialog";
import { useQuery } from "@tanstack/react-query";
import { apiConfig } from "@/config/api.config";
import axios from "axios";
import type { Employee } from "@/hooks/use-employees";
import { DataTable } from "@/components/ui/data-table";
import { ListToolbar } from "./blocks/list-toolbar";
import { useDebounce } from "use-debounce";
import { getColumns } from "./blocks/columns";
import { Spinner } from "@/components/ui/spinner";

export function Page() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const {
    data: employees = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employees", debouncedSearch],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/employees`, {
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

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setEditDialogOpen(true);
  };

  const handleDelete = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const columns = getColumns(handleEdit, handleDelete);

  if (isLoading) {
    <Spinner />;
  }

  if (isError) {
    return <div className="">Failed to load employees.</div>;
  }

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Employee
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your organization members and their roles.
        </p>
      </div>

      <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      <DataTable
        columns={columns}
        data={employees}
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
        employee={selectedEmployee}
      />

      {/* DELETE DIALOG */}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        employee={selectedEmployee}
      />
    </div>
  );
}
