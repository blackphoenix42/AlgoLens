#!/usr/bin/env node
// Node 18+ ESM. Optional Playwright integration.
import { PerformanceObserver, performance } from "node:perf_hooks";
import { promises as fs } from "node:fs";
const now = (globalThis.performance ?? performance).now();

const args = parseArgs(process.argv.slice(2));
const url = args.url || process.env.PW_BASE_URL || "http://127.0.0.1:4173/";
const out = args.out || "analysis/perf.json";
const tries = Number(args.tries || 3);

let usePlaywright = false;
try { require.resolve("playwright"); usePlaywright = true; } catch { /* noop: warm-up errors can be ignored */ }

const runs = [];
for (let i = 0; i < tries; i++) {
    if (usePlaywright) runs.push(await measureWithPlaywright(url));
    else runs.push(await measureWithFetch(url));
}

const summary = {
    url,
    tries,
    timestamp: new Date().toISOString(),
    metrics: aggregate(runs),
    runs
};

await fs.mkdir("analysis", { recursive: true });
await fs.writeFile(out, JSON.stringify(summary, null, 2), "utf8");

console.log(`Perf @ ${url}  FCP: ~${ms(summary.metrics.fcp)}  LCP: ~${ms(summary.metrics.lcp)}  TTI(nav): ~${ms(summary.metrics.timeToInteractive)}  TTFB: ~${ms(summary.metrics.ttfb)}  bytes: ~${kb(summary.metrics.bytesTotal)}`);

function parseArgs(argv) { const o = {}; for (let i = 0; i < argv.length; i++) { const t = argv[i]; if (t.startsWith("--")) { const [k, v] = t.slice(2).split("="); o[k] = v ?? argv[++i]; } } return o; }
function ms(n) { return n ? `${Math.round(n)}ms` : "—"; }
function kb(n) { return n ? `${Math.round(n / 1024)}KB` : "—"; }

async function measureWithPlaywright(target) {
    const { chromium } = await import("playwright");
    const browser = await chromium.launch();
    const page = await browser.newPage();
    const result = { mode: "playwright" };

    // Inject LCP observer
    await page.addInitScript(() => {
        now.__metrics = { lcp: null };
        new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const last = entries[entries.length - 1];
            if (last) now.__metrics.lcp = last.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
    });

    const start = Date.now();
    await page.goto(target, { waitUntil: "networkidle" });
    const nav = await page.evaluate(() => performance.getEntriesByType("navigation")[0]?.toJSON?.() || null);
    const fcp = await page.evaluate(() => performance.getEntriesByName("first-contentful-paint")[0]?.startTime || null);
    const lcp = await page.evaluate(() => now.__metrics?.lcp || null);
    const bytes = await page.evaluate(() => performance.getEntriesByType("resource").reduce((a, e) => a + (e.transferSize || 0), 0));
    await browser.close();

    result.timeToInteractive = nav?.domInteractive ?? null;
    result.fcp = fcp;
    result.lcp = lcp;
    result.ttfb = nav?.responseStart ?? null;
    result.bytesTotal = bytes;
    result.load = nav?.loadEventEnd ?? (Date.now() - start);
    return result;
}

async function measureWithFetch(target) {
    const run = { mode: "fetch" };
    const t0 = performance.now();
    let ttfb = null, size = 0;
    try {
        const res = await fetch(target, { cache: "no-store" });
        const t1 = performance.now();
        ttfb = t1 - t0;
        const buf = Buffer.from(await res.arrayBuffer());
        size = buf.byteLength;
    } catch { /* ignore */ }
    run.ttfb = ttfb;
    run.bytesTotal = size;
    return run;
}

function aggregate(arr) {
    const avg = (k) => {
        const vals = arr.map(r => r[k]).filter(n => typeof n === "number" && isFinite(n));
        if (!vals.length) return null;
        return vals.reduce((a, b) => a + b, 0) / vals.length;
    };
    return {
        fcp: avg("fcp"),
        lcp: avg("lcp"),
        timeToInteractive: avg("timeToInteractive"),
        ttfb: avg("ttfb"),
        bytesTotal: avg("bytesTotal"),
        load: avg("load")
    };
}
