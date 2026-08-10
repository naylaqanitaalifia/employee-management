import { BrowserRouter } from "react-router";
import "./App.css";
import { AppRoutingSetup } from "./routing/app-routing-setup";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutingSetup />
      </BrowserRouter>
      <Toaster />
    </>
  );
}

export default App;
