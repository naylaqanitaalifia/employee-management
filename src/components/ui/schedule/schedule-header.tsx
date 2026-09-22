import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PiCaretLeftBold, PiCaretRightBold, PiPlusBold } from "react-icons/pi";
import type { CalendarView } from "./schedule-types";

interface ScheduleHeaderProps {
  currentDate: Date;
  setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
  view: CalendarView;
  setView: React.Dispatch<React.SetStateAction<CalendarView>>;
}

const formatHeaderTitle = (date: Date, currentView: CalendarView) => {
  switch (currentView) {
    case "month":
      return date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

    case "week":
    case "list": {
      const startOfWeek = new Date(date); // Ambil tanggal awal yang sedang aktif
      startOfWeek.setDate(date.getDate() - date.getDay()); // Cari hari Minggu

      const endOfWeek = new Date(startOfWeek); // Cari hari Sabtu
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const startMonth = startOfWeek.toLocaleDateString("en-US", {
        month: "short",
      });

      const startDay = startOfWeek.getDate();
      const endDay = endOfWeek.getDate();
      const year = endOfWeek.getFullYear();

      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }

    case "day":
      return date.toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    default:
      break;
  }
};

export function ScheduleHeader({
  currentDate,
  setCurrentDate,
  view,
  setView,
}: ScheduleHeaderProps) {
  function handlePrevious() {
    const newDate = new Date(currentDate);

    switch (view) {
      case "month":
        newDate.setMonth(newDate.getMonth() - 1);
        break;

      case "week":
      case "list":
        newDate.setDate(newDate.getDate() - 7);
        break;

      case "day":
        newDate.setDate(newDate.getDate() - 1);
        break;

      default:
        break;
    }

    setCurrentDate(newDate);
  }

  function handleNext() {
    const newDate = new Date(currentDate);

    switch (view) {
      case "month":
        newDate.setMonth(newDate.getMonth() + 1);
        break;

      case "week":
      case "list":
        newDate.setDate(newDate.getDate() + 7);
        break;

      case "day":
        newDate.setDate(newDate.getDate() + 1);
        break;

      default:
        break;
    }

    setCurrentDate(newDate);
  }

  function handleToday() {
    setCurrentDate(new Date());
  }

  return (
    <div className="flex items-center justify-between h-16">
      <div className="flex items-center gap-4">
        <div className="">
          <Button variant="ghost" size="icon" onClick={handlePrevious}>
            <PiCaretLeftBold />
          </Button>

          <Button variant="ghost" size="icon" onClick={handleNext}>
            <PiCaretRightBold />
          </Button>
        </div>
        <h4 className="font-semibold">
          {formatHeaderTitle(currentDate, view)}
        </h4>
        <Button variant="outline" onClick={handleToday}>
          Today
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Tabs
          value={view}
          onValueChange={(value) => setView(value as CalendarView)}
        >
          <TabsList defaultValue="month">
            <TabsTrigger value="month">Month</TabsTrigger>
            <TabsTrigger value="week">Week</TabsTrigger>
            <TabsTrigger value="day">Day</TabsTrigger>
            <TabsTrigger value="list">List</TabsTrigger>
          </TabsList>
        </Tabs>

        <Button variant="primary" type="button">
          <PiPlusBold />
          New Event
        </Button>
      </div>
    </div>
  );
}
