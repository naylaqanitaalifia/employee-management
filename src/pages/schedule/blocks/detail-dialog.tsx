import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  EVENT_COLORS,
  type CalendarEvent,
} from "@/pages/schedule/components/schedule-types";
import { PiClockBold, PiMapPinBold } from "react-icons/pi";
import { Separator } from "@/components/ui/separator";
import { isSameDay } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { apiConfig } from "@/config/api.config";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: CalendarEvent | null;
  onEdit?: (event: CalendarEvent) => void;
  onDelete?: (event: CalendarEvent) => void;
  isLoading?: boolean;
  isRefreshing?: boolean;
}

function formatDate(input: Date | string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("id-ID", {
    month: "short",
    day: "numeric",
  });
}

const API_BASE_URL = apiConfig.API_URL.replace(/\/api\/?$/, "");

export function DetailDialog({
  open,
  onOpenChange,
  event,
  // onEdit,
  // onDelete,
  isLoading,
  isRefreshing,
}: Props) {
  //   if (!event) return null;
  const colors = EVENT_COLORS[event?.type || "other"];
  const isPending = !!isLoading || !!isRefreshing;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-150 gap-0 overflow-hidden p-0"
        closeButtonClassname="text-white hover:bg-white/10 hover:text-white"
      >
        <DialogHeader className={`text-white gap-4 p-6 mb-0 ${colors.header}`}>
          <DialogTitle className="text-sm">Schedule Details</DialogTitle>

          <div className="flex flex-col gap-1.5">
            <h3 className="text-lg">
              {event?.title ?? <Skeleton className="h-4 w-40" />}
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <PiClockBold size={14} />
                {/* <span className="text-sm">
                  {isSameDay(event?.start_date, event?.end_date)
                    ? formatDate(event?.start_date)
                    : `${formatDate(event?.start_date)} - ${formatDate(event?.end_date)}`}
                  {" • "}
                  {event?.start_time || "-"} - {event?.end_time || "-"}
                </span> */}

                {event?.start_date ? (
                  <span className="text-sm">
                    {isSameDay(event?.start_date, event?.end_date)
                      ? formatDate(event?.start_date)
                      : `${formatDate(event?.start_date)} - ${formatDate(event?.end_date)}`}
                    {" • "}
                    {event.start_time || "-"} - {event.end_time || "-"}
                  </span>
                ) : (
                  <Skeleton className="h-3 w-44" />
                )}
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-white/15 border border-white/25 rounded-lg">
                <PiMapPinBold size={14} />
                {isPending ? (
                  <Skeleton className="h-3 w-20" />
                ) : (
                  <span className="text-sm">{event?.location || "-"}</span>
                )}
              </div>
            </div>
          </div>
        </DialogHeader>

        <DialogBody className="scrollable-y flex flex-col gap-4 p-6 overflow-scroll">
          <div className="flex flex-col items-start gap-2">
            <p className="text-sm text-muted-foreground uppercase">
              {event?.employees?.length} people invited
            </p>
            {isPending ? (
              <>
                <div className="flex items-center gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="size-10 rounded-full" />
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  {event?.employees &&
                    event?.employees.map((employee) => {
                      const photoUrl = employee?.photo
                        ? `${API_BASE_URL}${employee.photo}`
                        : "/images/photo-profile.png";
                      console.log("iniphotourl", photoUrl);

                      return (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <img
                              src={photoUrl}
                              alt={employee.name}
                              className="size-10 rounded-full object-cover cursor-pointer"
                            />
                          </TooltipTrigger>
                          <TooltipContent>{employee.name}</TooltipContent>
                        </Tooltip>
                      );
                    })}
                </div>
              </>
            )}
          </div>

          <Separator />

          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
            <p className="text-sm font-semibold tracking-wide uppercase">
              Description
            </p>
            <p className="">
              {event?.description ?? (
                <>
                  <Skeleton className="h-4 w-full mb-2" />
                  <div className="flex gap-2 mb-2">
                    <Skeleton className="h-4 w-70" />
                    <Skeleton className="h-4 w-70" />
                  </div>
                  <div className="flex gap-2 mb-2">
                    <Skeleton className="h-4 w-46" />
                    <Skeleton className="h-4 w-46" />
                    <Skeleton className="h-4 w-46" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                </>
              )}
            </p>
          </div>
        </DialogBody>

        {/* <DialogFooter className="gap-2 p-6">
          <Button variant="outline" onClick={() => event && onEdit?.(event)}>
            <PiPencilSimple className="mr-1" />
            Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => event && onDelete?.(event)}
          >
            <PiTrash className="mr-1" />
            Delete
          </Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
}
