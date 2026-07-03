import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { PiPencil, PiPlusBold, PiTrash } from "react-icons/pi";
import { AddDialog } from "./blocks/add-dialog";
import { EditDialog } from "./blocks/edit-dialog";
import { DeleteDialog } from "./blocks/delete-dialog";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { apiConfig } from "@/config/api.config";
import { Spinner } from "@/components/ui/spinner";

export interface Department {
  id: string;
  name: string;
}

export function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] =
    useState<Department | null>(null);

  const {
    data: departments = [],
    isLoading,
    isError,
  } = useQuery<Department[]>({
    queryKey: ["departments"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/departments`);

      return data.data;
    },
  });

  if (isLoading) {
    return <Spinner></Spinner>;
  }

  if (isError) {
    return <div className="">Failed to load departments.</div>;
  }

  return (
    <div className="p-4 space-y-6 bg-background min-h-screen">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Departments
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your organization members and their roles.
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="">
          <Input type="text" placeholder="Search..." />
        </div>
        <Button
          variant="default"
          type="button"
          onClick={() => setIsSheetOpen(true)}
        >
          <PiPlusBold />
          Add Department
        </Button>

        <AddDialog open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      </div>

      <div className="rounded-xl border border-muted-foreground/20 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            {/* Table Header */}
            <thead className="bg-muted/40 border-b border-muted-foreground/20 text-muted-foreground font-medium text-xs uppercase tracking-wider select-none">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Name</th>
                <th className="px-6 py-3.5 font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-muted-foreground/20 text-foreground">
              {departments.length === 0 ? (
                <tr>
                  <td
                    colSpan={2}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No departments found.
                  </td>
                </tr>
              ) : (
                departments.map((department) => (
                  <tr
                    key={department.id}
                    className="hover:bg-muted/40 transition-colors duration-150 group"
                  >
                    <td className="px-6 py-3 text-muted-foreground group-hover:text-foreground">
                      {department.name}
                    </td>
                    <td className="px-6 py-3 flex items-center justify-center gap-1 text-muted-foreground">
                      <Button
                        variant="ghost"
                        // className="p-2 text-muted-foreground cursor-pointer hover:bg-muted-foreground/10 rounded-md"
                        onClick={() => {
                          setSelectedDepartment(department);
                          setEditDialogOpen(true);
                        }}
                      >
                        <PiPencil size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-500 cursor-pointer hover:bg-red-500/10 hover:text-red-500 rounded-md"
                        onClick={() => {
                          setSelectedDepartment(department);
                          setDeleteDialogOpen(true);
                        }}
                      >
                        <PiTrash size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* EDIT DIALOG */}
          <EditDialog
            open={editDialogOpen}
            onOpenChange={setEditDialogOpen}
            department={selectedDepartment}
          />

          {/* DELETE DIALOG */}
          <DeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            department={selectedDepartment}
          />
        </div>
      </div>
    </div>
  );
}
