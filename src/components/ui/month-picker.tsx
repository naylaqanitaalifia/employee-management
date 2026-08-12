import { PiCalendarDots } from "react-icons/pi";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

interface MonthPickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function MonthPicker({
  value,
  onChange,
  disabled,
  minDate,
  maxDate,
  className,
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(
    value?.getFullYear() ?? new Date().getFullYear(),
  );

  const months = Array.from({ length: 12 }, (_, index) => {
    return new Date(year, index, 1);
  });

  const isDisabled = (date: Date) => {
    if (minDate) {
      const minMonth = new Date(minDate.getFullYear(), minDate.getMonth(), 1);

      if (date < minMonth) return true;
    }

    if (maxDate) {
      const maxMonth = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

      if (date > maxMonth) return true;
    }

    return false;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn("w-full justify-between", className)}
        >
          {value ? format(value, "MMMM yyyy") : "Select month"}

          <PiCalendarDots className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-[280px] p-3">
        {/* Year */}
        <div className="mb-3 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setYear((prev) => prev - 1)}
          >
            <ChevronLeftIcon className="size-4" />
          </Button>

          <span className="text-sm font-semibold">{year}</span>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setYear((prev) => prev + 1)}
          >
            <ChevronRightIcon className="size-4" />
          </Button>
        </div>

        {/* Months */}
        <div className="grid grid-cols-3 gap-2">
          {months.map((month) => {
            const disabledMonth = isDisabled(month);

            const selected =
              value &&
              value.getFullYear() === month.getFullYear() &&
              value.getMonth() === month.getMonth();

            return (
              <Button
                key={month.getMonth()}
                type="button"
                variant={selected ? "primary" : "outline"}
                disabled={disabledMonth}
                className="h-9"
                onClick={() => {
                  onChange(month);
                  setOpen(false);
                }}
              >
                {format(month, "MMM")}
              </Button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
