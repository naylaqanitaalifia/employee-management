import { PiCalendarDots } from "react-icons/pi";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Calendar } from "./calendar";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  disabled,
  minDate,
  maxDate,
  className,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn("w-full flex justify-between")}
        >
          {value ? format(value, "yyyy-MM-dd") : "Select date"}
          <PiCalendarDots />
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" className="w-auto">
        <Calendar
          mode="single"
          selected={value}
          className="flex-start"
          captionLayout="dropdown"
          onSelect={(date) => {
            if (!date) return;

            onChange(date);
            setOpen(false);
          }}
          disabled={(date) => {
            if (minDate && date < minDate) return true;
            if (maxDate && date > maxDate) return true;
            return false;
          }}
        />
      </PopoverContent>
    </Popover>
  );
}

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Field } from "@/components/ui/field";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { cn } from "@/lib/utils";
// import { useState } from "react";

// export function DatePicker() {
//   const [open, setOpen] = useState(false);
//   const [date, setDate] = useState<Date | undefined>(undefined);

//   return (
//     <Field className="mx-auto w-full">
//       <Popover open={open} onOpenChange={setOpen}>
//         <PopoverTrigger asChild>
//           <Button
//             variant="outline"
//             id="date"
//             className={cn(
//               "justify-start font-normal",
//               !date && "text-muted-foreground/70",
//             )}
//           >
//             {date ? date.toLocaleDateString() : "Select date"}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto overflow-hidden p-0" align="start">
//           <Calendar
//             mode="single"
//             selected={date}
//             defaultMonth={date}
//             captionLayout="dropdown"
//             onSelect={(date) => {
//               setDate(date);
//               setOpen(false);
//             }}
//           />
//         </PopoverContent>
//       </Popover>
//     </Field>
//   );
// }
