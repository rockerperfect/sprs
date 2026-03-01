/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas:   '#0d1117',
        surface:  '#161b22',
        elevated: '#1c2333',
        border:   '#30363d',
        accent:   '#6366f1',
        'accent-violet': '#8b5cf6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-accent':  '0 0 20px 2px rgba(99,102,241,0.2)',
        'glow-success': '0 0 20px 2px rgba(52,211,153,0.15)',
        'card': '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
      },
    },
  },
  plugins: [],
}
