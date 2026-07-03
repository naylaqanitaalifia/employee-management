import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { use, useState } from "react";
import { PiPencil, PiPlusBold, PiTrash } from "react-icons/pi";
import { AddDialog } from "./blocks/add-dialog";
import { EditDialog } from "./blocks/edit-dialog";
import { DeleteDialog } from "./blocks/delete-dialog";
import { useQuery } from "@tanstack/react-query";
import { apiConfig } from "@/config/api.config";
import axios from "axios";

export function Page() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const {
    data: employees = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/employees`);
      return data.data;
    },
  });

  return (
    <div className="p-4 space-y-6 bg-background min-h-screen">
      {/* Header Halaman */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Employee
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
          Add Employee
        </Button>

        <AddDialog open={isSheetOpen} onOpenChange={setIsSheetOpen} />
      </div>

      {/* Wrapper Tabel (Card Style) */}
      <div className="rounded-xl border border-muted-foreground/20 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            {/* Table Header */}
            <thead className="bg-muted/40 border-b border-muted-foreground/20 text-muted-foreground font-medium text-xs uppercase tracking-wider select-none">
              <tr>
                <th className="px-6 py-3.5 font-semibold">Name</th>
                <th className="px-6 py-3.5 font-semibold">Email</th>
                <th className="px-6 py-3.5 font-semibold">Phone</th>
                <th className="px-6 py-3.5 font-semibold text-center">
                  Department
                </th>
                <th className="px-6 py-3.5 font-semibold">Position</th>
                <th className="px-6 py-3.5 font-semibold text-center">
                  Status
                </th>
                <th className="px-6 py-3.5 font-semibold text-center">
                  Action
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-muted-foreground/20 text-foreground">
              {employees === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-4 text-center text-muted-foreground"
                  >
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-muted/40 transition-colors duration-150 group"
                  >
                    {/* <td className="px-6 py-4 flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                      <img
                        src={employee.image}
                        alt="Profile"
                        className="size-8 rounded-full"
                      />
                      <span>{employee.name}</span>
                    </td> */}
                    <td className="px-6 py-4 text-muted-foreground group-hover:text-foreground">
                      {employee.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground group-hover:text-foreground">
                      {employee.email}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {employee.phone}
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground">
                      {employee.department?.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {employee.position?.name}
                    </td>
                    <td className="px-6 py-4 text-center text-muted-foreground whitespace-nowrap">
                      {employee.status === "active" ? (
                        <Badge
                          variant="success"
                          appearance="light"
                          className="rounded-full"
                        >
                          {employee.status}
                        </Badge>
                      ) : (
                        <Badge
                          variant="destructive"
                          appearance="light"
                          className="rounded-full"
                        >
                          {employee.status}
                        </Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 flex items-center gap-1 text-muted-foreground">
                      <button className="p-2 text-muted-foreground cursor-pointer hover:bg-muted-foreground/10 rounded-md">
                        <PiPencil
                          size={18}
                          onClick={() => setEditDialogOpen(true)}
                        />
                        <EditDialog
                          open={editDialogOpen}
                          onOpenChange={setEditDialogOpen}
                        />
                      </button>
                      <button className="p-2 text-red-500 cursor-pointer hover:bg-red-500/10 rounded-md">
                        <PiTrash
                          size={18}
                          onClick={() => setDeleteDialogOpen(true)}
                        />
                        <DeleteDialog
                          open={deleteDialogOpen}
                          onOpenChange={setDeleteDialogOpen}
                        />
                      </button>
                    </td>
                    {/* Salary Aligned Right untuk kerapian data angka */}
                    {/* <td className="px-6 py-4 text-right font-medium text-foreground tabular-nums">
                    {employee.salary}
                  </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
