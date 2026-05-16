import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/radio-browser/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'auto',
      strategies: 'generateSW',
      manifest: {
        name: 'Radio Browser',
        short_name: 'RadioBrowser',
        description: 'Internet radio directory with favorites, tags and country filters',
        theme_color: '#0078d4',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/radio-browser/',
        scope: '/radio-browser/',
        icons: [
          {
            src: '/radio-browser/logo.svg', 
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
          {
            src: '/radio-browser/mlogo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
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
    }),
  ],
});