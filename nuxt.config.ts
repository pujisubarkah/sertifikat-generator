// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false, // SPA Mode for browser-based PDF and Canvas Generation
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4
  },
  css: [
    '~/assets/css/main.css'
  ],
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  app: {
    head: {
      title: 'Generator Sertifikat LAN RI - Batch CSV to PDF',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Aplikasi Cetak Sertifikat Otomatis dari CSV' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Montserrat:wght@400;600;700;800;900&family=Merriweather:ital,wght@0,400;0,700;1,300;1,400&display=swap' }
      ]
    }
  }
})
