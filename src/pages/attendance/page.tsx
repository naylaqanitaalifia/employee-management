import { useState } from "react";
import { AddDialog } from "./blocks/add-dialog";
import { DataTable } from "@/components/ui/data-table";
import { ListToolbar } from "./blocks/list-toolbar";
import { getColumns } from "./blocks/columns";
import { ContentLoader } from "@/components/common/content-loader";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { useDebounce } from "use-debounce";
import type { DateRange } from "react-day-picker";
import { format, setDate } from "date-fns";

export function Page() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  // const [editDialogOpen, setEditDialogOpen] = useState(false);
  // const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  // const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
  //   null,
  // );
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [status, setStatus] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { data: attendances = [], isLoading } = useQuery({
    queryKey: [
      "attendances",
      debouncedSearch,
      status,
      dateRange?.from,
      dateRange?.to,
    ],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/attendances`, {
        params: {
          page: 1,
          limit: 100,
          // with_deleted: false,
          order_field: "created_at",
          order_direction: "DESC",
          filter:
            debouncedSearch || status || dateRange?.from || dateRange?.to
              ? JSON.stringify({
                  name: debouncedSearch,
                  status: status,
                  start_date: dateRange?.from
                    ? format(dateRange?.from, "yyyy-MM-dd")
                    : "",
                  end_date: dateRange?.to
                    ? format(dateRange?.to, "yyyy-MM-dd")
                    : "",
                })
              : "",
        },
      });
      return data.data.list;
    },
  });

  const handleReset = () => {
    setSearch("");
    setDateRange(undefined);
    setStatus("");
  };

  // const handleEdit = (employee: Employee) => {
  //   setSelectedEmployee(employee);
  //   setEditDialogOpen(true);
  // };

  // const handleDelete = (employee: Employee) => {
  //   setSelectedEmployee(employee);
  //   setDeleteDialogOpen(true);
  // };

  const columns = getColumns();

  if (isLoading) {
    return <ContentLoader />;
  }

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
            status={status}
            onStatusChange={setStatus}
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            onReset={handleReset}
            onAdd={() => setAddDialogOpen(true)}
          />
        )}
      />

      {/* EDIT DIALOG */}
      {/* <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        employee={selectedEmployee}
      /> */}

      {/* DELETE DIALOG */}
      {/* <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        employee={selectedEmployee}
      /> */}
    </div>
  );
}
