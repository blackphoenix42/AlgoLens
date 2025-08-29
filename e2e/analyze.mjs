#!/usr/bin/env node
/* eslint-disable no-console */
// Simple bundle analyzer & budget checker (ESM, Node 18+). No dependencies.

import { promises as fs } from "node:fs";
import { dirname, extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { brotliCompress, gzip } from "node:zlib";
import { promisify } from "node:util";

const gz = promisify(gzip);
const br = promisify(brotliCompress);
const __dirname = dirname(fileURLToPath(import.meta.url));

// ---------- CLI args ----------
const args = parseArgs(process.argv.slice(2));
const targetDir = args.dir || "dist";
const outDir = args.out || "analysis";
const failOnThreshold = !!args["fail-on-threshold"] || !!args.fail;
const budgets = {
    js: parseSize(args["budget-js"]),
    css: parseSize(args["budget-css"]),
    total: parseSize(args["budget-total"]),
    image: parseSize(args["budget-image"]),
};
const includePatterns = (args.include ? String(args.include).split(",") : []).map((s) => s.trim()).filter(Boolean);
const excludePatterns = (args.exclude ? String(args.exclude).split(",") : []).map((s) => s.trim()).filter(Boolean);

// ---------- Main ----------
(async function main() {
    const absTarget = isAbsolutePath(targetDir) ? targetDir : join(process.cwd(), targetDir);
    await ensureDir(outDir);

    const files = await walk(absTarget);
    const assets = files
        .filter((f) => f.size > 0)
        .filter((f) => (includePatterns.length ? includePatterns.some((p) => f.path.includes(p)) : true))
        .filter((f) => (excludePatterns.length ? !excludePatterns.some((p) => f.path.includes(p)) : true));

    // Compute sizes
    const results = [];
    for (const f of assets) {
        const buf = await fs.readFile(f.path);
        const [gzSize, brSize] = await Promise.all([
            safeCompress(gz, buf),
            safeCompress(br, buf),
        ]);
        results.push({
            path: relative(absTarget, f.path).replaceAll("\\", "/"),
            ext: extname(f.path).toLowerCase(),
            type: classify(extname(f.path)),
            raw: buf.byteLength,
            gzip: gzSize,
            brotli: brSize,
        });
    }

    // Aggregate
    const totals = aggregate(results);
    const budgetFindings = checkBudgets(totals, budgets);

    // Write artifacts
    const json = {
        dir: absTarget,
        generatedAt: new Date().toISOString(),
        totals,
        files: results.sort((a, b) => b.gzip - a.gzip),
        budgets,
        budgetFindings,
    };
    await fs.writeFile(join(outDir, "size-report.json"), JSON.stringify(json, null, 2), "utf8");
    await fs.writeFile(join(outDir, "size-report.md"), toMarkdown(json), "utf8");

    // Print summary
    printSummary(json);

    // Exit code on failure
    if (failOnThreshold && Object.values(budgetFindings).some((f) => f && f.exceeded)) {
        console.error("\n❌ Size budgets exceeded (see analysis/size-report.md).");
        process.exit(1);
    } else {
        console.log("\n✅ Analysis complete.");
    }
})().catch((err) => {
    console.error("analyze.mjs failed:", err);
    process.exit(1);
});

// ---------- Helpers ----------
function parseArgs(argv) {
    const out = {};
    for (let i = 0; i < argv.length; i++) {
        const tok = argv[i];
        if (tok.startsWith("--")) {
            const [k, v] = tok.slice(2).split("=");
            if (v !== undefined) out[k] = v;
            else if (i + 1 < argv.length && !argv[i + 1].startsWith("--")) out[k] = argv[++i];
            else out[k] = true;
        }
    }
    return out;
}

function isAbsolutePath(p) {
    return /^([A-Za-z]:\\|\/)/.test(p);
}

async function walk(dir) {
    const out = [];
    const stack = [dir];
    while (stack.length) {
        const d = stack.pop();
        const entries = await fs.readdir(d, { withFileTypes: true });
        for (const e of entries) {
            const p = join(d, e.name);
            if (e.isDirectory()) stack.push(p);
            else if (e.isFile()) {
                const st = await fs.stat(p);
                out.push({ path: p, size: st.size });
            }
        }
    }
    return out;
}

function classify(ext) {
    ext = (ext || "").toLowerCase();
    if ([".js", ".mjs", ".cjs"].includes(ext)) return "js";
    if ([".ts", ".tsx", ".jsx"].includes(ext)) return "source";
    if ([".css"].includes(ext)) return "css";
    if ([".html", ".htm"].includes(ext)) return "html";
    if ([".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".avif"].includes(ext)) return "image";
    if ([".woff", ".woff2", ".ttf", ".otf", ".eot"].includes(ext)) return "font";
    if ([".map"].includes(ext)) return "sourcemap";
    return "other";
}

async function safeCompress(fn, buf) {
    try {
        const out = await fn(buf);
        return out.byteLength;
    } catch {
        return 0;
    }
}

function aggregate(files) {
    const sumBy = (pred) => files.filter(pred).reduce((a, f) => {
        a.raw += f.raw; a.gzip += f.gzip; a.brotli += f.brotli; return a;
    }, { raw: 0, gzip: 0, brotli: 0 });

    const js = sumBy((f) => f.type === "js");
    const css = sumBy((f) => f.type === "css");
    const image = sumBy((f) => f.type === "image");
    const font = sumBy((f) => f.type === "font");
    const html = sumBy((f) => f.type === "html");
    const other = sumBy((f) => !["js", "css", "image", "font", "html", "sourcemap"].includes(f.type));
    const total = sumBy(() => true);

    return { total, js, css, image, font, html, other };
}

function parseSize(x) {
    if (!x) return null;
    const s = String(x).trim().toLowerCase();
    const m = s.match(/^(\d+(?:\.\d+)?)(\s*(b|kb|kib|mb|mib))?$/i);
    if (!m) return null;
    const n = parseFloat(m[1]);
    const unit = (m[3] || "b").toLowerCase();
    const mult = unit === "mb" ? 1e6 :
        unit === "mib" ? 1024 ** 2 :
            unit === "kb" ? 1e3 :
                unit === "kib" ? 1024 :
                    1;
    return Math.round(n * mult);
}

function checkBudgets(totals, budgets) {
    const out = {};
    const check = (label, bytes) => {
        const limit = budgets[label];
        if (!limit) return null;
        return {
            limit,
            actual: totals[label]?.gzip ?? 0,
            exceeded: (totals[label]?.gzip ?? 0) > limit,
        };
    };
    out.js = check("js");
    out.css = check("css");
    out.total = check("total");
    out.image = check("image");
    return out;
}

function human(bytes) {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const val = bytes / Math.pow(k, i);
    return `${val.toFixed(val >= 100 || i === 0 ? 0 : 1)} ${units[i]}`;
}

async function ensureDir(dir) {
    await fs.mkdir(dir, { recursive: true });
}

function toMarkdown(json) {
    const { totals, files, budgets, budgetFindings } = json;
    const lines = [];
    lines.push("# Bundle Size Report");
    lines.push("");
    lines.push(`Generated: \`${json.generatedAt}\``);
    lines.push("");
    lines.push("## Totals (gzip)");
    lines.push("");
    lines.push("| Type | Raw | Gzip | Brotli |");
    lines.push("|---|---:|---:|---:|");
    for (const key of ["total", "js", "css", "image", "font", "html", "other"]) {
        const t = totals[key];
        if (!t) continue;
        lines.push(`| ${key.toUpperCase()} | ${human(t.raw)} | ${human(t.gzip)} | ${human(t.brotli)} |`);
    }
    lines.push("");
    lines.push("## Largest Files (top 20 by gzip)");
    lines.push("");
    lines.push("| File | Type | Raw | Gzip | Brotli |");
    lines.push("|---|---|---:|---:|---:|");
    files.slice(0, 20).forEach((f) => {
        lines.push(`| \`${f.path}\` | ${f.type} | ${human(f.raw)} | ${human(f.gzip)} | ${human(f.brotli)} |`);
    });

    const budgetsActive = Object.values(budgets).some(Boolean);
    if (budgetsActive) {
        lines.push("");
        lines.push("## Budgets");
        lines.push("");
        lines.push("| Budget | Limit (gzip) | Actual (gzip) | Status |");
        lines.push("|---|---:|---:|---|");
        for (const [k, finding] of Object.entries(budgetFindings)) {
            if (!budgets[k]) continue;
            const actual = finding ? human(finding.actual) : "—";
            const status = finding?.exceeded ? "❌ Exceeded" : "✅ OK";
            lines.push(`| ${k.toUpperCase()} | ${human(budgets[k])} | ${actual} | ${status} |`);
        }
    }

    lines.push("");
    lines.push("> Tip: Keep **app JS gzip ≤ 250 KB** for great UX. Use code-splitting, tree-shaking, and lazy loading.");
    return lines.join("\n");
}

function printSummary(json) {
    const pad = (s, n) => (s + " ".repeat(n)).slice(0, n);
    const t = json.totals;
    console.log("\nBundle (gzip):");
    console.log(`  total: ${pad(human(t.total.gzip), 8)}   js: ${pad(human(t.js.gzip), 8)}   css: ${pad(human(t.css.gzip), 8)}   img: ${pad(human(t.image.gzip), 8)}`);
    const over = Object.entries(json.budgetFindings)
        .filter(([, f]) => f && f.exceeded)
        .map(([k, f]) => `${k}=${human(f.actual)}/${human(f.limit)}`);
    if (over.length) console.warn("  Budgets exceeded:", over.join(", "));
}
