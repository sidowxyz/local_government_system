export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        primary: '#227C9D',       // Deep Cyan Teal primary
        primaryHover: '#1A637E',  // Hover teal cyan
        primaryLight: '#EBF5F8',  // Soft teal light tint
        yale: '#1B4965',          // Yale Blue - Deep dependable anchor
        pacific: '#62B6CB',      // Pacific Blue
        turquoise: '#BEE9E8',    // Frozen Water
        sky: '#CAE9FF',          // Pale Sky
        accent: '#1B4965',       // Deep navy contrast accent
        gold: '#EAA220',         // Sunshine Gold contrast
        goldLight: '#FEF9C3',    // Light gold tint
        surface: '#F3F8FB',      // Fresh coastal background
        elevated: '#FFFFFF',     // Clean white surface
        ink: '#0F2332',          // Deep oceanic ink text
        muted: '#4C6A80',        // Soft slate blue text
        hairline: '#DCE7EE',     // Gentle hairline border
        danger: '#9B332B',
        success: '#146549',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        meta: ['12px', { lineHeight: '16px' }],
        body: ['14px', { lineHeight: '20px' }],
        lead: ['18px', { lineHeight: '24px', letterSpacing: '-0.18px' }],
        display: ['24px', { lineHeight: '32px', letterSpacing: '-0.24px' }],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(15, 35, 50, 0.025)',
        cardHover: '0 4px 12px -2px rgba(15, 35, 50, 0.05)',
      },
      spacing: {
        sidebar: '268px',
      },
      transitionTimingFunction: {
        standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        nav: '50',
      },
    },
  },
  plugins: [],
}
