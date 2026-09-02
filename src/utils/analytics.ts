/**
 * Aggregate page-view counting, via Vercel Web Analytics.
 *
 * Why at all: without it there is no way to know whether anyone opens the app
 * twice, which is the only question that matters for a habit tracker. Building
 * features blind is more expensive than this costs.
 *
 * Why this one: Vercel already serves the site and is already named in the
 * privacy policy as a processor, so this adds no new company to disclose. It
 * is cookieless and builds no cross-site profile — which is what lets the
 * policy keep saying "no cookies, no advertising, no profile of you" honestly.
 *
 * Loaded as a plain script rather than the `@vercel/analytics` package: that
 * package declares a peer dependency on vue-router 4 and this project is on 5.
 * The script has no such constraint, ships nothing in our bundle, and tracks
 * SPA navigations on its own by listening to History API changes.
 */
const SCRIPT_SRC = '/_vercel/insights/script.js';

declare global {
  interface Window {
    // Defined by the Vercel script once it loads; absent until then, and
    // absent forever in development.
    va?: (event: 'beforeSend' | 'event' | 'pageview', properties?: unknown) => void;
  }
}

/**
 * Call once at boot. No-ops outside production, where the script 404s because
 * the endpoint only exists on a Vercel deployment.
 */
export function initAnalytics() {
  if (!import.meta.env.PROD) return;
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return;

  const script = document.createElement('script');
  script.defer = true;
  script.src = SCRIPT_SRC;
  document.head.appendChild(script);
}

/**
 * One named milestone, for questions page views can't answer — "did they get
 * far enough to create anything?".
 *
 * Deliberately carries no payload about *what* was created: a habit title is
 * the user's private practice and has no business leaving the device. Silently
 * does nothing if the script never loaded, so a blocked request or a plan
 * without custom events degrades to page views rather than throwing.
 */
export function trackEvent(name: string) {
  window.va?.('event', { name });
}
