import { fireEvent, screen, within } from "@testing-library/react";
export function chooseSelect(trigger: HTMLElement, label: string) {
  fireEvent.click(trigger);
  fireEvent.click(
    within(screen.getByRole("listbox")).getByRole("option", { name: label }),
  );
}
