import { useState } from "react";
import { ScheduleHeader } from "./schedule-header";
import { ScheduleMonthView } from "./schedule-month-view";
import type { CalendarView } from "./schedule-types";
import { ScheduleWeekView } from "./schedule-week-view";

export function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>("month");

  return (
    <div className="w-full">
      <ScheduleHeader
        currentDate={currentDate}
        setCurrentDate={setCurrentDate}
        view={view}
        setView={setView}
      />

      {view === "month" && <ScheduleMonthView currentDate={currentDate} />}
      {view === "week" && <ScheduleWeekView currentDate={currentDate} />}
    </div>
  );
}
