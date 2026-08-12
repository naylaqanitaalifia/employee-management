import { useState } from "react";
import { AddDialog } from "./blocks/add-dialog";
import { EditDialog } from "./blocks/edit-dialog";
import { DeleteDialog } from "./blocks/delete-dialog";
import type { Employee } from "@/hooks/use-employees";
import { DataTable } from "@/components/ui/data-table";
import { ListToolbar } from "./blocks/list-toolbar";
import { useDebounce } from "use-debounce";
import { getColumns } from "./blocks/columns";

export function Page() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const attendances = [
    {
      date: "2023-09-01",
      name: "John Doe",
      department: "Information Technology",
      clock_in: "09:00",
      clock_out: "18:00",
      total_hours: "8h",
      status: "absent",
    },
  ];

  // const {
  //   data: employees = [],
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["employees", debouncedSearch],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`${apiConfig.API_URL}/employees`, {
  //       params: {
  //         search: debouncedSearch,
  //       },
  //     });
  //     return data.data;
  //   },
  // });

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

  // if (isLoading) {
  //   return <Spinner />
  // }

  // if (isError) {
  //   return <div className="">Failed to load departments.</div>;
  // }

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Attendance
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage employee attendance records and work schedules.
        </p>
      </div>

      <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      <DataTable
        columns={columns}
        data={attendances}
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
