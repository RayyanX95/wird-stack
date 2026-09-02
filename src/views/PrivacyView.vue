<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocale } from '@/composables';
import { gregorianLabel } from '@/utils';

/**
 * The privacy policy.
 *
 * Rendered bare (see `meta.layout` in the router) rather than inside the app
 * shell: this is a document, reached from the landing page's footer, and
 * wrapping it in the habit-tracking chrome would be odd for someone who has
 * not signed up to anything.
 *
 * The content is entirely in the locale files so it stays translated in step
 * with the rest of the app — a privacy policy that silently falls back to
 * English for an Arabic reader is not a policy they can act on.
 */
const { t } = useI18n();
const { locale, localePath } = useLocale();

// The date this policy was last materially changed. Hardcoded on purpose:
// "last updated" must reflect edits to the text, not today's date, or it is
// a lie that happens to render.
const LAST_UPDATED = new Date('2026-09-02T00:00:00Z');

const updatedLabel = computed(() =>
  t('privacy.updated', { date: gregorianLabel(LAST_UPDATED, locale.value) }),
);

// A privacy policy needs a monitored address to be actionable under GDPR.
// Worth moving to a role address (privacy@wirdstack.com) once the domain has
// mail, so it isn't a personal inbox published on a public page forever.
const CONTACT_EMAIL = 'ibrahim.alrayany@gmail.com';

// Name and detail are separate keys so the service name can be emphasised as
// a real element rather than parsed out of the sentence with v-html.
function entries(keys: readonly string[]) {
  return keys.map((key) => ({
    name: t(`privacy.sent${key}Name`),
    detail: t(`privacy.sent${key}Detail`),
  }));
}

/**
 * Two lists, deliberately.
 *
 * "We chose to send your location here" and "this sees your IP because every
 * website's host does" are different kinds of disclosure, and folding them
 * into one list dilutes the first with boilerplate — the location disclosure
 * is the one a reader actually needs to weigh.
 */
const locationServices = computed(() => entries(['Aladhan', 'Geocode']));
const infraServices = computed(() => entries(['Fonts', 'Hosting']));

const stored = computed(() =>
  (['storedHabits', 'storedCoords', 'storedSettings', 'storedTimes'] as const).map((key) =>
    t(`privacy.${key}`),
  ),
);
</script>

<template>
  <div class="view privacy-page">
    <!-- The arrow comes from the global .back-link::before in main.css. -->
    <RouterLink :to="localePath()" class="back-link">{{ t('privacy.back') }}</RouterLink>

    <header class="privacy-header">
      <h1 class="text-title">{{ t('privacy.title') }}</h1>
      <p class="text-caption">{{ updatedLabel }}</p>
    </header>

    <section class="lede-panel">
      <h2 class="text-label">{{ t('privacy.summaryHeading') }}</h2>
      <p class="text-body">{{ t('privacy.summaryBody') }}</p>
    </section>

    <section>
      <h2 class="section-heading">{{ t('privacy.storedHeading') }}</h2>
      <p class="text-body">{{ t('privacy.storedBody') }}</p>
      <ul class="prose-list">
        <li v-for="item in stored" :key="item" class="text-body">{{ item }}</li>
      </ul>
    </section>

    <section>
      <h2 class="section-heading">{{ t('privacy.sentHeading') }}</h2>
      <p class="text-body">{{ t('privacy.sentBody') }}</p>
      <ul class="prose-list">
        <li v-for="service in locationServices" :key="service.name" class="text-body">
          <strong>{{ service.name }}</strong> — {{ service.detail }}
        </li>
      </ul>
    </section>

    <section>
      <h2 class="section-heading">{{ t('privacy.infraHeading') }}</h2>
      <p class="text-body">{{ t('privacy.infraBody') }}</p>
      <ul class="prose-list">
        <li v-for="service in infraServices" :key="service.name" class="text-body">
          <strong>{{ service.name }}</strong> — {{ service.detail }}
        </li>
      </ul>
    </section>

    <section>
      <h2 class="section-heading">{{ t('privacy.precisionHeading') }}</h2>
      <p class="text-body">{{ t('privacy.precisionBody') }}</p>
    </section>

    <section>
      <h2 class="section-heading">{{ t('privacy.analyticsHeading') }}</h2>
      <p class="text-body">{{ t('privacy.analyticsBody') }}</p>
    </section>

    <section>
      <h2 class="section-heading">{{ t('privacy.neverHeading') }}</h2>
      <p class="text-body">{{ t('privacy.neverBody') }}</p>
    </section>

    <section>
      <h2 class="section-heading">{{ t('privacy.controlHeading') }}</h2>
      <p class="text-body">{{ t('privacy.controlBody') }}</p>
    </section>

    <section>
      <h2 class="section-heading">{{ t('privacy.contactHeading') }}</h2>
      <!-- i18n-t so the address lands inside the sentence as a real link,
           wherever each language puts it. -->
      <i18n-t keypath="privacy.contactBody" tag="p" class="text-body" scope="global">
        <template #email>
          <a :href="`mailto:${CONTACT_EMAIL}`" class="contact-link">{{ CONTACT_EMAIL }}</a>
        </template>
      </i18n-t>
    </section>
  </div>
</template>

<style scoped>
.privacy-page {
  max-width: 68ch;
  margin: 0 auto;
  padding: var(--space-8) var(--space-5) var(--space-16);
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

.privacy-header {
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

/* The summary is the part most people will actually read, so it gets the
   visual weight rather than being buried as the first of eight equal sections. */
.lede-panel {
  padding: var(--space-5);
  background: linear-gradient(165deg, var(--accent-soft), transparent);
  border: 1px solid rgba(var(--accent-rgb), 0.22);
  border-radius: var(--radius-lg);
}
.lede-panel .text-body {
  margin: var(--space-2) 0 0;
}

.section-heading {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text);
  margin: 0 0 var(--space-2);
}

.prose-list {
  margin: var(--space-3) 0 0;
  /* Logical, so the bullets sit on the reading-start side in both directions. */
  padding-inline-start: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.contact-link {
  color: var(--accent);
}
</style>
