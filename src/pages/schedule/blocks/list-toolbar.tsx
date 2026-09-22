import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiArrowsClockwise, PiPlusBold } from "react-icons/pi";

interface ListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onReset: () => void;
  onAdd: () => void;
}

const ListToolbar = ({
  search,
  onSearchChange,
  onReset,
  onAdd,
}: ListToolbarProps) => {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
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
        Add Department
      </Button>
    </div>
  );
};

export { ListToolbar };
