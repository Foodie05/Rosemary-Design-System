# Quiet controls and navigation surfaces

Reviewed 2026-11-12. This is a portal presentation decision, not a change to the 24-role SDK theme contract or a claim of complete accessibility conformance.

## Evidence and limits

- [W3C, Understanding SC 1.4.11](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html) distinguishes required visual cues from optional hit-area outlines. A complete frame is not universally required. Its minimal text-input example uses a bottom border; the necessary indicator must contrast at least 3:1 against adjacent colors. A borderless text input relying only on fill needs that fill to meet the contrast requirement. Dropdown arrows and selection/focus indicators are also meaningful cues. Consequently, a barely tinted borderless text editor is not an adequate general replacement.
- [Google Material Web, Text field](https://material-web.dev/components/text-field/) provides both filled and outlined fields, plus labels, supporting text, errors and counters. [Material's text-field guidance](https://m2.material.io/design/components/text-fields.html) explicitly says filled fields can have more visual emphasis. Filled is an available construction, not evidence that it is always quieter or more usable. Rosemary therefore uses a modest neutral fill, external labels and a restrained baseline, rather than importing the entire Material appearance.
- [Microsoft Fluent 2, Input](https://fluent2.microsoft.design/components/web/react/core/input/usage) recommends persistent labels, keeps essential instructions outside placeholders and fits field width to expected content. Those requirements remain when visual framing is reduced.
- [Kate Moran / NN/g, Flat UI Elements Attract Less Attention and Cause Uncertainty, 2017](https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/) reports an eye-tracking experiment with 71 participants and nine page pairs. Weaker interactive signifiers increased effort in targeted findability tasks. This is not a field-style comparison or proof that all flat controls are worse. It supports retaining explicit labels, recognizable arrows, hover feedback and visible keyboard focus while removing ornamental frames.

## Rosemary decision

1. Text editors use a gentle neutral fill and a single accessible neutral baseline. Top and side borders are transparent; geometry stays constant during state changes.
2. Comboboxes and secondary actions use a tonal fill with recognizable labels/icons, without a complete perimeter at rest or hover. Expanded state changes fill and arrow direction. Primary and destructive actions keep their solid semantic colors.
3. Hover is local and brief. Focus uses the existing independent keyboard outline; an active text baseline can strengthen without moving layout. Errors retain persistent explanations and semantic state, using an error baseline/fill as a supplementary cue. Read-only and disabled fields stay distinct.
4. Small checkbox/radio boundaries remain necessary state cues, neutralized rather than removed. Forced colors restores system boundaries. Shadows are reserved for detached surfaces.
5. Both side and top navigation are darker than the local main canvas in light and dark themes. Each product case recomputes the mapping from its own palette. Navigation is a supporting backdrop; reading and editing surfaces receive the lighter surface.

The actual changes live in the last-loaded `surfaces.css`, component descriptions, layout guidance and brand guide. Measurements and checks are recorded separately; no usability study of Rosemary is claimed.
