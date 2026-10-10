export function flatten(tree, prefix = "", result = {}) {
  for (const [key, node] of Object.entries(tree)) {
    if (key.startsWith("$")) continue;
    if (!/^[a-z0-9][a-z0-9-]*$/.test(key))
      throw Error(`Invalid token name: ${key}`);
    const path = prefix ? `${prefix}.${key}` : key;
    if ("$value" in node) {
      if (!node.$type) throw Error(`Missing $type: ${path}`);
      result[path] = node;
    } else flatten(node, path, result);
  }
  return result;
}
export function merge(a, b) {
  const result = structuredClone(a);
  for (const [k, v] of Object.entries(b))
    result[k] =
      v && typeof v === "object" && !Array.isArray(v) && !("$value" in v)
        ? merge(result[k] || {}, v)
        : structuredClone(v);
  return result;
}
export function resolve(tokens, name, chain = []) {
  if (chain.includes(name))
    throw Error(`Circular reference: ${[...chain, name].join(" → ")}`);
  const token = tokens[name];
  if (!token) throw Error(`Missing reference: ${name}`);
  const v = token.$value;
  if (typeof v === "string" && /^\{[^}]+\}$/.test(v)) {
    const target = v.slice(1, -1);
    if (tokens[target]?.$type !== token.$type)
      throw Error(`Reference type mismatch: ${name} → ${target}`);
    return resolve(tokens, target, [...chain, name]);
  }
  switch (token.$type) {
    case "color":
      if (
        v.colorSpace !== "srgb" ||
        v.components.length !== 3 ||
        v.components.some((n) => n < 0 || n > 1) ||
        v.alpha < 0 ||
        v.alpha > 1
      )
        throw Error(`Invalid color: ${name}`);
      break;
    case "dimension":
      if (!["px", "rem"].includes(v.unit) || !Number.isFinite(v.value))
        throw Error(`Invalid dimension: ${name}`);
      break;
    case "duration":
      if (!["ms", "s"].includes(v.unit) || v.value < 0)
        throw Error(`Invalid duration: ${name}`);
      break;
    case "fontFamily":
      if (!Array.isArray(v) || !v.every((s) => typeof s === "string"))
        throw Error(`Invalid font: ${name}`);
      break;
    case "cubicBezier":
      if (
        !Array.isArray(v) ||
        v.length !== 4 ||
        !v.every(Number.isFinite) ||
        v[0] < 0 ||
        v[0] > 1 ||
        v[2] < 0 ||
        v[2] > 1
      )
        throw Error(`Invalid easing: ${name}`);
      break;
    default:
      throw Error(`Unsupported type: ${token.$type}`);
  }
  return v;
}
export const cssName = (name) => `--r-${name.replaceAll(".", "-")}`;
export function cssValue(type, value) {
  if (type === "color")
    return (
      "#" +
      value.components
        .map((n) =>
          Math.round(n * 255)
            .toString(16)
            .padStart(2, "0"),
        )
        .join("")
    );
  if (["dimension", "duration"].includes(type))
    return `${value.value}${value.unit}`;
  if (type === "fontFamily")
    return value
      .map((s) => (s.includes(" ") ? JSON.stringify(s) : s))
      .join(", ");
  if (type === "cubicBezier") return `cubic-bezier(${value.join(", ")})`;
}
export function contrast(a, b) {
  const lum = (hex) =>
    [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
      .reduce((n, v, i) => n + v * [0.2126, 0.7152, 0.0722][i], 0);
  const x = lum(a),
    y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
