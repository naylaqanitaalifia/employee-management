import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  Check,
  Eye,
  EyeOff,
  LoaderCircleIcon,
} from "lucide-react";
import { useForm } from "react-hook-form";
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
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
import { useNavigate } from "react-router";
// import { resolvePostLoginPath } from '@/auth/require-auth';
// import { useAuth } from '../context/auth-context';
// import { getSigninSchema, SigninSchemaType } from '../forms/signin-schema';

const formSchema = z.object({
  email: z.string().trim().min(1, { message: "Email is required." }),
  password: z.string().trim().min(1, { message: "Password is required." }),
});

type SchemaType = z.infer<typeof formSchema>;

export function LoginPage() {
  //   const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(false);

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Check for success message from password reset or error messages
  //   useEffect(() => {
  //     const pwdReset = searchParams.get('pwd_reset');
  //     const errorParam = searchParams.get('error');
  //     const errorDescription = searchParams.get('error_description');

  //     if (pwdReset === 'success') {
  //       setSuccessMessage(
  //         'Your password has been successfully reset. You can now sign in with your new password.',
  //       );
  //     }

  //     if (errorParam) {
  //       switch (errorParam) {
  //         case 'auth_callback_failed':
  //           setError(
  //             errorDescription || 'Authentication failed. Please try again.',
  //           );
  //           break;
  //         case 'auth_callback_error':
  //           setError(
  //             errorDescription ||
  //             'An error occurred during authentication. Please try again.',
  //           );
  //           break;
  //         case 'auth_token_error':
  //           setError(
  //             errorDescription ||
  //             'Failed to set authentication session. Please try again.',
  //           );
  //           break;
  //         default:
  //           setError(
  //             errorDescription || 'Authentication error. Please try again.',
  //           );
  //           break;
  //       }
  //     }
  //   }, [searchParams]);

  //   useEffect(() => {
  //     if (!redirectAfterLogin || accessibleMenus.loading) return;
  //     if (accessibleMenus.menus.length === 0) return;

  //     const targetPath = resolvePostLoginPath(
  //       accessibleMenus.menus,
  //       isAdmin,
  //       auth?.default_page,
  //     );
  //     setRedirectAfterLogin(false);
  //     navigate(targetPath, { replace: true });
  //   }, [
  //     redirectAfterLogin,
  //     accessibleMenus.loading,
  //     accessibleMenus.menus,
  //     isAdmin,
  //     auth?.default_page,
  //     navigate,
  //   ]);

  //   async function onSubmit(values: SigninSchemaType) {
  //     try {
  //       setIsProcessing(true);
  //       setError(null);

  //       // console.log('Attempting to sign in with username:', values.username);

  //       // Simple validation
  //       if (!values.username.trim() || !values.password) {
  //         setError('Username and password must be filled');
  //         return;
  //       }

  //       await login(values.username, values.password);
  //       setRedirectAfterLogin(true);

  //     } catch (err) {
  //       console.error('Unexpected sign-in error:', err);
  //       setError(
  //         err instanceof AxiosError
  //           ? err.response?.data?.error ?? err.response?.data?.message
  //           : 'An unexpected error occurred. Please try again.',
  //       );
  //     } finally {
  //       setIsProcessing(false);
  //     }
  //   }

  const onSubmit = async (values: SchemaType) => {
    try {
      setIsProcessing(true);
      await login(values.email, values.password);
    } catch (error) {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full h-full flex items-center">
        <div className="w-2/3 h-full max-h-[800px] overflow-hidden rounded-xl">
          <img
            src={toAbsoluteUrl("/images/signin.png")}
            alt="Employees working together"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-1/3 max-w-md mx-auto flex flex-col gap-12 p-12">
          <div className="flex flex-col gap-3 text-center">
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
              {/* {error && (
          <Alert
            variant="destructive"
            appearance="light"
            onClose={() => setError(null)}
          >
            <AlertIcon>
              <AlertCircle />
            </AlertIcon>
            <AlertTitle>{error}</AlertTitle>
          </Alert>
        )} */}

              {/* {successMessage && (
          <Alert appearance="light" onClose={() => setSuccessMessage(null)}>
            <AlertIcon>
              <Check />
            </AlertIcon>
            <AlertTitle>{successMessage}</AlertTitle>
          </Alert>
        )} */}

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-black/90 drop-shadow-sm font-semibold">
                      Email
                    </FormLabel>

                    <FormControl>
                      <Input placeholder="Enter email" {...field} />
                    </FormControl>

                    <FormMessage className="text-red-200" />
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
                        // className={`bg-white/80 border-white/30 text-slate-900 placeholder:text-slate-500 ${
                        //   form.formState.errors.password
                        //     ? "border-red-400"
                        //     : ""
                        // }`}
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

                    <FormMessage className="text-red-200" />
                  </FormItem>
                )}
              />

              {/* <FormField
          control={form.control}
          name="rememberMe"
          render={() => (
            <FormItem className="flex flex-col space-y-2">
              <div className="flex items-center justify-end">
                <Link
                  to="/auth/reset-password"
                  className="text-sm font-semibold text-foreground hover:text-primary"
                >
                  Forgot Password?
                </Link>
              </div>
            </FormItem>
          )}
        /> */}

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
