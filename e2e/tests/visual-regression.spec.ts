import { test, expect } from "@playwright/test";

test.use({
  viewport: { width: 1280, height: 800 },
  // Only capture failure screenshots automatically; baselines handled by toHaveScreenshot.
  screenshot: "only-on-failure",
});

test.beforeEach(async ({ page }) => {
  // Block noisy third-party requests to keep pixels stable
  await page.route(
    /(googletagmanager|google-analytics|sentry|cdn\.jsdelivr)/,
    (route) => route.abort()
  );

  // Respect reduced motion and neutralize animations in CSS if your app supports it
  await page.addStyleTag({
    content: `
      * { animation-duration: 0s !important; transition-duration: 0s !important; caret-color: transparent !important; }
    `,
  });
});

test.describe("Visualizer visual snapshots", () => {
  test("home page baseline", async ({ page }) => {
    await page.goto("http://127.0.0.1:4173/"); // vite preview default
    await page.waitForLoadState("networkidle");

    // Mask dynamic regions if needed (e.g., timestamps)
    const masks = [
      page.locator("[data-testid='clock']"),
      page.locator("[data-testid='random-seed']"),
    ];

    await expect(page).toHaveScreenshot("home.png", {
      fullPage: true,
      mask: masks,
      // Tolerate tiny AA/platform differences
      maxDiffPixelRatio: 0.01,
    });
  });

  test("visualizer with seeded dataset", async ({ page }) => {
    await page.goto(
      "http://127.0.0.1:4173/visualizer?algo=bubble&n=64&seed=42&speed=1"
    );
    await page.waitForSelector("[data-testid='canvas-ready']");

    // Take a snapshot of the initial state
    await expect(page.locator("[data-testid='array-canvas']")).toHaveScreenshot(
      "bubble-initial.png",
      {
        animations: "disabled",
        maxDiffPixelRatio: 0.01,
      }
    );

    // Advance a few steps deterministically
    await page.getByRole("button", { name: "Step" }).click();
    await page.getByRole("button", { name: "Step" }).click();
    await page.getByRole("button", { name: "Step" }).click();

    await expect(page.locator("[data-testid='array-canvas']")).toHaveScreenshot(
      "bubble-step-3.png",
      {
        animations: "disabled",
        maxDiffPixelRatio: 0.01,
      }
    );
  });
});
