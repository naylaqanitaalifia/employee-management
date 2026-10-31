import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Eye, EyeOff, LoaderCircleIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toAbsoluteUrl } from "@/lib/helpers";
import { useAuth } from "@/auth/auth-context";

const formSchema = z.object({
  email: z.string().trim().min(1, { message: "Email is required." }),
  password: z.string().trim().min(1, { message: "Password is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

export function LoginPage() {
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SchemaType) => {
    setIsProcessing(true);

    try {
      await login(values.email, values.password);
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full h-full flex items-center">
        <div className="w-2/3 h-full max-h-[800px] overflow-hidden rounded-xl">
          <img
            src={toAbsoluteUrl("/images/signin.jpg")}
            alt="Employees working together"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-1/3 max-w-md mx-auto flex flex-col gap-12 p-12">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold">Sign In Account</h1>
            <span className="text-sm text-muted-foreground">
              Enter your personal data to sign in to your account.
            </span>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="block w-full space-y-5"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black/90 drop-shadow-sm font-semibold">
                      Email
                    </FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter email"
                        type="email"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center gap-2.5">
                      <FormLabel className="text-black/90 drop-shadow-sm">
                        Password
                      </FormLabel>
                    </div>

                    <div className="relative">
                      <Input
                        placeholder="Your password"
                        type={passwordVisible ? "text" : "password"}
                        {...field}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        mode="icon"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      >
                        {passwordVisible ? (
                          <EyeOff className="text-slate-500" />
                        ) : (
                          <Eye className="text-slate-500" />
                        )}
                      </Button>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full rounded-full"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircleIcon className="h-4 w-4 animate-spin" />{" "}
                    Loading...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
              {/* <div className="flex justify-end">
                <Link
                  to="/auth/forgot-password"
                  className="text-sm text-muted-foreground hover:underline transition-colors"
                >
                  Forgot Password
                </Link>
              </div> */}
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
