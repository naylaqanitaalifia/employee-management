import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PiArrowsClockwise, PiPlusBold } from "react-icons/pi";
import { Check, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { useDepartments } from "@/hooks/use-departments";
import { cn } from "@/lib/utils";

interface ListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  onReset: () => void;
  onAdd: () => void;
}

const ListToolbar = ({
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  onReset,
  onAdd,
}: ListToolbarProps) => {
  const { data: departments = [] } = useDepartments();
  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);

  const selectedDepartment = departments.find((d) => d.id === departmentId);

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-[2] min-w-0"
        />
        <Popover
          open={departmentPopoverOpen}
          onOpenChange={setDepartmentPopoverOpen}
        >
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className="flex-1 min-w-0 justify-between"
            >
              {selectedDepartment?.name || "All Department"}
              <ChevronDownIcon className="pointer-events-none size-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="p-0 w-[320px]" align="start">
            <Command>
              <CommandInput placeholder="Search..." />
              <CommandList>
                <CommandEmpty>No department found.</CommandEmpty>
                <CommandGroup>
                  {departments.map((department) => (
                    <CommandItem
                      key={department.id}
                      value={department.name}
                      onSelect={() => {
                        onDepartmentChange(department.id);
                        setDepartmentPopoverOpen(false);
                      }}
                      className="relative pr-9"
                    >
                      {department.name}

                      <Check
                        className={cn(
                          "absolute right-3 size-4",
                          departmentId === department.id
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={onReset}>
              <PiArrowsClockwise />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Reset Filter</TooltipContent>
        </Tooltip>
      </div>
      <Button variant="primary" type="button" onClick={onAdd}>
        <PiPlusBold />
        Add Position
      </Button>
    </div>
  );
};

export { ListToolbar };
