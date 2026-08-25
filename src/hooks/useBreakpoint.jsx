import { useSyncExternalStore } from "react";

const QUERY_EXPANDED = "(min-width: 840px)";
const QUERY_MEDIUM = "(min-width: 600px)";

const subscribe = (callback) => {
  const expanded = window.matchMedia(QUERY_EXPANDED);
  const medium = window.matchMedia(QUERY_MEDIUM);
  expanded.addEventListener("change", callback);
  medium.addEventListener("change", callback);
  return () => {
    expanded.removeEventListener("change", callback);
    medium.removeEventListener("change", callback);
  };
};

const getSnapshot = () => {
  if (window.matchMedia(QUERY_EXPANDED).matches) return "expanded";
  if (window.matchMedia(QUERY_MEDIUM).matches) return "medium";
  return "compact";
};

const useBreakpoint = () => {
  const size = useSyncExternalStore(subscribe, getSnapshot, () => "compact");
  return {
    size,
    isCompact: size === "compact",
    isMedium: size === "medium",
    isExpanded: size === "expanded",
    isTabletUp: size !== "compact",
  };
};

export default useBreakpoint;
