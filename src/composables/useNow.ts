import { onScopeDispose, ref } from 'vue';

/**
 * A clock that actually ticks.
 *
 * Anything showing "42m until Dhuhr" needs to re-render on its own — a plain
 * `new Date()` in a computed would freeze at whatever second the component
 * mounted. One shared interval drives every consumer, and it stops itself when
 * the last scope using it is torn down.
 */
const now = ref(new Date());
let timerId: ReturnType<typeof setInterval> | undefined;
let subscribers = 0;

export function useNow(intervalMs = 30_000) {
  subscribers++;
  if (timerId === undefined) {
    timerId = setInterval(() => (now.value = new Date()), intervalMs);
  }

  // Re-sync when the tab comes back: a backgrounded tab throttles its timers,
  // so the countdown can be minutes stale by the time the user looks again.
  const onVisible = () => {
    if (document.visibilityState === 'visible') now.value = new Date();
  };
  document.addEventListener('visibilitychange', onVisible);

  onScopeDispose(() => {
    subscribers--;
    document.removeEventListener('visibilitychange', onVisible);
    if (subscribers === 0 && timerId !== undefined) {
      clearInterval(timerId);
      timerId = undefined;
    }
  });

  return now;
}
