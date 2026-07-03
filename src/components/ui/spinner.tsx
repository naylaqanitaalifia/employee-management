import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";

interface SpinnerProps extends React.ComponentProps<"svg"> {
  text?: string;
}

function Spinner({ className, text = "Loading...", ...props }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center h-screen fixed inset-0 bg-background z-50">
      <div className="flex items-center justify-center gap-2 bg-muted/10 px-4 py-2 text-muted-foreground rounded-md border shadow-md ">
        <Loader2Icon
          data-slot="spinner"
          role="status"
          aria-label="Loading"
          className={cn("size-6 animate-spin", className)}
          {...props}
        />
        <span>{text}</span>
      </div>
    </div>
  );
}

export { Spinner };
