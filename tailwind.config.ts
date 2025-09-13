import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Ouroboros color palette
        'deep-teal': '#19535f',
        'jade': '#0b7a75',
        'sand': '#d7c9aa',
        'rust': '#7b2d26',
        'pearl': '#f0f3f5',
        // Additional organism colors
        'warm-sand': '#d8a47f',
        'coral': '#ef8354',
        'rose': '#ee4b6a',
        'deep-rose': '#df3b57',
        'teal': '#0f7173',
      },
      fontFamily: {
        'sans': ['Arial', 'Helvetica', 'sans-serif'],
        'serif': ['Georgia', 'serif'],
        'mono': ['Courier New', 'monospace'],
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { 
            boxShadow: '0 0 5px rgba(123, 45, 38, 0.5)',
          },
          '100%': { 
            boxShadow: '0 0 20px rgba(123, 45, 38, 0.8)',
          },
        }
      }
    },
  },
  plugins: [],
}

export default config
