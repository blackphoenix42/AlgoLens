// src/main.tsx
import {
  initSentry,
  SentryErrorBoundary,
} from "@/services/monitoring/sentry.client.config";
initSentry();

import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "@/app/router";
import "@/styles/globals.css";
import { ThemeProvider } from "@/theme/ThemeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SentryErrorBoundary fallback={<p>Something went wrong.</p>}>
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </SentryErrorBoundary>
  </React.StrictMode>
);
