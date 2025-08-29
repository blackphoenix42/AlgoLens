# Security Policy

This document explains how to report security vulnerabilities in **Algorithm Visualizer** (the "Project"), our coordinated disclosure process, what is in and out of scope, and the secure‑by‑default practices we follow.

> **TL;DR** — If you’ve found a vulnerability, please email **security@\[YOUR‑DOMAIN]** or open a **GitHub Security Advisory** draft for this repository. Do *not* create a public issue. We’ll acknowledge within **3 business days (IST, UTC+05:30)** and work with you under coordinated disclosure.

---

## 📫 Report a Vulnerability

Please use one of the private channels below:

* **Email:** `security@[YOUR-DOMAIN]`
* **GitHub Security Advisory (preferred):** *Security ➜ Advisories ➜ Report a vulnerability* on this repo
* **Encryption:** PGP key (fingerprint & block below). If you need our key published elsewhere, ask in your first message.

When reporting, include as much detail as possible:

* Affected **component** (e.g., UI route, worker, build pipeline) and **version/commit**
* **Reproduction steps** (clear, minimal PoC)
* **Impact** and suggested **CVSS v3.1 vector string** (e.g., `AV:N/AC:L/…`) if you’re comfortable
* **Logs/screenshots** or a short video, if safe to share
* Your **contact** and if you want **public credit** (name/handle/link)

### PGP Public Key (placeholder)

```
-----BEGIN PGP PUBLIC KEY BLOCK-----
[REPLACE WITH ARMORED KEY]
-----END PGP PUBLIC KEY BLOCK-----
```

**Fingerprint:** `[REPLACE WITH FPR]`

---

## 🔐 Coordinated Disclosure Policy

* **Acknowledgement:** within **3 business days** of receipt (IST).
* **Triage & initial assessment:** within **7 days**.
* **Fix target:** within **90 days** from triage for most issues. Critical actively‑exploited issues may be fast‑tracked.
* **Embargo:** We ask that you **do not publicly disclose** or share details until a fix is released and an advisory is published.
* **Credit:** With your consent, we will thank you in the release notes and/or a `SECURITY-THANKS.md`. No monetary bounty at this time.
* **CVE:** For qualifying vulnerabilities, we may request a CVE via GitHub Security Advisories.

If we cannot meet these timelines (e.g., dependency‑driven), we will keep you updated with revised milestones.

---

## 🎯 Scope

**In scope**

* Code in this repository (application, build scripts, configuration, GitHub Actions).
* The deployed static site/app for this project: **https\://\[YOUR‑PROD‑DOMAIN]** (and staging/previews if we share them).
* Project infrastructure we control (e.g., GitHub Actions, container images built from this repo).

**Out of scope** (please don’t test):

* **Denial of Service** (DoS), volumetric or resource‑exhaustion attacks.
* **Automated scanning** with high request rates, spam, or brute forcing.
* **Third‑party services** we do not control (e.g., Vercel/Netlify/Cloudflare platforms themselves).
* **Social engineering**, phishing, physical security, or lost/stolen devices.
* **Self‑XSS**, clickjacking on non‑sensitive pages, or missing best‑practice headers on non‑production previews.
* Issues requiring a compromised device, rooted/ jail‑broken environment, or non‑default browser flags.

If you’re unsure, ask — we’re happy to clarify scope.

---

## 🧪 Rules of Engagement (Responsible Testing)

* Use **test data** only; do not access, modify, or exfiltrate real user data.
* **No service disruption**: avoid actions that degrade availability or developer productivity.
* Keep request rates low; prefer **single‑IP** testing with reasonable throttles.
* Do not run intrusive scanners against **preview PR deployments** unless coordinated.
* If you accidentally access sensitive data, **stop testing** and **report immediately**.

Safe harbor: If you follow this policy in good faith, we will not pursue or support legal action against you for your research on this project.

---

## 🧭 Severity & Prioritization

We generally use **CVSS v3.1** to gauge severity:

| Severity | CVSS (v3.1) |
| -------- | ----------- |
| Critical | 9.0–10.0    |
| High     | 7.0–8.9     |
| Medium   | 4.0–6.9     |
| Low      | 0.1–3.9     |

Prioritization may also consider exploitability, affected user count, availability of mitigations, and dependency ownership.

---

## 🔒 Project Security Practices

### Frontend & Browser Hardening

* The app is a **static client‑side** site built with **Vite + React + TypeScript**.
* Production is served behind HTTPS with security headers (see below). **Never** expose the Vite dev server to the public internet.
* We avoid `dangerouslySetInnerHTML`, `eval`, and untrusted HTML; sanitize any dynamic content.
* Use **Content Security Policy (CSP)** in production builds to limit script origins.

### Recommended Security Headers (configure via `public/_headers` or platform settings)

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://api.[YOUR-DOMAIN]; frame-ancestors 'none'; base-uri 'self'
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-site
```

Tailor `connect-src`/`img-src` as needed.

### Secrets Management

* **Do not commit secrets**. Use `.env.local` for local development and platform secret stores in CI/CD.
* Repository includes (or recommends) **gitleaks** to scan commits. If you find a leaked secret, rotate it immediately and open a private advisory.

### Supply‑Chain & Dependencies

* Lockfile committed (`package-lock.json`/`pnpm-lock.yaml`).
* Automated updates via **Renovate/Dependabot** (security patches prioritized).
* CI runs `npm audit --omit=dev` (or equivalent) and blocks on **Critical/High** unless overridden with a documented risk acceptance.
* Only vetted third‑party libraries are used; avoid unmaintained or source‑obfuscated packages.

### Build, CI, and Releases

* CI uses `npm ci` (clean, reproducible installs) and provenance‑friendly builds.
* Release artifacts are **tagged** and checksummed; optionally signed (`git tag -s`).
* GitHub Actions run with **least privilege** (scoped tokens, restricted secrets, pinned actions by SHA).

---

## 🔄 Vulnerability Lifecycle

1. **Report received** ➜ Acknowledgement (≤3 business days)
2. **Triage** ➜ Repro, scope, severity (≤7 days)
3. **Fix** ➜ Patch, tests, hardening (target ≤90 days)
4. **Release** ➜ New version, changelog entry, advisory published
5. **Credit** ➜ Optional public thanks if you consent

Emergency fixes may skip non‑essential steps.

---

## 🙏 Thanks

We deeply appreciate community efforts to keep this project safe. If you’d like recognition, tell us how to credit you (name/handle/link). If you prefer to remain anonymous, we’ll respect that.

---

## 🔎 Known Issues & Advisories

We track security advisories via **GitHub Security Advisories** and link them from the **Releases** page. If a safe **workaround** exists, we’ll document it in the advisory and cross‑link a PR.

---

## 📬 Contact Recap

* Primary: `security@[YOUR-DOMAIN]`
* Backup: `[MAINTAINER NAME] <[MAINTAINER EMAIL]>`
* PGP: see block & fingerprint above

> Replace placeholders in **ALL CAPS** before publishing. Save this file as `SECURITY.md` in the repository root.
