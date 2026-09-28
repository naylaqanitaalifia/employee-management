// import { useState } from "react";
// import { ScheduleHeader } from "./schedule-header";
// import { ScheduleMonthView } from "./schedule-month-view";
// import type { CalendarView } from "./schedule-types";
// import { ScheduleWeekView } from "./schedule-week-view";
// import { AddDialog } from "@/pages/schedule/blocks/add-dialog";

// export function ScheduleCalendar() {
//   const [currentDate, setCurrentDate] = useState(new Date());
//   const [view, setView] = useState<CalendarView>("month");

//   const [addDialogOpen, setAddDialogOpen] = useState(false);

//   function handleAddDialog() {
//     setAddDialogOpen(true);
//   }

//   return (
//     <div className="w-full">
//       <ScheduleHeader
//         currentDate={currentDate}
//         setCurrentDate={setCurrentDate}
//         view={view}
//         setView={setView}
//         onAddDialogEvent={handleAddDialog}
//       />

//       {view === "month" && <ScheduleMonthView currentDate={currentDate} />}
//       {view === "week" && <ScheduleWeekView currentDate={currentDate} />}

//       <AddDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} />
//     </div>
//   );
// }
