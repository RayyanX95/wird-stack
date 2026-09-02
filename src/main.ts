import './assets/styles/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';
import { registerSW } from 'virtual:pwa-register';
import { initLocale, initTheme } from './composables';
import { initAnalytics } from './utils';
import { vReveal } from './directives/reveal';
import i18n from './i18n';

// Caches the app shell so an installed WirdStack opens without a network, and
// registers the worker that Web Push will later deliver reminders to.
// `autoUpdate` (see vite.config.ts) means a new build activates on next launch
// with no prompt, so there is nothing to handle here.
registerSW({ immediate: true });

// Before mount: the inline script in index.html already set the theme and
// dir/lang attributes to avoid a flash, but these sync the reactive state to
// them and keep the theme-color meta tag in step.
initTheme();
initLocale();
// Aggregate page views only, production only — see utils/analytics.ts.
initAnalytics();

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(i18n);
app.use(pinia);
app.use(router);
// Registers v-reveal globally so any template can use it without importing it.
app.directive('reveal', vReveal);

app.mount('#app');
