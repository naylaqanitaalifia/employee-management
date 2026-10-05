import { DayButton, DayPicker, type DayProps } from "react-day-picker";
import type { CalendarEvent } from "./schedule-types";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ScheduleMonthViewProps {
  currentDate: Date;
  onEventClick: (event: CalendarEvent, date: Date) => void;
  events: CalendarEvent[];
}

const MAX_VISIBLE_EVENTS = 2;

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
  onShowMore,
  allEvents,
}: DayProps & {
  onEventClick(event: CalendarEvent, date: Date): void;
  onShowMore(date: Date, events: CalendarEvent[]): void;
  allEvents: CalendarEvent[];
}) {
  const date = day.date;
  const dateKey = formatDateKey(date);
  const events = allEvents.filter((event) => {
    return formatDateKey(new Date(event.start_date)) === dateKey;
  });

  const visibleEvents = events.slice(0, MAX_VISIBLE_EVENTS);
  const hiddenCount = events.length - visibleEvents.length;

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
          {visibleEvents.map((event, index) => {
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
                  "py-1",
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

          {hiddenCount > 0 && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  className="w-full justify-start rounded-md px-2 py-1 text-left text-xs font-semibold text-muted-foreground hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700"
                >
                  {hiddenCount} more
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-60"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {format(date, "EEE")}
                  </span>
                  <span className="text-sm font-semibold">
                    {format(date, "d MMMM")}
                  </span>
                </div>

                <div className="flex max-h-72 flex-col gap-1.5 overflow-y-auto">
                  {events.map((event, index) => {
                    const colors = EVENT_COLORS[event.type ?? "other"];
                    return (
                      <button
                        key={`${event.title}-${index}`}
                        type="button"
                        onClick={() => onEventClick(event, date)}
                        className={[
                          "flex",
                          "w-full",
                          "items-center",
                          "gap-2",
                          "rounded-md",
                          "px-2",
                          "py-1",
                          "text-left",
                          "text-sm",
                          "font-medium",
                          "cursor-pointer",
                          colors.wrapper,
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "h-2",
                            "w-2",
                            "shrink-0",
                            "rounded-full",
                            colors.dot,
                          ].join(" ")}
                        />
                        <span className="truncate">{event.title}</span>
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          )}
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
  const [moreDialogOpen, setMoreDialogOpen] = useState<{
    date: Date;
    events: CalendarEvent[];
  } | null>(null);

  function handleShowMore(date: Date, events: CalendarEvent[]) {
    setMoreDialogOpen({ date, events });
  }

  return (
    <>
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
                onShowMore={handleShowMore}
                allEvents={events}
              />
            ),
          }}
        />
      </div>

      <Dialog
        open={!!moreDialogOpen}
        onOpenChange={(open) => !open && setMoreDialogOpen(null)}
      >
        <DialogContent className="max-w-60">
          {moreDialogOpen && (
            <>
              <DialogHeader>
                <DialogTitle>
                  <div className="flex flex-col items-center gap-1.5">
                    <span>{format(moreDialogOpen.date, "EEE")}</span>
                    <span className="text-xl">
                      {format(moreDialogOpen.date, "d")}
                    </span>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="flex max-h-80 flex-col gap-1.5 overflow-y-auto">
                {moreDialogOpen.events.map((event, index) => {
                  const colors = EVENT_COLORS[event.type ?? "other"];
                  return (
                    <button
                      key={`${event.title}-${index}`}
                      type="button"
                      onClick={() => {
                        onEventClick(event, moreDialogOpen.date);
                        setMoreDialogOpen(null);
                      }}
                      className={[
                        "flex",
                        "w-full",
                        "items-center",
                        "gap-2",
                        "rounded-md",
                        "px-3",
                        "py-1",
                        "text-left",
                        "text-sm",
                        "font-medium",
                        "cursor-pointer",
                        colors.wrapper,
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "h-2",
                          "w-2",
                          "shrink-0",
                          "rounded-full",
                          colors.dot,
                        ].join(" ")}
                      />
                      <span className="truncate">{event.title}</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
