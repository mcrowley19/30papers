import { Outlet, ScrollRestoration } from "react-router-dom";
import { TermPanelProvider } from "../context/TermPanelContext";
import { LandingMotionProvider } from "../context/LandingMotionContext";
import GitHubLink from "../components/GitHubLink";
import TermPanel from "../components/TermPanel";

export default function Root() {
  return (
    <TermPanelProvider>
      <LandingMotionProvider>
        <div className="min-h-screen bg-white">
          <Outlet />
        </div>
        <GitHubLink />
        <TermPanel />
        <ScrollRestoration />
      </LandingMotionProvider>
    </TermPanelProvider>
  );
}
