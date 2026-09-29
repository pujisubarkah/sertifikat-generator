/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        lan: {
          blue: '#0B2545',
          navy: '#133E87',
          gold: '#EBB02D',
          amber: '#F59E0B',
          red: '#DC2626',
          green: '#16A34A'
        }
      }
    }
  },
  plugins: []
}
