#!/usr/bin/env node
// Node 18+ ESM. Generates a simple sitemap for SPAs.
import { promises as fs } from "node:fs";
import { join } from "node:path";

const args = parseArgs(process.argv.slice(2));
const base = (args.base || "https://algolens.app").replace(/\/+$/, "");
const out = args.out || "public/sitemap.xml";
const changefreq = args.changefreq || "daily";
const priority = Number(args.priority ?? 0.8);
const lastmod = args.lastmod || new Date().toISOString().slice(0, 10); // YYYY-MM-DD

let routes = [];
if (args.routes) {
    routes = String(args.routes).split(",").map(s => s.trim()).filter(Boolean);
} else if (await exists("routes.json")) {
    // Optional: read routes from a JSON array file
    routes = JSON.parse(await fs.readFile("routes.json", "utf8"));
} else {
    // Defaults
    routes = ["/", "/visualizer", "/catalog", "/privacy", "/terms"];
}

const urls = [...new Set(routes.map(r => r.startsWith("/") ? r : `/${r}`))];

const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<!-- Generated on ${new Date().toISOString()} -->`,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
].concat(
    urls.map(u => [
        "  <url>",
        `    <loc>${base}${u}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority.toFixed(1)}</priority>`,
        "  </url>"
    ].join("\n"))
).concat(['</urlset>', ""]).join("\n");

await ensureDir(out);
await fs.writeFile(out, xml, "utf8");
console.log(`✓ Wrote ${out} with ${urls.length} routes`);

function parseArgs(argv) {
    const out = {};
    for (let i = 0; i < argv.length; i++) {
        const t = argv[i];
        if (t.startsWith("--")) {
            const [k, v] = t.slice(2).split("=");
            out[k] = v ?? argv[i + 1]; if (v == null && argv[i + 1]?.startsWith("--")) out[k] = true; else if (v == null) i++;
        }
    }
    return out;
}
async function exists(p) { try { await fs.stat(p); return true; } catch { return false; } }
async function ensureDir(filePath) {
    const dir = filePath.split("/").slice(0, -1).join("/") || ".";
    await fs.mkdir(dir, { recursive: true });
}
