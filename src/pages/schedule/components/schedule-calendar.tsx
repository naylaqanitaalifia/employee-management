import { useState } from "react";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleMonthView } from "./schedule-month-view";
import type { CalendarEvent, CalendarView } from "./schedule-types";
import { ScheduleWeekView } from "./schedule-week-view";
import { AddDialog } from "@/pages/schedule/blocks/add-dialog";
import { DetailDialog } from "@/pages/schedule/blocks/detail-dialog";
import { EditDialog } from "@/pages/schedule/blocks/edit-dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { apiConfig } from "@/config/api.config";
import { DeleteDialog } from "../blocks/delete-dialog";

const baseUrl = apiConfig.API_URL;

interface ScheduleCalendarProps {
  schedules: CalendarEvent[];
}

export function ScheduleCalendar({ schedules }: ScheduleCalendarProps) {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const {
    data: scheduleDetail,
    isLoading: isLoadingDetail,
    // isFetching: isFetchingDetail,
    // isError: isErrorDetail,
  } = useQuery<CalendarEvent>({
    queryKey: ["schedule", selectedEvent],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/schedules/${selectedEvent}`);

      return data.data;
    },
    enabled: !!selectedEvent && detailDialogOpen, // request nggak akan jalan sebelum selectedEvent ada dan dialog dibuka
  });
  console.log("inischeduledetail", scheduleDetail);

  function handleAddDialog() {
    setAddDialogOpen(true);
  }

  function handleDetailDialog(event: CalendarEvent) {
    setSelectedEvent(event.id);
    setDetailDialogOpen(true);
  }

  function handleEditDialog() {
    setDetailDialogOpen(false);
    setEditDialogOpen(true);
  }

  function handleDeleteDialog() {
    setDetailDialogOpen(false);
    setDeleteDialogOpen(true);
  }

  return (
    <div className="w-full">
      <ScheduleHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
        onAddDialogEvent={handleAddDialog}
      />

      {view === "month" && (
        <ScheduleMonthView
          currentDate={currentDate}
          onEventClick={handleDetailDialog}
          events={schedules}
        />
      )}
      {view === "week" && <ScheduleWeekView currentDate={currentDate} />}

      <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        events={scheduleDetail ?? null}
      />

      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        event={scheduleDetail ?? null}
      />

      <DetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        onEdit={handleEditDialog}
        onDelete={handleDeleteDialog}
        event={scheduleDetail ?? null}
        isLoading={isLoadingDetail}
      />
    </div>
  );
}
