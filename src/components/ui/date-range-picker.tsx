import { format } from "date-fns";
import { type DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PiCalendarDots } from "react-icons/pi";
import { cn } from "@/lib/utils";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (date: DateRange | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function DateRangePicker({
  value,
  onChange,
  disabled,
  className,
}: DateRangePickerProps) {
  // const [date, setDate] = useState<DateRange | undefined>({
  //   from: new Date(new Date().getFullYear(), 0, 20),
  //   to: addDays(new Date(new Date().getFullYear(), 0, 20), 20),
  // });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn("justify-between px-2.5 font-normal", className)}
        >
          {value?.from ? (
            value.to ? (
              <>
                {format(value.from, "LLL dd, y")} -{" "}
                {format(value.to, "LLL dd, y")}
              </>
            ) : (
              format(value.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
          <PiCalendarDots className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={value?.from}
          selected={value}
          onSelect={onChange}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
}
