/// <reference types="@cloudflare/workers-types" />

import en from '../src/i18n/locales/en';
import ar from '../src/i18n/locales/ar';

/**
 * Per-locale social preview tags, rewritten at the edge.
 *
 * The problem this solves: WhatsApp, Telegram, X, LinkedIn and Facebook
 * crawlers do not execute JavaScript. They read the raw index.html and never
 * see the per-route tags the Vue router maintains. Since a static SPA ships
 * exactly one index.html, an `/ar` link shared on WhatsApp — the single most
 * likely way this app spreads in its target audience — showed an English card
 * with an English image.
 *
 * HTMLRewriter streams the response and swaps the handful of tags that differ,
 * so there is no full-page buffering and no measurable latency. Strings come
 * from the app's own locale files rather than being duplicated here, so a copy
 * change in one place cannot leave the share card stale.
 *
 * This is the first server-side code in the project. It deliberately does
 * nothing else: no data, no logging, no state. The app stays local-first.
 */

const ORIGIN = 'https://wird-stack.ibrahim-alrayany.workers.dev';

type Locale = 'en' | 'ar';
const MESSAGES: Record<Locale, { seo: { title: string; description: string } }> = { en, ar };

/**
 * Which language this URL represents.
 *
 * Public pages carry it in the path (`/ar`, `/en/privacy`). App routes
 * (`/today`, `/habits`) deliberately do not — see router/index.ts — so there
 * is nothing authoritative to read, and we fall back to Accept-Language.
 *
 * That header is a weak signal: most social crawlers either omit it or send a
 * generic value, so in practice an app-route share resolves to English. That
 * is the honest default rather than a guess dressed up as detection.
 */
function localeFor(url: URL, request: Request): Locale {
  const prefix = url.pathname.split('/')[1];
  if (prefix === 'ar' || prefix === 'en') return prefix;

  const accept = request.headers.get('accept-language') ?? '';
  return /(^|,|\s)ar\b/i.test(accept) ? 'ar' : 'en';
}

/**
 * Anyone sharing an app route is sharing it with someone who does not use the
 * app yet — the recipient lands on an empty first-run state. So the card
 * should pitch the product, not say "Today", and the URL it advertises is the
 * landing page rather than a private view.
 */
function canonicalPathFor(url: URL, locale: Locale): string {
  const prefix = url.pathname.split('/')[1];
  if (prefix === 'ar' || prefix === 'en') return url.pathname;
  return `/${locale}`;
}

/** Rewrites the content attribute of whichever meta tag it is attached to. */
class SetContent {
  constructor(private value: string) {}
  element(el: Element) {
    el.setAttribute('content', this.value);
  }
}

class SetText {
  constructor(private value: string) {}
  element(el: Element) {
    el.setInnerContent(this.value);
  }
}

export default {
  async fetch(request: Request, env: { ASSETS: Fetcher }): Promise<Response> {
    const response = await env.ASSETS.fetch(request);

    // Only HTML documents carry the tags; assets stream through untouched.
    if (!response.headers.get('content-type')?.includes('text/html')) return response;

    const url = new URL(request.url);
    const locale = localeFor(url, request);
    const alternate: Locale = locale === 'ar' ? 'en' : 'ar';
    const { seo } = MESSAGES[locale];

    const pageUrl = ORIGIN + canonicalPathFor(url, locale);
    const image = `${ORIGIN}/og-image${locale === 'ar' ? '-ar' : ''}.png`;

    return (
      new HTMLRewriter()
        // `lang`/`dir` here are for crawlers and for the pre-hydration frame;
        // index.html's inline script still corrects them from the user's saved
        // preference on app routes, which is what a returning visitor wants.
        .on('html', {
          element(el) {
            el.setAttribute('lang', locale);
            el.setAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
          },
        })
        .on('title', new SetText(seo.title))
        .on('meta[name="description"]', new SetContent(seo.description))
        .on('meta[property="og:title"]', new SetContent(seo.title))
        .on('meta[property="og:description"]', new SetContent(seo.description))
        .on('meta[property="og:url"]', new SetContent(pageUrl))
        .on('meta[property="og:locale"]', new SetContent(locale))
        .on('meta[property="og:locale:alternate"]', new SetContent(alternate))
        .on('meta[property="og:image"]', new SetContent(image))
        .on('meta[name="twitter:image"]', new SetContent(image))
        .transform(response)
    );
  },
};
