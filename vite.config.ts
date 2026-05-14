import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      includeAssets: ['/logo.svg', '/mlogo.svg', '/appsettings.json'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,json}'],
        runtimeCaching: [
          {
            urlPattern: /\/appsettings\.json$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'app-settings-cache',
            },
          },
        ],
      },
      manifest: {
        name: 'Radio Browser',
        short_name: 'RadioBrowser',
        description: 'Internet radio directory with favorites, tags and country filters',
        theme_color: '#0078d4',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/mlogo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
});
