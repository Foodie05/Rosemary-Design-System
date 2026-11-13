import { useState, useRef } from "react";
import { checkRosemaryPassword } from "@rosemary-ui/tokens";
import { Icon } from "./primitives.js";
export interface FieldRequirement {
  readonly id: string;
  readonly label: string;
  readonly check: (value: string) => boolean;
}
export const passwordRequirements = (
  locale: "en" | "zh" = "en",
): readonly FieldRequirement[] => {
  const labels =
    locale === "zh"
      ? [
          "8–32 个字符",
          "仅使用英文字母、数字和英文符号，不含空格",
          "字母、数字、英文符号中至少包含两类",
        ]
      : [
          "8–32 characters",
          "Only English letters, digits and ASCII punctuation; no spaces",
          "At least two of: letters, digits, punctuation",
        ];
  return (["length", "characters", "categories"] as const).map((id, i) => ({
    id,
    label: labels[i]!,
    check: (value: string) => checkRosemaryPassword(value)[id],
  }));
};
export function useFieldValidation(
  value: string,
  requirements: readonly FieldRequirement[] = [],
) {
  const [armed, setArmed] = useState(false),
    [composing, setComposing] = useState(false);
  const hadFocus = useRef(false),
    snapshot = useRef(value);
  if (snapshot.current !== value) {
    snapshot.current = value;
    if (!value && armed) setArmed(false);
  }
  const results = requirements.map((rule) => ({
    ...rule,
    pass: armed && value && !composing ? rule.check(value) : null,
  }));
  return {
    results,
    invalid: results.some((r) => r.pass === false),
    focus: () => {
      hadFocus.current = true;
    },
    blur: () => {
      if (hadFocus.current && !composing && value) setArmed(true);
      hadFocus.current = false;
    },
    compositionStart: () => setComposing(true),
    compositionEnd: () => setComposing(false),
  };
}
export function FieldRequirements({
  id,
  results,
}: {
  id: string;
  results: readonly (FieldRequirement & { pass: boolean | null | "" })[];
}) {
  return (
    <ul
      className="rm-requirements"
      id={id}
      aria-live="polite"
      aria-atomic="true"
    >
      {results.map((r) => (
        <li
          key={r.id}
          data-result={
            r.pass === null || r.pass === ""
              ? "neutral"
              : r.pass
                ? "valid"
                : "invalid"
          }
        >
          {r.pass !== null && r.pass !== "" ? (
            <Icon
              name={r.pass ? "check" : "close"}
              size={16}
              label={r.pass ? "✓" : "✕"}
            />
          ) : (
            <span aria-hidden="true" className="rm-rule-neutral" />
          )}
          <span>{r.label}</span>
        </li>
      ))}
    </ul>
  );
}
