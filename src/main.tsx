import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "@/App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip.tsx";
import { SidebarProvider } from "@/components/ui/sidebar.tsx";
import { AuthProvider } from "@/auth/auth-provider.tsx";
import { BrowserRouter } from "react-router";
import { setupAxios } from "@/lib/api.ts";
import axios from "axios";

const queryClient = new QueryClient();

setupAxios(axios);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <BrowserRouter>
            <AuthProvider>
              <App />
            </AuthProvider>
          </BrowserRouter>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </StrictMode>,
);
