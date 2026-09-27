import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
 
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'TaskFlow AI',
        short_name: 'TaskFlow',
        description: 'AI-powered task manager built with React, TypeScript and Supabase.',
        theme_color: '#6f42f5',
        background_color: '#f9fafb',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icons/maskable-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        // Cache built assets automatically
        globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
        // Never cache Supabase/API calls - always go to network for fresh data
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.hostname.endsWith('supabase.co'),
            handler: 'NetworkOnly',
          },
        ],
      },
      devOptions: {
        // Lets you test the service worker with `npm run dev` (off by default)
        enabled: false,
      },
    }),
  ],
  server: { port: 5173 },
});