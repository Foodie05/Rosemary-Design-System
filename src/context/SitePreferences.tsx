import { createContext, useContext } from "react";
export type ThemePreference = "system" | "light" | "dark";
export const SitePreferences = createContext({
  mode: "light" as "light" | "dark",
  isMac: false,
});
export const useSitePreferences = () => useContext(SitePreferences);
export function platformIsMac() {
  return (
    typeof navigator !== "undefined" &&
    /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent)
  );
}
