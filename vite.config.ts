import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    /**
     * The service worker is what makes the landing page's "Works offline"
     * claim true. Before this, the app had a web manifest (so it *looked*
     * installable) but no cached shell — installing it to a home screen and
     * opening it without a network gave a blank page.
     *
     * It is also the prerequisite for Web Push later: notifications are
     * delivered to a service worker, so there is no reminder feature without
     * one registered first.
     */
    VitePWA({
      // Silent updates. The alternative — prompting the user to reload — needs
      // its own UI, and for an app someone opens five times a day mid-routine,
      // an unprompted refresh on next launch is the less intrusive choice.
      registerType: 'autoUpdate',
      // The manifest lives here rather than in public/ so it cannot drift from
      // the app it describes; the plugin injects the <link> tag itself.
      manifest: {
        name: 'WirdStack — Islamic habit tracker',
        short_name: 'WirdStack',
        description: 'Anchor one small act to each prayer you already pray.',
        start_url: '/today',
        scope: '/',
        display: 'standalone',
        background_color: '#f3f4ef',
        theme_color: '#1f6f5c',
        orientation: 'portrait-primary',
        icons: [
          { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any maskable' },
          { src: '/favicon.ico', sizes: '16x16 32x32 48x48 64x64', type: 'image/x-icon' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,ico,woff2}'],
        // Every route is client-side, so any offline navigation has to resolve
        // to the shell — the same job wrangler.jsonc's not_found_handling does when online.
        navigateFallback: '/index.html',
        // ...except for the crawler files, which are real documents. Without
        // this, opening /sitemap.xml in a browser with the SW active would
        // serve the app shell instead of the XML.
        navigateFallbackDenylist: [/^\/sitemap\.xml$/, /^\/robots\.txt$/, /^\/og-image\.png$/],
        runtimeCaching: [
          {
            // Font CSS changes rarely but does change; serve cached, refresh behind.
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'google-fonts-stylesheets' },
          },
          {
            // The font files themselves are immutable and large — cache hard.
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 24, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Prayer times are already cached in localStorage per day per
            // location; this is the second line of defence, so a cold offline
            // start on a new day still has yesterday's times to fall back to
            // rather than nothing.
            urlPattern: /^https:\/\/api\.aladhan\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'prayer-times',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 7 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/api\.bigdatacloud\.net\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'reverse-geocode',
              networkTimeoutSeconds: 5,
              expiration: { maxEntries: 16, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
