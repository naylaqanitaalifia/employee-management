import { BrowserRouter } from "react-router";
import "./App.css";
import { AppRoutingSetup } from "./routing/app-routing-setup";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ScreenLoader } from "@/components/common/screen-loader";
import { AuthProvider } from "@/auth/auth-provider";

function App() {
  return (
    <>
      <Suspense fallback={<ScreenLoader />}>
        <AppRoutingSetup />
        <Toaster
          toastOptions={{
            classNames: {
              success: "!bg-primary !border-none",
              error: "!bg-destructive !border-none",
              info: "!bg-primary/80 !border-none",
              warning: "!bg-amber-500 !border-none",
              title: "!text-white",
              description: "!text-white/80",
              icon: "!text-white",
            },
          }}
        />
      </Suspense>
    </>
  );
}

export default App;
