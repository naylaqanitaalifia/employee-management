import { apiConfig } from "@/config/api.config";
import { ScheduleCalendar } from "@/pages/schedule/components/schedule-calendar";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useDebounce } from "use-debounce";
import type { CalendarEvent } from "./components/schedule-types";
import { ContentLoader } from "@/components/common/content-loader";

const baseUrl = apiConfig.API_URL;

export function Page() {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);

  const { data: schedules = [], isLoading } = useQuery<CalendarEvent[]>({
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

  if (isLoading) {
    return <ContentLoader />;
  }

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

      <ScheduleCalendar schedules={schedules} />
    </div>
  );
}
