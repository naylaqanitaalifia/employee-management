import { DayButton, DayPicker, type DayProps } from "react-day-picker";
import type { CalendarEvent } from "./schedule-types";

interface ScheduleMonthViewProps {
  currentDate: Date;
  onEventClick: (event: CalendarEvent, date: Date) => void;
  events: CalendarEvent[];
}

export const EVENT_COLORS = {
  meeting: {
    wrapper: "bg-blue-50 text-blue-700",
    dot: "bg-blue-600",
  },

  leave: {
    wrapper: "bg-red-50 text-red-700",
    dot: "bg-red-600",
  },

  holiday: {
    wrapper: "bg-amber-50 text-amber-700",
    dot: "bg-amber-600",
  },

  task: {
    wrapper: "bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-600",
  },

  training: {
    wrapper: "bg-teal-50 text-teal-700",
    dot: "bg-teal-600",
  },

  event: {
    wrapper: "bg-purple-50 text-purple-700",
    dot: "bg-purple-600",
  },

  other: {
    wrapper: "bg-gray-50 text-gray-700",
    dot: "bg-gray-600",
  },
};

function formatDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function CustomDayButton({
  day,
  modifiers,
  onEventClick,
  allEvents,
}: DayProps & {
  onEventClick(event: CalendarEvent, date: Date): void;
  allEvents: CalendarEvent[];
}) {
  const date = day.date;
  const dateKey = formatDateKey(date);
  const events = allEvents.filter((event) => {
    return formatDateKey(new Date(event.start_date)) === dateKey;
  });

  return (
    <td
      className={[
        "relative",
        "min-h-[140px]",
        "border-r",
        "border-b",
        "border-gray-200",
        "p-0",
        "align-top",
        modifiers.today ? "bg-gray-50 dark:bg-gray-700/60" : "",
        "dark:border-gray-700",
      ].join(" ")}
    >
      <DayButton
        day={day}
        modifiers={modifiers}
        className={[
          "flex",
          "min-h-[140px]",
          "w-full",
          "flex-col",
          "items-stretch",
          "justify-start",
          "rounded-none",
          "border-0",
          "bg-transparent",
          "p-2",
          "text-left",
          "font-medium",
          "text-gray-900",
          "hover:bg-gray-50",
          "dark:text-white",
          "dark:hover:bg-gray-700",
        ].join(" ")}
      >
        {/* DATE */}
        <div className="mb-2 flex h-6 items-center">
          <span
            className={
              modifiers.outside
                ? "text-sm font-semibold text-gray-400"
                : "text-sm font-semibold text-gray-900 dark:text-white"
            }
          >
            {date.getDate()}
          </span>
        </div>

        {/* EVENTS */}
        <div className="flex w-full flex-col gap-1.5">
          {events.map((event, index) => {
            const colors = EVENT_COLORS[event.type ?? "other"];

            return (
              <span
                key={`${event.title}-${index}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onEventClick(event, date);
                }}
                className={[
                  "flex",
                  "w-full",
                  "min-w-0",
                  "items-center",
                  "gap-1.5",
                  "rounded-md",
                  "px-2",
                  "py-1.5",
                  "text-xs",
                  "font-medium",
                  "cursor-pointer",
                  colors.wrapper,
                ].join(" ")}
              >
                <span
                  className={[
                    "h-1.5",
                    "w-1.5",
                    "shrink-0",
                    "rounded-full",
                    colors.dot,
                  ].join(" ")}
                />

                <span className="min-w-0 truncate">{event.title}</span>
              </span>
            );
          })}
        </div>
      </DayButton>
    </td>
  );
}

export function ScheduleMonthView({
  currentDate,
  onEventClick,
  events,
}: ScheduleMonthViewProps) {
  return (
    <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg">
      <DayPicker
        month={currentDate}
        fixedWeeks
        showOutsideDays
        hideNavigation
        className="w-full"
        classNames={{
          root: "w-full",
          months: "w-full",
          month: "w-full",
          month_caption: "hidden",
          month_grid: "w-full border-collapse",
          weekdays:
            "grid grid-cols-7 border-b border-gray-200 dark:border-gray-700",
          weekday: "flex items-center justify-center h-10 font-medium",
          weeks: "w-full",
          week: "grid grid-cols-7",
          day: "relative min-h-32 border-r border-b border-gray-200 p-2 dark:border-gray-700 last:border-r-0",
          day_button:
            "flex flex-col items-start justify-start h-full min-h-28 w-full rounded-lg border-0 bg-transparent p-2 font-medium text-gray-900 hover:bg-gray-50 dark:text-white dark:hover:bg-gray-700",
          outside: "text-gray-400 dark:text-gray-500",
          today: "bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white",
        }}
        components={{
          Day: (props) => (
            <CustomDayButton
              {...props}
              onEventClick={onEventClick}
              allEvents={events}
            />
          ),
        }}
      />
    </div>
  );
}
