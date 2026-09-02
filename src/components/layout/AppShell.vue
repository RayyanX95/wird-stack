<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import AppSidebar from './AppSidebar.vue';

const { t } = useI18n();
</script>

<template>
  <div class="shell">
    <AppSidebar />
    <!-- Skip link: the sidebar/tab bar is a lot of repeated stops for a
         keyboard or screen-reader user to walk past on every route. -->
    <a href="#content" class="skip-link">{{ t('common.skipToContent') }}</a>
    <main id="content" class="main" tabindex="-1">
      <div class="main-inner">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  min-height: 100dvh;
}

/* The rail is fixed-width; the content column takes the rest and centres a
   readable measure inside it, so a wide monitor gets breathing room on both
   sides rather than one huge void on the right. */
.main {
  flex: 1;
  min-width: 0;
  padding: var(--space-10);
  display: flex;
  justify-content: center;
}
.main:focus {
  outline: none;
}

.main-inner {
  width: 100%;
  max-width: var(--measure);
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.skip-link {
  position: absolute;
  inset-inline-start: var(--space-4);
  top: calc(-1 * var(--space-16));
  z-index: var(--z-modal);
  padding: var(--space-2) var(--space-4);
  background: var(--accent);
  color: var(--accent-contrast);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  font-weight: 600;
  text-decoration: none;
  transition: top var(--transition);
}
.skip-link:focus {
  top: var(--space-4);
}

@media (max-width: 720px) {
  .shell {
    flex-direction: column;
  }
  .main {
    padding: var(--space-5) var(--space-4);
    /* Clear the fixed tab bar plus the iOS home indicator. */
    padding-bottom: calc(var(--tabbar-h) + var(--space-6) + env(safe-area-inset-bottom, 0px));
  }
}
</style>
