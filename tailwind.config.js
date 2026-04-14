/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {

      // ─── Raw Color Palette (OKLCH-based) ────────────────────────────────
      //     oklch(L C H) — L: lightness 0–1, C: chroma 0–0.37, H: hue 0–360°
      colors: {
        primary: {
          50:  'oklch(0.982 0.0141 148.8)',
          100: 'oklch(0.962 0.0435 147.3)',
          200: 'oklch(0.895 0.0948 146.9)',
          300: 'oklch(0.812 0.1494 145.9)',
          400: 'oklch(0.770 0.1412 146.0)',
          500: 'oklch(0.718 0.1325 145.9)',
          600: 'oklch(0.634 0.1165 145.9)',
          700: 'oklch(0.534 0.0985 146.0)',
          750: 'oklch(0.432 0.0796 146.1)',
          800: 'oklch(0.338 0.0629 146.1)',
          850: 'oklch(0.263 0.0484 145.9)',
          900: 'oklch(0.194 0.0354 146.9)',
        },
        secondary: {
          50:  'oklch(0.982 0.0057 264.5)',
          100: 'oklch(0.966 0.0115 264.5)',
          200: 'oklch(0.906 0.0320 266.2)',
          300: 'oklch(0.827 0.0609 263.3)',
          400: 'oklch(0.785 0.0767 261.5)',
          500: 'oklch(0.733 0.0971 259.3)',
          600: 'oklch(0.647 0.1233 255.7)',
          700: 'oklch(0.544 0.1036 255.8)',
          750: 'oklch(0.441 0.0832 255.5)',
          800: 'oklch(0.345 0.0660 255.9)',
          850: 'oklch(0.266 0.0511 256.1)',
          900: 'oklch(0.198 0.0374 254.4)',
        },
        grey: {
          50:  'oklch(0.982 0.0018 255.7)',
          100: 'oklch(0.962 0.0037 255.7)',
          200: 'oklch(0.895 0.0104 255.7)',
          300: 'oklch(0.812 0.0096 255.7)',
          400: 'oklch(0.770 0.0095 255.7)',
          500: 'oklch(0.718 0.0119 255.7)',
          600: 'oklch(0.634 0.0200 255.7)',
          700: 'oklch(0.534 0.0198 255.7)',
          750: 'oklch(0.432 0.0175 255.7)',
          800: 'oklch(0.338 0.0229 255.7)',
          850: 'oklch(0.263 0.0179 255.7)',
          900: 'oklch(0.194 0.0133 255.7)',
        },
        success: {
          50:  'oklch(0.980 0.0262 156.0)',
          100: 'oklch(0.960 0.0532 154.4)',
          200: 'oklch(0.891 0.1275 154.5)',
          300: 'oklch(0.808 0.1611 154.4)',
          400: 'oklch(0.764 0.1722 154.1)',
          500: 'oklch(0.714 0.1607 154.2)',
          600: 'oklch(0.628 0.1581 154.1)',
          700: 'oklch(0.529 0.1343 153.7)',
          750: 'oklch(0.426 0.1073 154.1)',
          800: 'oklch(0.337 0.0669 154.4)',
          850: 'oklch(0.261 0.0653 154.4)',
          900: 'oklch(0.195 0.0397 152.8)',
        },
        warning: {
          50:  'oklch(0.984 0.0080 36.6)',
          100: 'oklch(0.968 0.0161 36.5)',
          200: 'oklch(0.910 0.0475 35.9)',
          300: 'oklch(0.837 0.0935 39.5)',
          400: 'oklch(0.796 0.1227 41.6)',
          500: 'oklch(0.748 0.1636 46.6)',
          600: 'oklch(0.661 0.1743 50.2)',
          700: 'oklch(0.557 0.1461 50.5)',
          750: 'oklch(0.450 0.1185 50.3)',
          800: 'oklch(0.353 0.0933 50.0)',
          850: 'oklch(0.273 0.0723 50.0)',
          900: 'oklch(0.204 0.0531 50.9)',
        },
        danger: {
          50:  'oklch(0.984 0.0064 17.3)',
          100: 'oklch(0.968 0.0130 17.4)',
          200: 'oklch(0.910 0.0368 17.8)',
          300: 'oklch(0.836 0.0722 18.7)',
          400: 'oklch(0.796 0.0941 19.4)',
          500: 'oklch(0.747 0.1231 20.4)',
          600: 'oklch(0.668 0.1806 23.0)',
          700: 'oklch(0.567 0.1983 26.0)',
          750: 'oklch(0.459 0.1610 26.0)',
          800: 'oklch(0.360 0.1260 25.8)',
          850: 'oklch(0.278 0.0977 25.7)',
          900: 'oklch(0.206 0.0713 26.1)',
        },

        // ─── Semantic Tokens (via CSS vars — switch with .dark class) ──────
        // Surface
        'color-bg':                  'var(--color-bg)',
        'color-surface-1':           'var(--color-surface-1)',
        'color-surface-2':           'var(--color-surface-2)',
        'color-surface-3':           'var(--color-surface-3)',
        'color-surface-4':           'var(--color-surface-4)',
        'color-surface-5':           'var(--color-surface-5)',
        'color-surface-6':           'var(--color-surface-6)',
        'color-surface-7':           'var(--color-surface-7)',
        'color-on-surface':          'var(--color-on-surface)',
        'color-on-surface-subtle-1': 'var(--color-on-surface-subtle-1)',
        'color-on-surface-subtle-2': 'var(--color-on-surface-subtle-2)',
        'color-inverted-surface':    'var(--color-inverted-surface)',
        'color-on-inverted-surface': 'var(--color-on-inverted-surface)',
        // Primary
        'color-primary-1':           'var(--color-primary-1)',
        'color-primary-2':           'var(--color-primary-2)',
        'color-primary-3':           'var(--color-primary-3)',
        'color-on-primary':          'var(--color-on-primary)',
        // Secondary
        'color-secondary-1':         'var(--color-secondary-1)',
        'color-secondary-2':         'var(--color-secondary-2)',
        'color-on-secondary-1':      'var(--color-on-secondary-1)',
        'color-on-secondary-2':      'var(--color-on-secondary-2)',
        // Success
        'color-success-1':           'var(--color-success-1)',
        'color-success-2':           'var(--color-success-2)',
        'color-success-3':           'var(--color-success-3)',
        'color-on-success':          'var(--color-on-success)',
        'color-success-secondary-1': 'var(--color-success-secondary-1)',
        'color-success-secondary-2': 'var(--color-success-secondary-2)',
        'color-on-success-secondary':'var(--color-on-success-secondary)',
        // Warning
        'color-warning-1':           'var(--color-warning-1)',
        'color-warning-2':           'var(--color-warning-2)',
        'color-warning-3':           'var(--color-warning-3)',
        'color-on-warning':          'var(--color-on-warning)',
        'color-warning-secondary-1': 'var(--color-warning-secondary-1)',
        'color-warning-secondary-2': 'var(--color-warning-secondary-2)',
        'color-on-warning-secondary':'var(--color-on-warning-secondary)',
        // Danger
        'color-danger-1':            'var(--color-danger-1)',
        'color-danger-2':            'var(--color-danger-2)',
        'color-danger-3':            'var(--color-danger-3)',
        'color-on-danger':           'var(--color-on-danger)',
        'color-danger-secondary-1':  'var(--color-danger-secondary-1)',
        'color-danger-secondary-2':  'var(--color-danger-secondary-2)',
        'color-on-danger-secondary': 'var(--color-on-danger-secondary)',
        // Hero title
        'color-hero-title':          'var(--color-hero-title)',
      },

      // ─── Typography ───────────────────────────────────────────────────────
      fontFamily: {
        // Body text — switchable via --font-body CSS variable
        sans:    ['var(--font-body)', 'sans-serif'],
        // Headlines — switchable via --font-display CSS variable
        display: ['var(--font-display)', 'sans-serif'],
        // Brand — switchable via --font-brand CSS variable
        brand:   ['var(--font-brand)', 'sans-serif'],
        // Code / technical — JetBrains Mono
        mono:    ["'JetBrains Mono'", 'monospace'],
      },

      // Font sizes — two separate scales, each with correct line-height + letter-spacing
      // Usage: text-{size} for body, text-headline-{size} for display
      fontSize: {
        // ── Body scale (Inter, line-height: 1.2) ────────────────────────
        // Name          size      line-h   letter-spacing (from Figma)
        '2xs':  ['8px',  { lineHeight: '1.2', letterSpacing: '0.32px' }], // Body 2XS
        'xs':   ['10px', { lineHeight: '1.2', letterSpacing: '0.4px'  }], // Body XS
        'sm':   ['12px', { lineHeight: '1.2', letterSpacing: '0.48px' }], // Body S
        'md':   ['14px', { lineHeight: '1.2', letterSpacing: '0.14px' }], // Body M
        'base': ['16px', { lineHeight: '1.2', letterSpacing: '0.16px' }], // Body L
        'lg':   ['18px', { lineHeight: '1.2', letterSpacing: '0'      }], // Body XL

        // ── Headline scale (Borna, line-height: 1.5, letter-spacing: 0) ─
        'headline-s':   ['20px', { lineHeight: '1.5', letterSpacing: '0' }], // Headline S
        'headline-m':   ['24px', { lineHeight: '1.5', letterSpacing: '0' }], // Headline M
        'headline-l':   ['28px', { lineHeight: '1.5', letterSpacing: '0' }], // Headline L
        'headline-xl':  ['36px', { lineHeight: '1.5', letterSpacing: '0' }], // Headline XL
        'headline-2xl': ['42px', { lineHeight: '1.5', letterSpacing: '0' }], // Headline 2XL
        'headline-3xl': ['52px', { lineHeight: '1.5', letterSpacing: '0' }], // Headline 3XL
        'headline-4xl': ['64px', { lineHeight: '1.5', letterSpacing: '0' }], // Headline 4XL
        'headline-5xl': ['80px', { lineHeight: '1.5', letterSpacing: '0' }], // Headline 5XL
      },

      fontWeight: {
        medium:   '500',
        semibold: '600',
        bold:     '700',
      },

      // ─── Spacing ──────────────────────────────────────────────────────────
      spacing: {
        '0':  '0px',
        '1':  '4px',
        '2':  '8px',
        '3':  '12px',
        '4':  '16px',
        '5':  '20px',
        '6':  '24px',
        '7':  '28px',
        '8':  '32px',
        '10': '40px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        '20': '80px',
        '24': '96px',
      },

      // ─── Border Radius ────────────────────────────────────────────────────
      // Source of truth: Figma / Topic Board New / Border Radius
      // Usage: rounded-s | rounded-m | rounded-lg | rounded-2xl | rounded-xl
      borderRadius: {
        'none': '0px',
        's':    'var(--radius-s)',     // 6px  — switchable via character
        'm':    'var(--radius-m)',     // 8px  — switchable via character
        'lg':   'var(--radius-lg)',    // 12px — switchable via character
        '2xl':  'var(--radius-2xl)',   // 20px — large cards, hero containers
        'xl':   'var(--radius-xl)',    // pill — switchable via character
        'full': '9999px',             // always circular (intentional)
      },

      // ─── Shadows ──────────────────────────────────────────────────────────
      // Source of truth: Figma / Topic Board New / Shadows
      // 3 sizes × 3 intensities  |  pure black drop shadow
      // Intensity 1 = 8%  |  2 = 16%  |  3 = 32%
      // Usage: shadow-small-1 | shadow-medium-2 | shadow-large-3
      boxShadow: {
        'small-1':  'var(--shadow-small-1)',
        'small-2':  'var(--shadow-small-2)',
        'small-3':  'var(--shadow-small-3)',
        'medium-1': 'var(--shadow-medium-1)',
        'medium-2': 'var(--shadow-medium-2)',
        'medium-3': 'var(--shadow-medium-3)',
        'large-1':  'var(--shadow-large-1)',
        'large-2':  'var(--shadow-large-2)',
        'large-3':  'var(--shadow-large-3)',
        'none':     'none',
      },
    },
  },
  plugins: [],
};
