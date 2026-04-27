import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.jpg'],
      manifest: {
        name: 'Online CBT',
        short_name: 'OCBT',
        description: 'Online CBT is a fast, secure, and mobile-friendly computer-based testing platform that lets students take assessments anytime, while giving admins tools to manage questions, subjects, and results efficiently.',
        start_url: '/',
        scope: '/',
        theme_color: '#ab3500',
        background_color: '#fbf3ed',
        display: 'standalone',
        icons: [
          {
            src:'/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src:'/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          }
        ]
      },

      devOptions: {
        enabled: true,
      }
    })
  ],
})
