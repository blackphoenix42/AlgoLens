// e2e/fixtures/test.ts
import { test as base, expect } from "@playwright/test";

type Fixtures = {
  /** Navigate to the app (defaults to "/"), with animations disabled & noisy requests blocked */
  gotoApp: (path?: string) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  gotoApp: async ({ page }, use) => {
    const BASE =
      process.env.PW_BASE_URL?.replace(/\/+$/, "") || "http://127.0.0.1:4173";

    // One-time route & CSS setup per test
    await page.route(
      /(googletagmanager|google-analytics|sentry|cdn\.jsdelivr|stats\.js|vitals)/,
      (route) => route.abort()
    );

    await page.addStyleTag({
      content: `
        * { animation-duration: 0ms !important; transition-duration: 0ms !important; caret-color: transparent !important; }
        html { scroll-behavior: auto !important; }
      `,
    });

    await use(async (path = "/") => {
      const url = path.startsWith("http")
        ? path
        : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
      await page.goto(url);
      await page.waitForLoadState("networkidle");
    });
  },
});

export { expect };
