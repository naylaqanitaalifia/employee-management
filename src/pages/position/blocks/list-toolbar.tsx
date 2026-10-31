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
import { SearchableSelect } from "@/components/ui/searchable-select";

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
        <SearchableSelect
          options={departments}
          value={departmentId}
          onChange={onDepartmentChange}
          placeholder="All Department"
          searchPlaceholder="Search department..."
          emptyMessage="No department found."
        />
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
