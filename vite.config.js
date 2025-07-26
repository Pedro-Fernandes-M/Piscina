import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import fs from 'fs'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [
      vue(),
      vueDevTools(),
      VitePWA({
        strategies: 'injectManifest',
        registerType: 'autoUpdate',
        injectRegister: 'auto',
        includeAssets: ['logo_sticker.png'],
        globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
        filename: 'sw.js',
        srcDir: 'src',
        devOptions: {
          enabled: false,
          type: 'module',
        },
        manifest: {
          name: 'Registos App',
          short_name: 'Registos',
          description: 'App para registo e controlo de Legionella em piscinas e quartos.',
          start_url: '/Piscina/',
          display: 'standalone',
          orientation: 'portrait',
          background_color: '#181818',
          theme_color: '#181818',
          icons: [
            {
              src: 'logo_sticker.png',
              sizes: '192x192',
              type: 'image/png',
            },
          ],
          lang: 'pt-PT',
          dir: 'ltr',
        },
        workbox: {
          runtimeCaching: [
            {
              urlPattern: /^\/Piscina\/$/,
              handler: 'NetworkFirst',
              options: {
                cacheName: 'start-page-cache',
                expiration: {
                  maxEntries: 1,
                },
              },
            },
          ],
        },
      }),
    ],
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || 'dev'),
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    base: '/Piscina/',
    server: {
      https: {
        key: fs.readFileSync('./localhost-key.pem'),
        cert: fs.readFileSync('./localhost.pem'),
      },
      port: 5173,
    },
  }
})
