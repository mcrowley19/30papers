import { Outlet, ScrollRestoration } from "react-router-dom";
import { TermPanelProvider } from "../context/TermPanelContext";
import GitHubLink from "../components/GitHubLink";
import TermPanel from "../components/TermPanel";

export default function Root() {
  return (
    <TermPanelProvider>
      <div className="min-h-screen bg-white">
        <Outlet />
      </div>
      <GitHubLink />
      <TermPanel />
      <ScrollRestoration />
    </TermPanelProvider>
  );
}
