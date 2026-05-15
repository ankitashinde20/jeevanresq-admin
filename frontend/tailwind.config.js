export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: '#090f1a',
        panel: '#101827',
        panelSoft: '#172033',
        emergency: '#ef4444',
        warning: '#f59e0b',
        success: '#22c55e',
        cyan: '#22d3ee'
      },
      boxShadow: {
        glow: '0 0 32px rgba(239, 68, 68, 0.22)'
      }
    }
  },
  plugins: []
};

