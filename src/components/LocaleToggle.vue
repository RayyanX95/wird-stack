<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useLocale } from '@/composables';

const { t } = useI18n();
const { locale, setLocale } = useLocale();
const route = useRoute();
const router = useRouter();

// Shows the language you'd switch *to*, not the one you're in — same logic as
// the theme toggle's icon, and the convention every bilingual site uses. The
// glyph is the target language written in itself, never a flag: Arabic is not
// a country.
const target = computed<'en' | 'ar'>(() => (locale.value === 'ar' ? 'en' : 'ar'));
const targetLabel = computed(() => (locale.value === 'ar' ? 'EN' : 'ع'));
const title = computed(() => t('locale.switchTo'));

/**
 * On the public pages the locale is part of the URL, so switching language has
 * to navigate — otherwise the address bar would still read `/en` while the
 * page rendered Arabic, and that URL is what gets indexed and shared.
 *
 * On the app routes there is no locale segment, so this is a plain state flip.
 * The router guard handles the reverse direction (arriving at a prefixed URL).
 */
function onToggle() {
  if (route.params.locale) {
    router.push({
      name: route.name!,
      params: { ...route.params, locale: target.value },
      query: route.query,
      hash: route.hash,
    });
    return;
  }
  setLocale(target.value);
}
</script>

<template>
  <button
    type="button"
    class="icon-btn locale-toggle"
    :title="title"
    :aria-label="title"
    @click="onToggle"
  >
    <Transition name="swap" mode="out-in">
      <span :key="targetLabel" class="locale-glyph">{{ targetLabel }}</span>
    </Transition>
  </button>
</template>

<style scoped>
.locale-toggle {
  flex-shrink: 0;
}

/* The Arabic glyph and the Latin "EN" have very different natural sizes; a
   fixed line-height and centred box keeps the button from resizing on toggle. */
.locale-glyph {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.4em;
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 700;
  line-height: 1;
}

.swap-enter-active,
.swap-leave-active {
  transition:
    opacity var(--transition-fast),
    transform var(--transition-fast);
}
.swap-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.swap-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
