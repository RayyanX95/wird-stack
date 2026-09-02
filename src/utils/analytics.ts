/**
 * Aggregate page-view counting, via Cloudflare Web Analytics.
 *
 * Why at all: without it there is no way to know whether anyone opens the app
 * twice, which is the only question that matters for a habit tracker. Building
 * features blind is more expensive than this costs.
 *
 * Why this one: Cloudflare already serves the site (see BUSINESS.md), so this
 * adds no new company to the privacy policy's disclosure list. It is
 * cookieless and builds no cross-site profile — what lets the policy keep
 * saying "no cookies, no advertising, no profile of you" honestly.
 *
 * The beacon token is not a secret — it's a public site identifier meant to
 * sit in the page source, the same way a Google Analytics ID is — but it is
 * still per-deployment, so it comes from an env var rather than being
 * hardcoded. Get it from the Cloudflare dashboard: Analytics & Logs ▸ Web
 * Analytics ▸ Add a site, then set VITE_CF_BEACON_TOKEN in the Pages
 * project's environment variables. The `VITE_` prefix is required for Vite to
 * expose it to the client bundle at build time.
 *
 * Known gap: Cloudflare's free Web Analytics has no custom-events API, only
 * automatic pageviews and Core Web Vitals — unlike the Vercel product this
 * replaced, which could log a named "habit_created" milestone. There is
 * currently no activation signal beyond "they opened /habits/new". Recovering
 * that means either a paid analytics product or a tiny logging endpoint on
 * the Workers backend this app will eventually need for push notifications
 * anyway — not worth standing up for one event before that backend exists.
 */
const BEACON_SRC = 'https://static.cloudflareinsights.com/beacon.min.js';

/**
 * Call once at boot. No-ops outside production, and if no token is
 * configured — so a local build or a fork without Cloudflare Analytics set up
 * just doesn't load the script, rather than shipping a broken one.
 */
export function initAnalytics() {
  if (!import.meta.env.PROD) return;

  const token = import.meta.env.VITE_CF_BEACON_TOKEN;
  if (!token) return;

  if (document.querySelector(`script[src="${BEACON_SRC}"]`)) return;

  // Matches Cloudflare's own snippet exactly: beacon.min.js is shipped as an
  // ES module, and `type="module"` is what Cloudflare's install instructions
  // specify — not `defer`, which was here before and never actually asserted
  // module type, so a classic-script parse of module syntax could silently
  // fail depending on the browser.
  const script = document.createElement('script');
  script.type = 'module';
  script.src = BEACON_SRC;
  script.setAttribute('data-cf-beacon', JSON.stringify({ token }));
  document.head.appendChild(script);
}
