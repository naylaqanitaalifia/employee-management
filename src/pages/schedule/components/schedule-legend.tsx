import { EVENT_COLORS } from "./schedule-types";

const SCHEDULE_TYPES = [
  { type: "meeting", label: "Meeting" },
  { type: "leave", label: "Leave" },
  { type: "holiday", label: "Holiday" },
  { type: "task", label: "Task" },
  { type: "training", label: "Training" },
  { type: "event", label: "Event" },
  { type: "other", label: "Other" },
] as const;

export function ScheduleLegend() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Header */}
      <div className="mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Schedule Categories
        </h3>

        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
          Color indicators to identify each schedule type
        </p>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap gap-2">
        {SCHEDULE_TYPES.map(({ type, label }) => (
          <div
            key={type}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 dark:border-gray-700 dark:bg-gray-900/50"
          >
            <span
              className={`h-2.5 w-2.5 shrink-0 rounded-full ${EVENT_COLORS[type].dot}`}
            />

            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
