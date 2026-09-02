import './assets/styles/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';
import { initLocale, initTheme } from './composables';
import { vReveal } from './directives/reveal';
import i18n from './i18n';

// Before mount: the inline script in index.html already set the theme and
// dir/lang attributes to avoid a flash, but these sync the reactive state to
// them and keep the theme-color meta tag in step.
initTheme();
initLocale();

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(i18n);
app.use(pinia);
app.use(router);
// Registers v-reveal globally so any template can use it without importing it.
app.directive('reveal', vReveal);

app.mount('#app');
