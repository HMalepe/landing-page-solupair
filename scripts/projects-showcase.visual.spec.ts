/**
 * Visual regression + layout guards for the projects showcase card.
 * Critical width: 838px (known caption/mockup overlap).
 *
 * Run: npx playwright test scripts/projects-showcase.visual.spec.ts
 */
import { expect, test, type Page } from "@playwright/test";

const WIDTHS = [640, 838, 1024, 1440] as const;

async function openProjectsCard(page: Page, width: number) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("/");
  await page.locator("#work, .projects-section").first().scrollIntoViewIfNeeded();
  const card = page.locator(".project-showcase-card").first();
  await expect(card).toBeVisible();
  return card;
}

for (const width of WIDTHS) {
  test(`projects showcase clean caption stack @ ${width}px`, async ({ page }) => {
    const card = await openProjectsCard(page, width);

    const title = card.locator(".project-showcase-title").first();
    await expect(title).toBeVisible();

    // Desktop caption overlay is sm+ only.
    if (width >= 640) {
      const overlay = card.locator(".projects-card-overlay--desktop");
      await expect(overlay).toBeVisible();

      const tag = card.locator(".projects-card-overlay__tag").first();
      await expect(tag).toBeVisible();

      const tagBox = await tag.boundingBox();
      const nextArrow = card.locator(".projects-showcase-arrow--next");
      const arrowBox = await nextArrow.boundingBox();

      expect(tagBox).toBeTruthy();
      expect(arrowBox).toBeTruthy();
      if (tagBox && arrowBox) {
        // Tag must clear the next arrow horizontally (with a small tolerance).
        expect(tagBox.x + tagBox.width).toBeLessThanOrEqual(arrowBox.x - 2);

        // Tag should sit in the lower caption band, not mid-card under the arrow.
        expect(tagBox.y).toBeGreaterThan(arrowBox.y + arrowBox.height * 0.15);
      }

      // Mockup slide must be shorter than the full card (caption band reserved).
      const slide = card.locator(".projects-embla__slide-inner").first();
      const cardBox = await card.boundingBox();
      const slideBox = await slide.boundingBox();
      expect(cardBox).toBeTruthy();
      expect(slideBox).toBeTruthy();
      if (cardBox && slideBox) {
        expect(slideBox.height).toBeLessThan(cardBox.height * 0.92);
      }
    }

    await expect(card).toHaveScreenshot(`projects-showcase-${width}.png`, {
      animations: "disabled",
      maxDiffPixelRatio: 0.045,
    });
  });
}

test("projects showcase stress @ 838px — no mockup bleed into caption", async ({ page }) => {
  const card = await openProjectsCard(page, 838);
  const overlay = card.locator(".projects-card-overlay--desktop");
  const counter = card.locator(".projects-card-overlay__counter");
  const title = card.locator(".project-showcase-title");

  await expect(overlay).toBeVisible();
  await expect(counter).toBeVisible();
  await expect(title).toBeVisible();

  // Overlay must be opaque enough that caption text contrast is not washed out.
  const overlayOpacity = await overlay.evaluate((el) => {
    const bg = getComputedStyle(el).backgroundImage;
    return bg.includes("0.98") || bg.includes("0.96") || bg.includes("rgba(0, 0, 0");
  });
  expect(overlayOpacity).toBeTruthy();

  await expect(card).toHaveScreenshot("projects-showcase-838-stress.png", {
    animations: "disabled",
    maxDiffPixelRatio: 0.04,
  });
});
