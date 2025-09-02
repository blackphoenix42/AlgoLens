import * as Sentry from "@sentry/react";
import { onCLS, onINP, onLCP, onFCP, onTTFB } from "web-vitals";

import { track } from "./analytics";

function send(name: string, value: number, rating: string) {
  // Sentry Metrics (if available)
  // @ts-expect-error Sentry.metrics is not fully typed in @sentry/react
  if (Sentry.metrics?.distribution) {
    // @ts-expect-error distribution method is not included in Sentry.metrics type definition
    Sentry.metrics.distribution(`webvital.${name.toLowerCase()}`, value, {
      tags: { rating },
    });
  } else {
    Sentry.addBreadcrumb({
      category: "web-vital",
      message: `${name}=${value}`,
      data: { rating },
    });
  }
  // Product analytics
  track("step_advanced", { [`vital_${name}`]: Math.round(value), rating }); // or a dedicated event
}

export function initWebVitals() {
  onCLS((v) => send("CLS", v.value, v.rating));
  onINP((v) => send("INP", v.value, v.rating));
  onLCP((v) => send("LCP", v.value, v.rating));
  onFCP((v) => send("FCP", v.value, v.rating));
  onTTFB((v) => send("TTFB", v.value, v.rating));
}
