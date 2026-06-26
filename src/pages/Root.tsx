import { Outlet, ScrollRestoration } from "react-router-dom";
import { TermPanelProvider } from "../context/TermPanelContext";
import TermPanel from "../components/TermPanel";

export default function Root() {
  return (
    <TermPanelProvider>
      <div className="min-h-screen bg-paper">
        <Outlet />
      </div>
      <TermPanel />
      <ScrollRestoration />
    </TermPanelProvider>
  );
}
