import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface WeeklyCalendarProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export function WeeklyCalendar({ value, onChange }: WeeklyCalendarProps) {
  const currentDate = value ?? new Date();

  const weekStart = startOfWeek(currentDate, {
    weekStartsOn: 1,
  });

  const weekDays = Array.from({ length: 7 }, (_, index) =>
    addDays(weekStart, index),
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange?.(subWeeks(currentDate, 1))}
        >
          <ChevronLeft className="size-4" />
        </Button>

        <p className="font-semibold">{format(weekStart, "MMMM yyyy")}</p>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onChange?.(addWeeks(currentDate, 1))}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => {
          const selected = value?.toDateString() === day.toDateString();

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onChange?.(day)}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-xs text-muted-foreground">
                {format(day, "EEE")}
              </span>

              <span
                className={
                  selected
                    ? "flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : "flex size-8 items-center justify-center rounded-full hover:bg-muted"
                }
              >
                {format(day, "d")}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}
