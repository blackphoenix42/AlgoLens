# Privacy Policy

_Last updated: 2025-08-29_

This Privacy Policy explains how **AlgoLens** ("AlgoLens", "we", "our", or "us") collects, uses, and protects information when you use our website and web application (the "Service"). It should be read together with our [Cookie Policy](/cookie_policy.md) and [Security Policy](/security).

> **Short version:** We collect the minimum data needed to run AlgoLens. We don’t sell your data or run advertising trackers. Optional analytics and error monitoring are **off by default** and only load if you consent.

---

## 1) Who we are

**AlgoLens Maintainers**

- Contact: **privacy@algolens.app**
- Security reports: **security@algolens.app** (see `/.well-known/security.txt`)
- Location: Bengaluru, India (IST)

---

## 2) Scope

This policy applies to the AlgoLens website/app, docs, and any pages we operate that link to it. It does not cover third‑party sites or services that we link to.

---

## 3) What we collect

We aim to keep collection minimal.

### a) Information you provide

- **Feedback & support**: messages, screenshots, email address, and any details you choose to share when contacting us or opening issues.
- **Account data (if/when accounts exist)**: name, email, and settings you save. _Currently, AlgoLens does not require an account for basic use._

### b) Information collected automatically

- **Essential technical data** (first‑party): IP address (transient), basic request logs, and necessary cookies/storage for core functionality (e.g., session, CSRF, theme). See [Cookie Policy](/cookie_policy.md).
- **Optional analytics** (only if you consent): aggregated usage events (pages, features, device/browser). We configure analytics to avoid storing IP addresses where possible.
- **Optional error telemetry** (only if you consent): stack traces, runtime context (browser version, URL), and a random session ID to help debug crashes. We mask text inputs and block media in replays by default.

### c) Local-only state

- **Visualizer settings** (dataset size, theme, speed) are kept in your browser storage to enhance your session. They are not sent to our servers unless specifically required for a feature.

We **do not** collect: government IDs, precise geolocation, biometric data, or advertising identifiers.

---

## 4) How we use information

- Provide, maintain, and improve the Service.
- Diagnose crashes and performance issues (if you opted in).
- Understand feature usage to prioritize improvements (if you opted in).
- Communicate with you about updates or support requests.
- Protect the Service against abuse or attacks.

We do **not** sell or rent personal data. We do not use your data for targeted advertising.

---

## 5) Legal bases (where applicable)

- **Consent** (e.g., analytics, error monitoring cookies). You can withdraw at any time via Cookie Settings.
- **Legitimate interests** (e.g., ensuring security, preventing fraud, essential logging), balanced against your rights.
- **Contract** (if you create an account or subscribe to a paid plan in the future, for providing requested features).

---

## 6) Retention

We keep data only as long as needed for the purposes above:

- Essential logs: typically ≤ 30 days unless investigating security incidents.
- Analytics (if enabled): per‑tool default, commonly 2–14 months.
- Error events (if enabled): commonly 30–90 days.
- Support emails/issues: as long as needed to resolve and maintain history.

When data is no longer needed, we delete or de‑identify it.

---

## 7) Sharing & processors

We may share data with service providers that help us operate the Service, under agreements that restrict their use of data to our instructions.

Common providers we may use:

- **Hosting/CDN** (e.g., Vercel/Netlify/GitHub Pages) — serve the website.
- **Analytics** (optional; only on consent) — e.g., Google Analytics 4.
- **Error monitoring** (optional; only on consent) — e.g., Sentry.
- **Issue tracking & version control** — GitHub (public issues/PRs are visible by design).

We may disclose information if required by law or to protect rights, safety, and integrity of the Service.

We do not sell personal data. We do not share data with data brokers.

---

## 8) International transfers

Your information may be processed in countries other than your own. Where required, we implement safeguards such as Standard Contractual Clauses or comparable mechanisms.

---

## 9) Your choices & rights

You can:

- Manage cookie consent via the **Cookie Settings** link or browser settings.
- Access, correct, or delete the information you provided to us (e.g., via support).
- Object to or restrict certain processing where applicable.
- Withdraw consent at any time for optional cookies/tools.

**EEA/UK users (GDPR/UK‑GDPR):** You may have rights to access, rectification, erasure, restriction, portability, and objection. You also have the right to lodge a complaint with your local supervisory authority.

**California users (CCPA/CPRA):** You may have the right to know, delete, correct, and opt‑out of sale/share (we do **not** sell/share for cross‑context behavioral advertising). You have the right to non‑discrimination for exercising your rights.

**India users (DPDP Act 2023):** You may have the right to access, correction, erasure, grievance redressal, and to nominate. You can contact us at **privacy@algolens.app** for requests.

We will respond to verifiable requests as required by applicable law.

---

## 10) Security

We use reasonable technical and organizational measures to protect information, including HTTPS, least‑privilege access, dependency scanning, and CI checks. No method of transmission or storage is 100% secure; please report vulnerabilities to **security@algolens.app**.

---

## 11) Children’s privacy

AlgoLens is intended for individuals 13+ (or the minimum age required in your jurisdiction). We do not knowingly collect personal data from children. If you believe a child provided us data, contact **privacy@algolens.app** so we can delete it.

---

## 12) Changes to this policy

We may update this policy to reflect technical, legal, or business changes. Material changes will be highlighted on the site. The date at the top shows the latest revision.

---

## 13) Contact us

Questions or requests about this policy or your data?

- Email: **privacy@algolens.app**
- Security: **security@algolens.app**
- Postal: AlgoLens Maintainers, Bengaluru, India (IST)

---

### Developer notes (optional, remove if not needed)

- Initialize analytics and error monitoring **only after** consent flags are set.
- Avoid logging PII in client logs. Mask inputs by default in telemetry.
- Keep data mapping in code synced with this document and the Cookie Policy.
