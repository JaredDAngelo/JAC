/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary)',
        foreground: 'var(--foreground)',
        background: 'var(--background)',
        muted: 'var(--muted)',
        card: 'var(--card)'
      },
      borderRadius: {
        lg: 'var(--radius)'
      },
      container: {
        center: true,
        padding: '1rem'
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
}
