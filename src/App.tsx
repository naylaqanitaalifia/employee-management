import { BrowserRouter } from "react-router";
import "./App.css";
import { AppRoutingSetup } from "./routing/app-routing-setup";

function App() {
  return (
    <>
      <BrowserRouter>
        <AppRoutingSetup />
      </BrowserRouter>
    </>
  );
}

export default App;
