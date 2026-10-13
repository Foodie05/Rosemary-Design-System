import type { HTMLAttributes, ImgHTMLAttributes } from "react";
export type RosemaryProduct = "forma" | "epass" | "lilt" | "vigilo" | "folio";
const marks = {
  lilt: '<rect class="rm-product-mark-bg" x="4" y="4" width="56" height="56" rx="14"/><rect class="rm-product-mark-frame" x="5" y="5" width="54" height="54" rx="13"/><path class="rm-product-mark-core" d="M15 26a4 4 0 0 1 8 0v16a4 4 0 0 1-8 0V26Zm13-8a4 4 0 0 1 8 0v28a4 4 0 0 1-8 0V18Zm13 5a4 4 0 0 1 8 0v18a4 4 0 0 1-8 0V23Z"/>',
  epass:
    '<rect class="rm-product-mark-bg" x="4" y="4" width="56" height="56" rx="14"/><rect class="rm-product-mark-frame" x="5" y="5" width="54" height="54" rx="13"/><path class="rm-product-mark-core" fill-rule="evenodd" d="M15 48V29c0-10.5 7-17 17-17s17 6.5 17 17v19H38V30c0-4.2-2.1-7-6-7s-6 2.8-6 7v18H15Z"/>',
  folio:
    '<rect class="rm-product-mark-bg" x="4" y="4" width="56" height="56" rx="14"/><rect class="rm-product-mark-frame" x="5" y="5" width="54" height="54" rx="13"/><path class="rm-product-mark-core rm-product-mark-layer" d="M22 13h19a8 8 0 0 1 8 8v23H30a8 8 0 0 1-8-8V13Z"/><path class="rm-product-mark-core" d="M15 20h19a8 8 0 0 1 8 8v23H23a8 8 0 0 1-8-8V20Z"/><path class="rm-product-mark-cutout" d="M23 29h12v5H23zm0 9h9v5h-9z"/>',
  vigilo:
    '<rect class="rm-product-mark-bg" x="4" y="4" width="56" height="56" rx="14"/><rect class="rm-product-mark-frame" x="5" y="5" width="54" height="54" rx="13"/><rect class="rm-product-mark-core" x="14" y="15" width="34" height="15" rx="5"/><rect class="rm-product-mark-core rm-product-mark-layer" x="18" y="34" width="32" height="15" rx="5"/><circle class="rm-product-mark-cutout" cx="22" cy="22.5" r="3"/><path class="rm-product-mark-cutout" d="M29 20h12v5H29z"/><circle class="rm-product-mark-cutout" cx="26" cy="41.5" r="3"/><path class="rm-product-mark-cutout" d="M33 39h10v5H33z"/>',
  forma:
    '<rect class="rm-product-mark-bg" x="4" y="4" width="56" height="56" rx="14"/><rect class="rm-product-mark-frame" x="5" y="5" width="54" height="54" rx="13"/><path class="rm-product-mark-core" d="M15 16h15v15H15V16Zm19 0h15v9H34v-9Zm0 13h15v19H34V29ZM15 35h15v13H15V35Z"/>',
} as const;
export interface BrandBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  product: RosemaryProduct;
  size?: number;
  label?: string;
}
/** Brand asset: see BRAND-ASSETS.md. Vector badges retain the approved source geometry. */
export function BrandBadge({
  product,
  size = 40,
  label,
  ...props
}: BrandBadgeProps) {
  if (!marks[product]) throw new TypeError("Unknown Rosemary product");
  return (
    <span
      {...props}
      className={["rm-brand-badge", props.className].filter(Boolean).join(" ")}
      data-product={product}
      style={{ width: size, height: size, ...props.style }}
    >
      <svg
        viewBox="0 0 64 64"
        role={label ? "img" : undefined}
        aria-label={label}
        aria-hidden={!label || undefined}
        dangerouslySetInnerHTML={{ __html: marks[product] }}
      />
    </span>
  );
}
export function RosemaryLogo(
  props: Omit<ImgHTMLAttributes<HTMLImageElement>, "src">,
) {
  return (
    <img
      {...props}
      src={new URL("./assets/rosemary-logo.png", import.meta.url).href}
      alt={props.alt ?? "Rosemary"}
      style={{ objectFit: "contain", ...props.style }}
    />
  );
}
