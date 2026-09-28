export type CalendarView = "month" | "week" | "day" | "list";

export const EVENT_COLORS = {
  meeting: {
    wrapper: "bg-blue-50 text-blue-700",
    dot: "bg-blue-600",
    header: "bg-gradient-to-r from-blue-500 to-blue-600 dark:bg-blue-500/10",
  },

  leave: {
    wrapper: "bg-red-50 text-red-700",
    dot: "bg-red-600",
    header: "bg-gradient-to-r from-red-500 to-red-600 dark:bg-red-500/10",
  },

  holiday: {
    wrapper: "bg-amber-50 text-amber-700",
    dot: "bg-amber-600",
    header: "bg-gradient-to-r from-amber-500 to-amber-600 dark:bg-amber-500/10",
  },

  task: {
    wrapper: "bg-indigo-50 text-indigo-700",
    dot: "bg-indigo-600",
    header:
      "bg-gradient-to-r from-indigo-500 to-indigo-600 dark:bg-indigo-500/10",
  },

  training: {
    wrapper: "bg-teal-50 text-teal-700",
    dot: "bg-teal-600",
    header: "bg-gradient-to-r from-teal-500 to-teal-600 dark:bg-teal-500/10",
  },

  event: {
    wrapper: "bg-purple-50 text-purple-700",
    dot: "bg-purple-600",
    header:
      "bg-gradient-to-r from-purple-500 to-purple-600 dark:bg-purple-500/10",
  },

  other: {
    wrapper: "bg-gray-50 text-gray-700",
    dot: "bg-gray-600",
    header: "bg-gradient-to-r from-gray-500 to-gray-600 dark:bg-gray-500/10",
  },
};

export interface Employee {
  id: string;
  photo: string;
  name: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  start_date: Date;
  end_date: Date;
  start_time: string;
  end_time: string;
  description?: string;
  location_type: "online" | "offline" | "hybrid";
  location?: string;
  online_meeting_link?: string;
  type?:
    | "meeting"
    | "leave"
    | "holiday"
    | "task"
    | "training"
    | "event"
    | "other";
  employees: Employee[];
  created_at: string;
  created_by: string;
  updated_at: string;
  updated_by: string;
  deleted_at: string;
  deleted_by: string;
}
