// src/services/monitoring/sentry.client.config.ts
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/react";
import { Replay } from "@sentry/replay";

/**
 * Call initSentry() once, as early as possible in app startup (e.g., in main.tsx).
 * Env vars:
 *  - VITE_SENTRY_DSN: Sentry DSN
 *  - VITE_APP_VERSION: app version for release tagging (optional)
 *  - import.meta.env.MODE used as environment ("development"/"production")
 */
export function initSentry() {
  // Avoid noisy events during local development.
  if (import.meta.env.MODE === "development") return;

  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  Sentry.init({
    dsn,
    release:
      (import.meta.env.VITE_APP_VERSION as string | undefined) ?? undefined,
    environment: import.meta.env.MODE,
    integrations: [
      new BrowserTracing({
        // Adjust endpoints you want to trace; default traces XHR/fetch + navigation.
        tracePropagationTargets: [/.*/],
      }),
      // Lightweight session replay; tune sampling as needed.
      new Replay({
        maskAllInputs: true,
        blockAllMedia: true,
      }),
    ],
    // Sampling: keep low unless you really need more data.
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

/** Optional error boundary you can wrap your App with */
export const SentryErrorBoundary = Sentry.ErrorBoundary;
