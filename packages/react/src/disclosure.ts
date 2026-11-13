import { rosemaryDisclosure } from "@rosemary-ui/tokens";

/** Same rounded 41-point spring curve as the portal's CSS linear() easing. */
export function disclosureEasing(open: boolean) {
  const points = open
    ? rosemaryDisclosure.disclosureEnter
    : rosemaryDisclosure.disclosureExit;
  const easing = `linear(${points.join(",")})`;
  return typeof CSS !== "undefined" &&
    CSS.supports("animation-timing-function", easing)
    ? easing
    : "cubic-bezier(.2,.7,.2,1)";
}
