import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiArrowsClockwise } from "react-icons/pi";

interface ListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  onAdd: () => void;
}

const statuses = [
  { id: "present", name: "Present" },
  { id: "absent", name: "Absent" },
  { id: "late", name: "Late" },
];

const ListToolbar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onReset,
  // onAdd,
}: ListToolbarProps) => {
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
          options={statuses}
          value={status}
          onChange={onStatusChange}
          placeholder="All Status"
          searchPlaceholder="Search status..."
          emptyMessage="No status found."
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
      {/* <Button variant="default" type="button" onClick={onAdd}>
        <PiPlusBold />
        Add Employee
      </Button> */}
    </div>
  );
};

export { ListToolbar };
