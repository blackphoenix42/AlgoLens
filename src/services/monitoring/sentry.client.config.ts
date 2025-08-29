// src/services/monitoring/sentry.client.config.ts
import * as Sentry from "@sentry/react";
import React from "react";
import {
  createRoutesFromChildren,
  matchRoutes,
  useLocation,
  useNavigationType,
} from "react-router-dom";

/**
 * Call initSentry() once, as early as possible in app startup (e.g., in main.tsx).
 * Env vars:
 *  - VITE_SENTRY_DSN: Sentry DSN
 *  - VITE_APP_VERSION: app version for release tagging (optional)
 *  - import.meta.env.MODE used as environment ("development"/"production")
 */
export function initSentry() {
  if (import.meta.env.MODE === "development") return;

  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
  if (!dsn) return;

  Sentry.init({
    dsn,
    release:
      (import.meta.env.VITE_APP_VERSION as string | undefined) ?? undefined,
    environment: import.meta.env.MODE,

    integrations: [
      Sentry.reactRouterV6BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration({ maskAllInputs: true, blockAllMedia: true }),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export const SentryErrorBoundary = Sentry.ErrorBoundary;
