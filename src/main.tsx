// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";

import { initAnalytics } from "./services/analytics/analytics";
import { initWebVitals } from "./services/analytics/webvitals";

import AppRouter from "@/app/router";
import {
  initSentry,
  SentryErrorBoundary,
} from "@/services/monitoring/sentry.client.config";
import "@/styles/globals.css";
import { ThemeProvider } from "@/theme/ThemeProvider";
initSentry();
initAnalytics();
initWebVitals();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SentryErrorBoundary fallback={<p>Something went wrong.</p>}>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </SentryErrorBoundary>
  </React.StrictMode>
);
