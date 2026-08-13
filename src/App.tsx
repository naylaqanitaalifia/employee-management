import { BrowserRouter } from "react-router";
import "./App.css";
import { AppRoutingSetup } from "./routing/app-routing-setup";
import { Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ScreenLoader } from "@/components/common/screen-loader";

function App() {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<ScreenLoader />}>
          <AppRoutingSetup />
        </Suspense>
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
