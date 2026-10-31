import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiArrowsClockwise, PiPlusBold } from "react-icons/pi";
import { Check, ChevronDownIcon } from "lucide-react";
import { useDepartments } from "@/hooks/use-departments";
import { usePositions } from "@/hooks/use-positions";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface ListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  departmentId: string;
  onDepartmentChange: (value: string) => void;
  positionId: string;
  onPositionChange: (value: string) => void;
  onReset: () => void;
  onAdd: () => void;
}

const ListToolbar = ({
  search,
  onSearchChange,
  departmentId,
  onDepartmentChange,
  positionId,
  onPositionChange,
  onReset,
  onAdd,
}: ListToolbarProps) => {
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();

  const [departmentPopoverOpen, setDepartmentPopoverOpen] = useState(false);
  const [positionPopoverOpen, setPositionPopoverOpen] = useState(false);

  const selectedDepartment = departments.find((d) => d.id === departmentId);
  const selectedPosition = positions.find((p) => p.id === positionId);

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <SearchableSelect
          options={departments}
          value={departmentId}
          onChange={onDepartmentChange}
          placeholder="All Department"
          searchPlaceholder="Search department..."
          emptyMessage="No department found."
        />
        <SearchableSelect
          options={positions}
          value={positionId}
          onChange={onPositionChange}
          placeholder="All Position"
          searchPlaceholder="Search position..."
          emptyMessage="No position found."
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
        Add Employee
      </Button>
    </div>
  );
};

export { ListToolbar };
