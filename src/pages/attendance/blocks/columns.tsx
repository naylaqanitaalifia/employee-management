import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import profile from "@/assets/images/profile.jpeg";
import { Badge } from "@/components/ui/badge";

export type Attendance = {
  id: string;
  name: string;
  created_at: string;
  department: {
    id: string;
    name: string;
  };
  position: {
    id: string;
    name: string;
  };
};

export const getColumns = (
  onEdit: (attendance: any) => void,
  onDelete: (attendance: any) => void,
): ColumnDef<any>[] => [
  {
    accessorKey: "date",
    header: "Date",
    size: 100,
  },
  {
    accessorKey: "name",
    header: "Fullname",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <img
            src={profile}
            alt="Profile Image"
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-black">
              {row.original.name}
            </span>
            <span className="text-xs font-light text-muted-foreground">
              {row.original.department}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "clock_in",
    header: "Clock In",
  },
  {
    accessorKey: "clock_out",
    header: "Clock Out",
  },
  {
    accessorKey: "total_hours",
    header: "Work Hours",
  },
  {
    accessorKey: "status",
    header: () => <div className="text center">Status</div>,
    cell: ({ row }) => {
      const status = row.original.status;
      const getStatusVariant = (status: string) => {
        switch (status) {
          case "present":
            return "success";
          case "late":
            return "warning";
          case "absent":
            return "destructive";
          default:
            return "success";
        }
      };
      return (
        <Badge
          variant={getStatusVariant(row.original.status ?? "") as any}
          size="sm"
          appearance="light"
          className="rounded-full uppercase"
        >
          {status}
        </Badge>
      );
    },
  },
  // {
  //   id: "actions",
  //   header: () => <div className="text-center">Actions</div>,
  //   size: 150,
  //   cell: ({ row }) => {
  //     const department = row.original;
  //     return (
  //       <div className="flex items-center justify-center">
  //         <Button variant="ghost" onClick={() => onEdit(department)}>
  //           <PiPencil size={18} />
  //         </Button>
  //         <Button
  //           variant="ghost"
  //           className="text-red-500 cursor-pointer hover:bg-red-500/10 hover:text-red-500 rounded-md"
  //           onClick={() => onDelete(department)}
  //         >
  //           <PiTrash size={18} />
  //         </Button>
  //       </div>
  //     );
  //   },
  // },
];
