# Portal surface hierarchy

The Forma portal applies one presentation layer to all 18 chapters, component previews, product cases, search, menus, dialogs, navigation and its standalone 404 page. The shared 24-role SDK theme schema and SDK version are unchanged.

## Relationships

- Siblings use alignment and spacing. Ordinary paragraphs and list items do not receive a frame each.
- Groups use `surface-group` against the page canvas. The navigation uses `surface-navigation` to clarify its separate region.
- Nested previews and code use `surface-inset` without another decorative frame or shadow.
- Detached menus, tooltips, listboxes and notifications use `surface-floating`, a soft edge and `shadow-floating`. Modal surfaces use `shadow-modal` together with focus management and background scroll locking.
- Required input boundaries, table comparison rules, state colors and focus outlines remain. Forced colors restore system boundaries where tone and shadows cannot communicate a relationship.

The aliases are defined in `surfaces.css`, loaded after chapter styles and included in the offline HTML and source ZIP. Product cases recompute aliases from their local semantic palettes; illustrative product-theme swatches retain their explicit colors. Dark elevation uses a lighter surface, quiet edge and dark shadow rather than a pale glow.

## Scroll ownership

The desktop navigation has `min-height:0` in its flex shell and contains overscroll at both boundaries. The sidebar itself is also a scroll container with containment so the brand and footer do not pass a wheel gesture to the document. Main content keeps normal document scrolling and anchor behavior. Modal dialogs lock the background through `dialog:modal`; their contents keep their own scrolling. No global wheel-event interception is used.

## Motion

Selection markers continue to travel while labels and containers stay stable. Shared floating-surface motion uses a 4px anchored displacement and opacity; drawers use their edge direction. Exit is shorter than entry. Reversals snapshot the visible frame and cancel the previous animation, and cleanup follows the actual animation completion. Closing listboxes and popovers become inert immediately. Enabling reduced motion finishes pending transitions, including their final cleanup, without creating new movement.

`tests/motion-lifecycle-check.mjs` checks interrupted exits, reversal continuity, completion, reduced-motion cleanup and disposal without relying on timing. Browser observations and verification limits are recorded in `portal-surface-review.json` and `verification.md`.
