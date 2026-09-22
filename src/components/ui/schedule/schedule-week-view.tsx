
interface ScheduleWeekViewProps {
  currentDate: Date;
}

const HOURS = Array.from({ length: 24 }, (_, index) => index);

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function ScheduleWeekView({ currentDate }: ScheduleWeekViewProps) {
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
    <div className="w-full overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-lg">
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

      <div>
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="grid grid-cols-[64px_repeat(7,minmax(0,1fr))]"
          >
            {/* Time */}
            <div className="h-20 border-r border-b border-gray-200 px-2 pt-2 text-right text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
              {`${String(hour).padStart(2, "0")}:00`}
            </div>

            {/* Days */}
            {weekdays.map(({ day }) => (
              <div
                key={day}
                className="h-20 border-r border-b border-gray-200 last:border-r-0 dark:border-gray-700"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
