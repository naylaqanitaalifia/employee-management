import { useCalendarApp, ScheduleXCalendar } from "@schedule-x/react";

import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
  createViewWeekAgenda,
  createViewList,
} from "@schedule-x/calendar";

import "temporal-polyfill/global";
import "@schedule-x/theme-default/dist/index.css";

export default function ScheduleCalendar() {
  const calendar = useCalendarApp({
    views: [
      createViewDay(),
      createViewWeek(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
      createViewWeekAgenda(),
      createViewList(),
    ],

    events: [
      {
        id: "1",
        title: "Digital Art Showcase",
        start: Temporal.PlainDate.from("2026-09-02"),
        end: Temporal.PlainDate.from("2026-09-02"),
      },
      {
        id: "2",
        title: "Data Science Meetup",
        start: Temporal.PlainDate.from("2026-09-05"),
        end: Temporal.PlainDate.from("2026-09-05"),
      },
      {
        id: "3",
        title: "Photography Masterclass",
        start: Temporal.PlainDate.from("2026-09-06"),
        end: Temporal.PlainDate.from("2026-09-06"),
      },
      {
        id: "4",
        title: "Python Coding Challenge",
        start: Temporal.PlainDate.from("2026-09-09"),
        end: Temporal.PlainDate.from("2026-09-09"),
      },
      {
        id: "5",
        title: "UI/UX Design Sprint",
        start: Temporal.PlainDate.from("2026-09-19"),
        end: Temporal.PlainDate.from("2026-09-19"),
      },
      {
        id: "6",
        title: "Web Dev Bootcamp",
        start: Temporal.PlainDate.from("2026-09-19"),
        end: Temporal.PlainDate.from("2026-09-19"),
      },
      {
        id: "7",
        title: "Data Science Meetup",
        start: Temporal.PlainDate.from("2026-09-23"),
        end: Temporal.PlainDate.from("2026-09-23"),
      },
    ],

    locale: "en-US",
    firstDayOfWeek: 7,
  });

  return (
    <div className="sx-react-calendar-wrapper h-[800px] w-full">
      <ScheduleXCalendar calendarApp={calendar} />
    </div>
  );
}