#!/usr/bin/env node
// Node 18+ ESM. Scans node_modules/**/package.json and validates "license".
import { promises as fs } from "node:fs";
import { join, relative } from "node:path";

const cwd = process.cwd();
const outDir = "analysis";
const allow = new Set(
    (process.env.LICENSE_ALLOW || "MIT,ISC,BSD-2-Clause,BSD-3-Clause,Apache-2.0,CC0-1.0,Unlicense")
        .split(",").map(s => s.trim()).filter(Boolean)
);
const deny = new Set(
    (process.env.LICENSE_DENY || "AGPL-3.0,AGPL-3.0-only,AGPL-3.0-or-later,GPL-3.0,GPL-3.0-only,GPL-3.0-or-later,LGPL-3.0,SSPL-1.0")
        .split(",").map(s => s.trim()).filter(Boolean)
);
const failOnUnknown = (process.env.LICENSE_FAIL_ON_UNKNOWN || "true") === "true";
const failOnDenied = (process.env.LICENSE_FAIL_ON_DENIED || "true") === "true";
const nodeModulesDir = join(cwd, "node_modules");

const packages = new Map(); // key: name@version -> {name, version, license, path}

(async function main() {
    await ensureDir(outDir);
    if (!(await exists(nodeModulesDir))) {
        console.error("No node_modules/ found. Run `npm i` first.");
        process.exit(2);
    }
    await walkNodeModules(nodeModulesDir);

    const rows = [...packages.values()].sort((a, b) => a.name.localeCompare(b.name));
    const findings = rows.map(pkg => ({
        name: pkg.name, version: pkg.version, license: pkg.license || "UNKNOWN", path: relative(cwd, pkg.path),
        status: classify(pkg.license || "")
    }));

    const summary = {
        total: findings.length,
        unknown: findings.filter(f => f.status === "unknown").length,
        denied: findings.filter(f => f.status === "denied").length,
        allowed: findings.filter(f => f.status === "allowed").length,
        timestamp: new Date().toISOString(),
    };

    const json = { summary, allow: [...allow], deny: [...deny], findings };
    await fs.writeFile(join(outDir, "licenses.json"), JSON.stringify(json, null, 2), "utf8");
    await fs.writeFile(join(outDir, "licenses.md"), toMarkdown(json), "utf8");

    console.log(`Licenses: ${summary.allowed} allowed, ${summary.unknown} unknown, ${summary.denied} denied.`);

    if (failOnDenied && summary.denied > 0) {
        console.error("❌ Denied licenses found.");
        process.exit(1);
    }
    if (failOnUnknown && summary.unknown > 0) {
        console.error("❌ Unknown licenses found.");
        process.exit(1);
    }
    console.log("✅ License check passed.");
})().catch(err => {
    console.error(err);
    process.exit(1);
});

async function walkNodeModules(root) {
    const stack = [root];
    while (stack.length) {
        const dir = stack.pop();
        const entries = await fs.readdir(dir, { withFileTypes: true });
        for (const e of entries) {
            if (e.name.startsWith(".")) continue;
            const p = join(dir, e.name);
            if (e.isDirectory()) {
                if (e.name.startsWith("@")) { stack.push(p); continue; }
                const pkgJson = join(p, "package.json");
                if (await exists(pkgJson)) {
                    try {
                        const raw = await fs.readFile(pkgJson, "utf8");
                        const pkg = JSON.parse(raw);
                        if (pkg.name && pkg.version) {
                            const key = `${pkg.name}@${pkg.version}`;
                            if (!packages.has(key)) {
                                packages.set(key, {
                                    name: pkg.name,
                                    version: pkg.version,
                                    license: normalizeLicense(pkg.license),
                                    path: p
                                });
                            }
                        }
                    } catch { /* ignore */ }
                    // Recurse into nested deps
                    const nm = join(p, "node_modules");
                    if (await exists(nm)) stack.push(nm);
                } else {
                    stack.push(p);
                }
            }
        }
    }
}

function normalizeLicense(lic) {
    if (!lic) return "";
    if (typeof lic === "string") return lic.trim();
    if (typeof lic === "object" && lic.type) return String(lic.type).trim();
    return "";
}

function classify(licenseStr) {
    if (!licenseStr) return "unknown";
    const up = licenseStr.toUpperCase();
    // quick denies
    for (const d of deny) if (up.includes(d.toUpperCase())) return "denied";
    // parse simple SPDX expressions: treat OR as any allowed; AND as all allowed
    const hasOR = /\bOR\b/.test(up);
    const hasAND = /\bAND\b/.test(up);
    const ids = (up.match(/[A-Z0-9.+-]+/g) || [])
        .filter(t => !["WITH", "AND", "OR"].includes(t));
    if (ids.length === 0) return "unknown";
    const isAllowed = (id) => allow.has(id) || allow.has(id.replace(/\+$/, "")); // tolerate trailing +

    if (hasOR) {
        return ids.some(isAllowed) ? "allowed" : (ids.some(id => deny.has(id)) ? "denied" : "unknown");
    }
    if (hasAND) {
        return ids.every(isAllowed) ? "allowed" : (ids.some(id => deny.has(id)) ? "denied" : "unknown");
    }
    return isAllowed(ids[0]) ? "allowed" : (deny.has(ids[0]) ? "denied" : "unknown");
}

async function exists(p) { try { await fs.stat(p); return true; } catch { return false; } }
async function ensureDir(d) { await fs.mkdir(d, { recursive: true }); }

function toMarkdown(json) {
    const lines = [];
    lines.push("# Third-party Licenses Report\n");
    lines.push(`Generated: ${json.summary.timestamp}\n`);
    lines.push(`Allowed: ${json.summary.allowed}, Unknown: ${json.summary.unknown}, Denied: ${json.summary.denied}\n`);
    lines.push("## Findings\n");
    lines.push("| Package | Version | License | Status |");
    lines.push("|---|---|---|---|");
    for (const f of json.findings) {
        lines.push(`| ${f.name} | ${f.version} | ${f.license.replace(/\|/g, "/")} | ${f.status} |`);
    }
    lines.push("\n> Allowlist: " + json.allow.join(", "));
    return lines.join("\n");
}
