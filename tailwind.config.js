/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'orbitron': ['Orbitron', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
        'metamask': ['Euclid Circular B', 'Inter', 'sans-serif'],
        'metamask-heading': ['Poly Variable', 'Georgia', 'serif'],
      },
      colors: {
        metamask: {
          orange: '#ff5c16',
          purple: '#3d065f',
          black: '#0a0a0a',
          gray: {
            50: '#f7f9fc',
            100: '#e9edf6',
            200: '#c8ceda',
          },
          green: '#baf24a',
        },
        neon: {
          pink: '#FF1B8D',
          blue: '#00D2FF',
          purple: '#8B5CF6',
          cyan: '#06FFA5',
          green: '#00FF88',
          yellow: '#FFD700',
          orange: '#FF8C00',
        },
      },
      boxShadow: {
        'metamask': '0 4px 12px rgba(0, 0, 0, 0.08)',
        'metamask-hover': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'glow-pink': '0 0 20px rgba(255, 27, 141, 0.5)',
        'glow-blue': '0 0 20px rgba(0, 210, 255, 0.5)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5)',
        'glow-cyan': '0 0 20px rgba(6, 255, 165, 0.5)',
        'glow-green': '0 0 20px rgba(0, 255, 136, 0.5)',
        'glow-yellow': '0 0 20px rgba(255, 215, 0, 0.5)',
      },
    },
  },
  plugins: [],
}