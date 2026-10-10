// Compatibility adapter. Implementations live in independent component families.
import { COMPONENT_IMPLEMENTATIONS } from "../playground/registry";
export const InteractiveComponentsCatalog = Object.fromEntries(
  Object.entries(COMPONENT_IMPLEMENTATIONS).map(([id, implementation]) => [
    id,
    implementation.Preview,
  ]),
);
