import { useLandingStatic } from "../context/LandingMotionContext";
import { usePrefersReducedMotion } from "./useInView";

/** System reduced-motion preference or the landing-page static toggle. */
export function useMotionReduced() {
  const landingStatic = useLandingStatic();
  const systemReduced = usePrefersReducedMotion();
  return landingStatic || systemReduced;
}
