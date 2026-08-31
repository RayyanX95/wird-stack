import './assets/styles/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

import App from './App.vue';
import router from './router';
import { initTheme } from './composables';
import { vReveal } from './directives/reveal';

// Before mount: the inline script in index.html already set the theme
// attribute to avoid a flash, but this syncs the reactive store to it and
// keeps the theme-color meta tag in step.
initTheme();

const app = createApp(App);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
app.use(router);
// Registers v-reveal globally so any template can use it without importing it.
app.directive('reveal', vReveal);

app.mount('#app');
