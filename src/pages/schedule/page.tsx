import { ScheduleCalendar } from "@/pages/schedule/components/schedule-calendar";
// import ScheduleCalendar from "@/components/ui/schedule-calendar";

export function Page() {
  // const {
  //   data: departments = [],
  //   isLoading,
  //   isFetching,
  //   isError,
  // } = useQuery<Department[]>({
  //   queryKey: ["departments", debouncedSearch],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`${baseUrl}/departments`, {
  //       params: {
  //         page: 1,
  //         limit: 100,
  //         with_deleted: false,
  //         order_field: "created_at",
  //         order_direction: "DESC",
  //         filter: debouncedSearch
  //           ? JSON.stringify({ name: debouncedSearch })
  //           : "",
  //       },
  //     });

  //     return data.data.list;
  //   },
  //   placeholderData: (prev) => prev,
  // });

  // const columns = getColumns(handleEdit, handleDelete);

  // if (isLoading) {
  //   return <ContentLoader />;
  // }

  // if (isError) {
  //   return <div className="">Failed to load departments.</div>;
  // }

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Schedules
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Here’s what’s happening with your workspace today.
        </p>
      </div>

      <ScheduleCalendar />

      {/* <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} /> */}

      {/* EDIT DIALOG */}
      {/* <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        department={selectedDepartment}
      /> */}

      {/* DELETE DIALOG */}
      {/* <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        department={selectedDepartment}
      /> */}
    </div>
  );
}
