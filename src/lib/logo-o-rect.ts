/**
 * Where the smiley "O" sits inside solupair-wordmark.png, in the image's own
 * natural pixel space (measured directly off the asset). Padded a few px
 * past the circle's true edge so a mask fully covers its anti-aliased fringe.
 */
export const WORDMARK_NATURAL_WIDTH = 1448;
export const WORDMARK_NATURAL_HEIGHT = 176;
const WORDMARK_O_BOUNDS = { x0: 183, x1: 372, y0: 0, y1: 176 } as const;

export type Rect = { left: number; top: number; width: number; height: number };

/**
 * The "O"'s on-screen rect relative to `imgBox` (the wordmark <img>'s own
 * rendered box), replicating `object-fit: contain; object-position: left
 * center` — the actual styling on that <img> — so this stays correct across
 * every breakpoint's max-width clamp without hardcoding per-breakpoint values.
 */
export function computeWordmarkORect(imgBox: Rect): Rect {
  const scale = Math.min(
    imgBox.width / WORDMARK_NATURAL_WIDTH,
    imgBox.height / WORDMARK_NATURAL_HEIGHT,
  );
  const renderedHeight = WORDMARK_NATURAL_HEIGHT * scale;
  const renderedTop = imgBox.top + (imgBox.height - renderedHeight) / 2;

  return {
    left: imgBox.left + WORDMARK_O_BOUNDS.x0 * scale,
    top: renderedTop + WORDMARK_O_BOUNDS.y0 * scale,
    width: (WORDMARK_O_BOUNDS.x1 - WORDMARK_O_BOUNDS.x0) * scale,
    height: (WORDMARK_O_BOUNDS.y1 - WORDMARK_O_BOUNDS.y0) * scale,
  };
}
