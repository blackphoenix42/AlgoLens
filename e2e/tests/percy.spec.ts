import { test } from "@playwright/test";
import percySnapshot from "@percy/playwright";

test("Home snapshot", async ({ page }) => {
  await page.goto("http://127.0.0.1:4173/");
  await percySnapshot(page, "Home");
});
