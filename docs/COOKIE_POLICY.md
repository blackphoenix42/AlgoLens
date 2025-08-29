# Cookie Policy

_Last updated: 2025-08-29_

This Cookie Policy explains how **AlgoLens** ("we", "us", "our") uses cookies and similar technologies on our website and web application (the "Service"). It should be read together with our [Privacy Policy](./PRIVACY.md) and [Security Policy](../public/.well-known/security.txt).

> **Short version:** We use essential cookies to make the site work and optional cookies (e.g., analytics) only if you consent. We do **not** use advertising cookies.

---

## 1) What are cookies?

**Cookies** are small text files stored on your device by your browser. We also use similar technologies such as **localStorage**, **sessionStorage**, and **IndexedDB** to remember your preferences and improve your experience.

- **Session cookies** expire when you close your browser.
- **Persistent cookies** stay on your device for a set period or until you delete them.
- **First‑party** cookies are set by us; **third‑party** cookies are set by other providers (e.g., analytics).

---

## 2) Why we use them

We use cookies and storage for the following purposes:

1. **Strictly necessary** – Required for core functionality (routing, CSRF protection, basic preferences).
2. **Functional** – Remember your choices (theme, language, last used dataset size).
3. **Analytics (optional)** – Understand usage to improve features (aggregated, non‑personal insights).
4. **Error monitoring (optional)** – Detect crashes and performance issues.

We do **not** use cookies for targeted advertising.

---

## 3) Cookies & storage we set

> Names may vary between releases. The table shows typical keys.

| Category                    | Name                           | Type                                 | Purpose                                                 | Retention                    |
| --------------------------- | ------------------------------ | ------------------------------------ | ------------------------------------------------------- | ---------------------------- |
| Strictly necessary          | `algolens_session`             | Cookie (session)                     | Maintains session state for the app shell / CSRF        | Session                      |
| Strictly necessary          | `cookie_consent`               | Cookie                               | Records your category choices (e.g., analytics on/off)  | 12 months                    |
| Functional                  | `theme` / `__theme`            | localStorage                         | Remembers light/dark/system preference                  | 24 months                    |
| Functional                  | `lang`                         | localStorage                         | Remembers selected language                             | 24 months                    |
| Functional                  | `last_algorithm_id`            | localStorage                         | Restores last visited algorithm in Visualizer           | 6 months                     |
| Functional                  | `dataset.size`, `dataset.seed` | localStorage                         | Restores dataset settings between visits                | 6 months                     |
| Functional                  | `playback.speed`               | localStorage                         | Remembers preferred playback speed                      | 6 months                     |
| Analytics (optional)        | `_ga`, `_gid`, `_gat`          | Cookie (3rd‑party, if GA is enabled) | Google Analytics 4 usage stats                          | 13 months (per Google)       |
| Error monitoring (optional) | `sentry-*`                     | localStorage/sessionStorage          | Sentry SDK uses storage to correlate sessions & replays | Up to 30 days (configurable) |

> We ship **analytics and Sentry as opt‑in**. Until you consent in the banner (or settings), these are **not** activated.

---

## 4) Third parties

If enabled by you:

- **Google Analytics (GA4)** — Provider: Google LLC. We use it for aggregated usage metrics. IP anonymization and data retention controls are applied where available.
- **Sentry** — Provider: Sentry, Inc. Used to capture unhandled errors and performance telemetry to improve stability. We mask inputs and block media in replays by default.

We do **not** serve third‑party ads, social tracking pixels, or cross‑site behavioral advertising.

---

## 5) Managing your consent

You can accept or reject optional categories anytime:

- Use the **Cookie Settings** link in the footer or visit **/preferences/cookies** (if present in your build).
- Change browser settings to block/clear cookies (see tips below).

Withdrawing consent will disable optional tools moving forward. It does not automatically delete historical data already sent to third parties; consult their controls to request deletion where applicable.

---

## 6) How to control cookies in your browser

> Paths vary by version—use your browser’s help for exact steps.

- **Chrome (desktop)**: Settings → Privacy & security → Cookies and other site data → Block/clear cookies.
- **Firefox**: Settings → Privacy & Security → Cookies and Site Data → Manage/clear; Enhanced Tracking Protection.
- **Safari (macOS)**: Settings → Privacy → Cookies and website data.
- **Microsoft Edge**: Settings → Cookies and site permissions → Manage and delete cookies and site data.
- **Mobile browsers**: See respective app settings under Privacy.

You can also use **private/incognito** windows to limit persistence and **clear site data** from your browser’s site settings.

---

## 7) Do Not Track

Some browsers offer a **Do Not Track (DNT)** signal. There’s no common standard for DNT. We treat DNT as a signal to **disable optional analytics and error monitoring** unless you explicitly opt‑in via the banner.

---

## 8) Data retention

- Essential/functional storage is kept only as long as needed for the stated purpose.
- Analytics retention (if enabled) is normally set between **2–14 months** (default 14) in GA4.
- Sentry event retention (if enabled) is typically **30–90 days** depending on plan/config.

---

## 9) Regional notes

- **EEA/UK (GDPR/UK‑GDPR):** We rely on **consent** for non‑essential cookies (analytics, error monitoring). You can withdraw consent at any time via settings.
- **India (DPDP Act 2023):** We obtain your **consent** for optional cookies; essential cookies are used for providing the Service you request.

---

## 10) Changes to this policy

We may update this policy to reflect technical, legal, or business changes. Significant changes will be communicated via the site or banner. The date at the top shows the latest revision.

---

## 11) Contact us

If you have any questions about this Cookie Policy or our data practices:

- Email: **privacy@algolens.app** or **security@algolens.app**
- Address/Owner: AlgoLens Maintainers (contact via email above)

---

### Developer notes (optional section you can remove)

- The consent banner should initialize **only essential storage** by default.
- Gate GA/Sentry initialization on consent flags, e.g., `consent.analytics === true`.
- Keep cookie names and lifetimes in a single source and update this document when they change.
