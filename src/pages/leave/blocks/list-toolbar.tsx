import { useAuth } from "@/auth/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PiArrowsClockwise, PiPlusBold } from "react-icons/pi";

interface ListToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  onReset: () => void;
  onAdd: () => void;
}

const statuses = [
  { id: "approved", name: "Approved" },
  { id: "rejected", name: "Rejected" },
  { id: "pending", name: "Pending" },
];

const ListToolbar = ({
  search,
  onSearchChange,
  status,
  onStatusChange,
  onReset,
  onAdd,
}: ListToolbarProps) => {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";

  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 items-center gap-2">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-2 min-w-0"
        />

        <SearchableSelect
          options={statuses}
          value={status}
          onChange={onStatusChange}
          placeholder="All Status"
          searchPlaceholder="Search status..."
          emptyMessage="No status found."
          className="flex-1 min-w-0"
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
      {!isAdmin && (
        <Button variant="primary" type="button" onClick={onAdd}>
          <PiPlusBold />
          Add Leave
        </Button>
      )}
    </div>
  );
};

export { ListToolbar };
