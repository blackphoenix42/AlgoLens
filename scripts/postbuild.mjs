#!/usr/bin/env node
// Node 18+ ESM. Post-build utility for Vite outputs in /dist.
import { promises as fs } from "node:fs";
import { join } from "node:path";
import { execSync } from "node:child_process";

const dist = "dist";
const pkg = JSON.parse(await fs.readFile("package.json", "utf8"));
const version = pkg.version || "0.0.0";
let commit = "unknown";
try { commit = execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch { }

await assertExists(dist);

// 1) Stamp APP_VERSION in the service worker (if present)
const swPath = join(dist, "service-worker.js");
if (await exists(swPath)) {
    let sw = await fs.readFile(swPath, "utf8");
    const stamped = sw.replace(/const\s+APP_VERSION\s*=\s*".*?";/, `const APP_VERSION = "${version}+${commit}";`);
    if (stamped !== sw) {
        await fs.writeFile(swPath, stamped, "utf8");
        console.log(`✓ Stamped APP_VERSION in ${rel(swPath)} → ${version}+${commit}`);
    } else {
        console.log(`• APP_VERSION not found in ${rel(swPath)} (skipped)`);
    }
} else {
    console.log("• No service-worker.js in dist/ (skipped)");
}

// 2) Emit build metadata
const meta = {
    name: pkg.name,
    version,
    commit,
    builtAt: new Date().toISOString(),
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
};
await fs.writeFile(join(dist, "build-meta.json"), JSON.stringify(meta, null, 2), "utf8");
console.log(`✓ Wrote ${rel(join(dist, "build-meta.json"))}`);

// 3) Sanity: ensure PWA manifest exists
const manifest = ["manifest.json", "site.webmanifest"].find(f => await exists(join(dist, f)));
if (!manifest) console.warn("! No manifest found in dist/. Make sure /public/* was copied.");

// 4) Optional: warn if main JS exceeds budget
const budgetKB = Number(process.env.POSTBUILD_JS_BUDGET_KB || 300);
const jsFiles = (await fs.readdir(join(dist, "assets"))).filter(f => f.endsWith(".js")).sort();
let mainJs = jsFiles.find(f => /index-|main-|entry-|app-/.test(f)) || jsFiles[jsFiles.length - 1];
if (mainJs) {
    const size = (await fs.stat(join(dist, "assets", mainJs))).size;
    console.log(`JS bundle: ${mainJs} ~ ${(size / 1024).toFixed(0)}KB`);
    if (size / 1024 > budgetKB) {
        console.warn(`! JS bundle exceeds ${budgetKB}KB budget. Consider code-splitting and tree-shaking.`);
    }
}

// 5) (Optional) Copy offline assets if missing
for (const f of ["offline.html", "404.html"]) {
    const p = join(dist, f);
    if (!(await exists(p))) {
        console.warn(`! ${f} not found in dist/. If you rely on it, ensure it's in /public.`);
    }
}

async function assertExists(p) { if (!(await exists(p))) { throw new Error(`Missing path: ${p}`); } }
async function exists(p) { try { await fs.stat(p); return true; } catch { return false; } }
function rel(p) { return p.replace(process.cwd() + "/", ""); }
