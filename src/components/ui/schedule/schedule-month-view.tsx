import { DayPicker } from "react-day-picker";

interface ScheduleMonthViewProps {
  currentDate: Date;
}

export function ScheduleMonthView({ currentDate }: ScheduleMonthViewProps) {
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
          month_grid: 'w-full border-collapse',
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
      />
    </div>
  );
}
