import type { Directive } from 'vue';

/**
 * `v-reveal` — fades an element up the first time it scrolls into view.
 *
 * An IntersectionObserver per element rather than one scroll listener doing
 * getBoundingClientRect on everything: the browser does the intersection work
 * off the main thread, so a long marketing page stays smooth. Each observer
 * disconnects the moment it fires — this is an entrance, and re-animating on
 * every scroll-by is the thing that makes these pages feel cheap.
 *
 * Optional value is a stagger index: `v-reveal="2"`.
 */
export const vReveal: Directive<HTMLElement, number | undefined> = {
  mounted(el, binding) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.style.setProperty('--i', String(binding.value ?? 0));
    el.classList.add('reveal-pending');

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.remove('reveal-pending');
          el.classList.add('reveal-in');
          observer.disconnect();
        }
      },
      // A small negative bottom margin means the animation starts just *after*
      // the element's top edge appears, not the instant it clips the viewport.
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
    );

    observer.observe(el);
    // Stashed so unmounted() can tear it down even if the element never fired.
    (el as HTMLElement & { _revealObserver?: IntersectionObserver })._revealObserver = observer;
  },
  unmounted(el) {
    (el as HTMLElement & { _revealObserver?: IntersectionObserver })._revealObserver?.disconnect();
  },
};
