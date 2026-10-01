import { ContentLoader } from "@/components/common/content-loader";
import { useAuth } from "@/auth/auth-context";
import { Card } from "@/components/ui/card";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiConfig } from "@/config/api.config";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { capitalize, formatDate } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import {
  PiBuildingOfficeBold,
  PiCakeBold,
  PiCalendarBold,
  PiCameraBold,
  PiEnvelopeSimpleBold,
  PiFileTextBold,
  PiIdentificationBadgeBold,
  PiMapPinBold,
  PiPencil,
  PiPhoneBold,
} from "react-icons/pi";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState } from "react";
import { EditDialog } from "./blocks/edit-dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "on_leave":
      return "warning";
    case "resigned":
      return "destructive";
    case "terminated":
      return "destructive";
    default:
      break;
  }
};

const formSchema = z.object({
  current_password: z
    .string()
    .trim()
    .min(1, { message: "Current password is required." }),
  new_password: z
    .string()
    .trim()
    .min(1, { message: "New password is required." }),
  confirm_password: z
    .string()
    .trim()
    .min(1, { message: "Confirm password is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

export function Page() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  // const { data: employee, isLoading } = useQuery({
  //   queryKey: ["profile", user?.employee_id],
  //   queryFn: async () => {
  //     const { data } = await axios.get(
  //       `${apiConfig.API_URL}/employees/${user?.employee_id}`,
  //     );

  //     return data.data;
  //   },
  //   enabled: !!user?.employee_id,
  // });

  const { data: employee, isLoading } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axios.get(`${apiConfig.API_URL}/profile`);

      return data.data;
    },
    enabled: !!user,
  });

  function handleEdit() {
    setEditDialogOpen(true);
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedPhoto(file);
    setPreviewPhoto(URL.createObjectURL(file));

    uploadPhoto.mutate(file);
  }

  const uploadPhoto = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();

      formData.append("photo", file);

      const { data } = await axios.patch(
        `${apiConfig.API_URL}/profile/photo`,
        formData,
      );

      return data;
    },

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      setSelectedPhoto(null);

      toast.success("Photo updated successfully");
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "An unexpected error";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const API_BASE_URL = apiConfig.API_URL.replace(/\/api\/?$/, "");

  const photoUrl = employee?.photo
    ? `${API_BASE_URL}${employee.photo}`
    : "/images/photo-profile.png";

  const updatePassword = useMutation({
    mutationFn: async (values: SchemaType) => {
      await axios.patch(`${apiConfig.API_URL}/auth/update-password`, values);
    },

    onSuccess: async () => {
      toast.success("Password updated successfully");
      form.reset();
    },

    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "An unexpected error";
        toast.error(message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const onSubmit = (values: SchemaType) => {
    updatePassword.mutate(values);
  };

  if (isLoading) {
    return <ContentLoader />;
  }

  return (
    <div className="p-4 space-y-6 bg-background h-full">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your profile settings
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between px-6 py-2">
          <div className="flex items-center gap-4">
            <div className="relative size-18">
              <img
                src={previewPhoto || photoUrl}
                alt={employee?.name}
                className="size-18 rounded-full object-cover"
              />

              <Label
                htmlFor="profile-photo"
                className="absolute bottom-0 right-0 flex size-6 cursor-pointer items-center justify-center rounded-full border border-background bg-primary text-white shadow-sm hover:bg-primary/90"
              >
                <PiCameraBold className="size-4" />
              </Label>
              <Input
                id="profile-photo"
                type="file"
                accept="image/jpeg, image/jpg, image/png, image/webp"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="flex gap-2">
                <h4 className="font-semibold">{employee?.name}</h4>
                <Badge
                  variant={getStatusVariant(employee?.status)}
                  size="sm"
                  appearance="light"
                  className="w-fit rounded-full"
                >
                  {capitalize(employee?.status ?? "-")}
                </Badge>
              </div>
              <span className="text-sm text-muted-foreground">
                {employee?.position?.name} • {employee?.department?.name}
              </span>
            </div>
          </div>
          <Button variant="outline" onClick={handleEdit}>
            <PiPencil className="text-black" />
            Edit Profile
          </Button>
        </div>
      </Card>

      <Tabs defaultValue="personal-information">
        <TabsList variant="line">
          <TabsTrigger value="personal-information">
            Personal Information
          </TabsTrigger>
          <TabsTrigger value="employment">Employment</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal-information">
          <div className="grid grid-cols-2 gap-6 pt-3 px-2">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiEnvelopeSimpleBold />
                <span className="text-sm">Email</span>
              </div>
              <p className="text-sm">{employee?.email ?? "-"}</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiPhoneBold />
                <span className="text-sm">Phone</span>
              </div>
              <p className="text-sm">{employee?.phone ?? "-"}</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiCakeBold />
                <span className="text-sm">Date of birth</span>
              </div>
              <p className="text-sm">
                {formatDate(employee?.birth_date) ?? "-"}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiMapPinBold />
                <span className="text-sm">Address</span>
              </div>
              <p className="text-sm">{employee?.address ?? "-"}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="employment">
          <div className="grid grid-cols-2 gap-6 pt-3 px-2">
            {/* <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiEnvelopeSimpleBold />
                <span className="text-sm">Employee ID</span>
              </div>
              <p className="text-sm">{employee?.email ?? "-"}</p>
            </div> */}

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiCalendarBold />
                <span className="text-sm">Join Date</span>
              </div>
              <p className="text-sm">{employee?.phone ?? "-"}</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiBuildingOfficeBold />
                <span className="text-sm">Department</span>
              </div>
              <p className="text-sm">{employee?.department?.name ?? "-"}</p>
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiIdentificationBadgeBold />
                <span className="text-sm">Position</span>
              </div>
              <p className="text-sm">{employee?.position?.name ?? "-"}</p>
            </div>

            {/* <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiFileTextBold />
                <span className="text-sm">Reporting Manager</span>
              </div>
              <p className="text-sm">{employee?.position?.name ?? "-"}</p>
            </div> */}

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <PiFileTextBold />
                <span className="text-sm">Employment Type</span>
              </div>
              <p className="text-sm">{employee?.contract_type ?? "-"}</p>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter current password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="new_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter new password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirm_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter confirm password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-3 mt-8">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-34"
                  disabled={updatePassword.isPending}
                >
                  {updatePassword.isPending ? "Saving..." : "Update Password"}
                </Button>
              </div>
            </form>
          </Form>
        </TabsContent>
      </Tabs>

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        employee={employee}
      />
    </div>
  );
}
