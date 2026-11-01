import { formatDateKey } from "@/lib/helpers";
import { EVENT_COLORS, type CalendarEvent } from "./schedule-types";

interface ScheduleWeekViewProps {
  currentDate: Date;
  onEventClick: (event: CalendarEvent, date: Date) => void;
  events: CalendarEvent[];
}

const HOURS = Array.from({ length: 24 }, (_, index) => index);

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const HOUR_HEIGHT = 80; // in pixels

// Mengubah jam "09:30" menjadi total menit.
function getMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function ScheduleWeekView({
  currentDate,
  onEventClick,
  events,
}: ScheduleWeekViewProps) {
  function getStartOfWeek(date: Date) {
    const startOfWeek = new Date(date);

    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    return startOfWeek;
  }

  const startOfWeek = getStartOfWeek(currentDate);

  const weekdays = WEEKDAYS.map((day, index) => {
    const date = new Date(startOfWeek);

    date.setDate(startOfWeek.getDate() + index);

    return {
      day,
      date,
    };
  });

  return (
    <div className="w-full max-h-[800px] overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg">
      <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))] border-b border-gray-200 dark:border-gray-700">
        <div className="border-r border-gray-200 dark:border-gray-700" />

        {weekdays.map(({ day, date }) => (
          <div
            key={day}
            className="border-r border-gray-200 p-3 text-center last:border-r-0 dark:border-gray-700"
          >
            <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {day}
            </div>

            <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      <div className="max-h-[530px] overflow-y-auto">
        <div className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
          {/* Time */}
          {/* <div className="h-20 border-r border-b border-gray-200 px-2 pt-2 text-right text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {`${String(hour).padStart(2, "0")}:00`}
            </div> */}
          <div>
            {HOURS.map((hour) => (
              <div
                key={hour}
                className="h-20 border-r border-b border-gray-200 px-2 pt-2 text-right text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400"
              >
                {`${String(hour).padStart(2, "0")}:00`}
              </div>
            ))}
          </div>

          {/* Days */}
          {weekdays.map(({ day, date }) => {
            const dateKey = formatDateKey(date);

            const dayEvents = events.filter(
              (event) => formatDateKey(new Date(event.start_date)) === dateKey,
            );
            return (
              <div
                key={day}
                className="relative border-r border-gray-200 last:border-r-0 dark:border-gray-700"
                style={{ height: `${HOURS.length * HOUR_HEIGHT}px` }}
              >
                {/* HOUR GRID */}
                {HOURS.map((hour) => (
                  <div
                    key={hour}
                    className="absolute left-0 right-0 h-20 border-b border-gray-200 dark:border-gray-700"
                    style={{ top: `${hour * HOUR_HEIGHT}px` }}
                  />
                ))}

                {/* EVENTS */}
                {dayEvents.map((event, index) => {
                  const colors = EVENT_COLORS[event.type ?? "other"];

                  const startMinutes = getMinutes(event.start_time);
                  const endMinutes = getMinutes(event.end_time);

                  // Posisi event berdasarkan jam mulai.
                  const top = (startMinutes / 60) * HOUR_HEIGHT;

                  // Tinggi event berdasarkan durasi.
                  const height = Math.max(
                    ((endMinutes - startMinutes) / 60) * HOUR_HEIGHT,
                    24,
                  );

                  return (
                    <button
                      key={`${event.id}-${index}`}
                      type="button"
                      onClick={() => onEventClick(event, date)}
                      className={[
                        "absolute left-1 right-1 z-10",
                        "flex flex-col items-start overflow-hidden",
                        "rounded-md px-1.5 py-1",
                        "text-left text-xs font-medium",
                        "cursor-pointer hover:opacity-80",
                        colors.wrapper,
                      ].join(" ")}
                      style={{
                        top: `${top}px`,
                        height: `${height}px`,
                      }}
                    >
                      <span className="w-full truncate font-semibold">
                        {event.title}
                      </span>

                      <span className="w-full truncate opacity-80">
                        {event.start_time} - {event.end_time}
                      </span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
