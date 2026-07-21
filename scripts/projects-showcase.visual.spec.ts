/**
 * Visual regression anchors for the projects showcase card.
 * Run: npx playwright test scripts/projects-showcase.visual.spec.ts
 *
 * Captures the known overlap widths from QA:
 * 640 · 838 · 1024 · 1440
 */
import { expect, test } from "@playwright/test";

const WIDTHS = [640, 838, 1024, 1440] as const;

for (const width of WIDTHS) {
  test(`projects showcase clean caption stack @ ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.locator("#work, .projects-section").first().scrollIntoViewIfNeeded();
    const card = page.locator(".project-showcase-card").first();
    await expect(card).toBeVisible();

    // Caption text must sit above mockup chrome (no translucent bleed of 9px stats).
    const title = card.locator(".project-showcase-title").first();
    await expect(title).toBeVisible();

    const tag = card.locator(".projects-card-overlay__tag").first();
    if (await tag.count()) {
      const tagBox = await tag.boundingBox();
      const nextArrow = card.locator(".projects-showcase-arrow--next");
      if (tagBox && (await nextArrow.count())) {
        const arrowBox = await nextArrow.boundingBox();
        if (arrowBox) {
          expect(tagBox.x + tagBox.width).toBeLessThanOrEqual(arrowBox.x + 4);
        }
      }
    }

    await expect(card).toHaveScreenshot(`projects-showcase-${width}.png`, {
      animations: "disabled",
      maxDiffPixelRatio: 0.04,
    });
  });
}
