// e2e/tests/home-spec.ts
import { S } from "../fixtures/selectors";
import { test, expect } from "../fixtures/test";

test.use({
  viewport: { width: 1280, height: 800 },
  screenshot: "only-on-failure",
});

test.describe("Home", () => {
  test("renders and links to Visualizer", async ({ page, gotoApp }) => {
    await gotoApp("/");

    // Title is permissive to avoid brittleness
    await expect(page).toHaveTitle(/algo|lens/i);

    const main = page.getByRole("main").first();
    await expect(main).toBeVisible();

    const vizLink = page.locator(S.toVisualizer).first();
    await expect(vizLink).toBeVisible();

    // Baseline screenshot (stored under __screenshots__)
    await expect(page).toHaveScreenshot("home.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });
});

test.describe("Visualizer", () => {
  test("loads with seeded dataset and shows a canvas", async ({
    page,
    gotoApp,
  }) => {
    // Bubble as a safe default; adjust algo param if yours differs
    await gotoApp("/visualizer?algo=bubble&n=64&seed=42&speed=1");

    const canvas = page.locator(S.canvas).first();
    await expect(canvas).toBeVisible();

    // Optional: try to step if a button exists (won't fail if missing)
    const stepBtn = page.locator(S.step).first();
    if (await stepBtn.isVisible().catch(() => false)) {
      await stepBtn.click();
      await stepBtn.click();
    }

    await expect(canvas).toHaveScreenshot("visualizer-initial.png", {
      animations: "disabled",
      maxDiffPixelRatio: 0.01,
    });
  });
});
