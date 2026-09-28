import { useState } from "react";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleMonthView } from "./schedule-month-view";
import type { CalendarEvent, CalendarView } from "./schedule-types";
import { ScheduleWeekView } from "./schedule-week-view";
import { AddDialog } from "@/pages/schedule/blocks/add-dialog";
import { DetailDialog } from "@/pages/schedule/blocks/detail-dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useDebounce } from "use-debounce";
import { apiConfig } from "@/config/api.config";

const baseUrl = apiConfig.API_URL;

export function ScheduleCalendar() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");

  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const {
    data: schedules = [],
    isLoading,
    isFetching,
    isError,
  } = useQuery<CalendarEvent[]>({
    queryKey: ["schedules", debouncedSearch],
    queryFn: async () => {
      const { data } = await axios.get(`${baseUrl}/schedules`, {
        params: {
          page: 1,
          limit: 100,
          with_deleted: false,
          order_field: "created_at",
          order_direction: "DESC",
          filter: debouncedSearch
            ? JSON.stringify({ title: debouncedSearch })
            : "",
        },
      });

      return data.data.list;
    },
    placeholderData: (prev) => prev,
  });

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

  function handleAddDialog() {
    setAddDialogOpen(true);
  }

  function handleDetailDialog(event: CalendarEvent) {
    setSelectedEvent(event.id);
    setDetailDialogOpen(true);
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

      <DetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        event={scheduleDetail ?? null}
        isLoading={isLoadingDetail}
      />
    </div>
  );
}
