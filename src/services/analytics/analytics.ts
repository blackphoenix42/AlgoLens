import posthog from "posthog-js";

type EventName =
  | "algo_selected"
  | "run_clicked"
  | "step_advanced"
  | "dataset_generated"
  | "export_image"
  | "share_clicked"
  | "error_runtime";

type EventProps = Record<string, string | number | boolean | null | undefined>;

let enabled = false;

export function initAnalytics() {
  const key = import.meta.env.VITE_POSTHOG_KEY;
  if (!key) return;
  posthog.init(key, {
    api_host: import.meta.env.VITE_POSTHOG_HOST || "https://app.posthog.com",
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: true,
    persistence: "localStorage+cookie",
  });
  enabled = true;
}

export function identify(id: string, props?: Record<string, unknown>) {
  if (!enabled) return;
  posthog.identify(id, props);
}

export function track(name: EventName, props?: EventProps) {
  if (!enabled) return;
  posthog.capture(name, props);
}

export function pageview(path?: string) {
  if (!enabled) return;
  posthog.capture("$pageview", path ? { $current_url: path } : undefined);
}
