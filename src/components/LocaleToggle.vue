<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/composables';

const { t } = useI18n();
const { locale, toggleLocale } = useLocale();

// Shows the language you'd switch *to*, not the one you're in — same logic as
// the theme toggle's icon, and the convention every bilingual site uses. The
// glyph is the target language written in itself, never a flag: Arabic is not
// a country.
const targetLabel = computed(() => (locale.value === 'ar' ? 'EN' : 'ع'));
const title = computed(() => t('locale.switchTo'));
</script>

<template>
  <button
    type="button"
    class="icon-btn locale-toggle"
    :title="title"
    :aria-label="title"
    @click="toggleLocale"
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
