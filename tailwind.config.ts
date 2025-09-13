import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 使用 CSS 变量定义颜色
        'bg': {
          'primary': 'var(--color-bg-primary)',
          'secondary': 'var(--color-bg-secondary)',
          'tertiary': 'var(--color-bg-tertiary)',
          'overlay': 'var(--color-bg-overlay)',
        },
        'text': {
          'primary': 'var(--color-text-primary)',
          'secondary': 'var(--color-text-secondary)',
          'tertiary': 'var(--color-text-tertiary)',
          'inverse': 'var(--color-text-inverse)',
        },
        'border': {
          'primary': 'var(--color-border-primary)',
          'secondary': 'var(--color-border-secondary)',
          'focus': 'var(--color-border-focus)',
        },
        'surface': {
          'elevated': 'var(--color-surface-elevated)',
          'hover': 'var(--color-surface-hover)',
          'active': 'var(--color-surface-active)',
        },
        'excalidraw': {
          'purple': 'var(--color-excalidraw-purple)',
          'purple-hover': 'var(--color-excalidraw-purple-hover)',
          'purple-light': 'var(--color-excalidraw-purple-light)',
          'purple-dark': 'var(--color-excalidraw-purple-dark)',
        },
        'status': {
          'success': 'var(--color-success)',
          'success-hover': 'var(--color-success-hover)',
          'warning': 'var(--color-warning)',
          'warning-hover': 'var(--color-warning-hover)',
          'error': 'var(--color-error)',
          'error-hover': 'var(--color-error-hover)',
          'info': 'var(--color-info)',
          'info-hover': 'var(--color-info-hover)',
        }
      },
      boxShadow: {
        'sm': 'var(--shadow-sm)',
        'md': 'var(--shadow-md)',
        'lg': 'var(--shadow-lg)',
        'xl': 'var(--shadow-xl)',
      },
      fontFamily: {
        'virgil': 'var(--font-virgil)',
      },
      transitionDuration: {
        'fast': 'var(--transition-fast)',
        'normal': 'var(--transition-normal)',
        'slow': 'var(--transition-slow)',
      }
    },
  },
  plugins: [],
}

export default config
