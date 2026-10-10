import { tokenModes, tokenNames } from "../generated/tokens";
import { DesignToken } from "../types";
export const DESIGN_TOKENS: DesignToken[] = tokenNames.map((name) => {
  const t = tokenModes.light[name];
  const category =
    t.type === "color"
      ? "color"
      : t.type === "fontFamily" || name.includes(".size.")
        ? "typography"
        : t.type === "duration" || t.type === "cubicBezier"
          ? "motion"
          : name.includes("radius")
            ? "radius"
            : "spacing";
  const id = name.replaceAll(".", "_").replaceAll("-", "_");
  return {
    name,
    value: t.value,
    darkValue: tokenModes.dark[name].value,
    category,
    subCategory: t.layer,
    description: t.reference
      ? `引用 ${t.reference}；由 tokens/*.tokens.json 生成`
      : `${t.type} 原始设计参数`,
    cssVariable: `var(--r-${name.replaceAll(".", "-")})`,
    tailwindClass: `使用 CSS 变量 --r-${name.replaceAll(".", "-")}`,
    flutterBinding: `RosemaryLightTokens.${id}`,
    swiftBinding: `RosemaryLightTokens.${id}`,
    composeBinding: `RosemaryLightTokens.${id}`,
  };
});
