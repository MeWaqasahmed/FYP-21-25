import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
      dark: '#4f46e5',
      light: '#a5b4fc',
    },
    secondary: {
      main: '#f59e0b',
      dark: '#d97706',
    },
    background: {
      default: '#0f0f13',
      paper: '#1a1a24',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#94a3b8',
    },
    success: {
      main: '#22c55e',
    },
    warning: {
      main: '#f97316',
    },
    error: {
      main: '#ef4444',
    },
    info: {
      main: '#3b82f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Geist", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.025em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    body1: {
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.5)',
    '0 4px 16px rgba(0,0,0,0.4)',
    '0 8px 32px rgba(0,0,0,0.5)',
    '0 12px 48px rgba(0,0,0,0.6)',
    '0 16px 64px rgba(0,0,0,0.7)',
    '0 20px 80px rgba(0,0,0,0.8)',
    '0 24px 96px rgba(0,0,0,0.9)',
    '0 1px 3px rgba(0,0,0,0.5)',
    '0 4px 16px rgba(0,0,0,0.4)',
    '0 8px 32px rgba(0,0,0,0.5)',
    '0 12px 48px rgba(0,0,0,0.6)',
    '0 16px 64px rgba(0,0,0,0.7)',
    '0 20px 80px rgba(0,0,0,0.8)',
    '0 24px 96px rgba(0,0,0,0.9)',
    '0 1px 3px rgba(0,0,0,0.5)',
    '0 4px 16px rgba(0,0,0,0.4)',
    '0 8px 32px rgba(0,0,0,0.5)',
    '0 12px 48px rgba(0,0,0,0.6)',
    '0 16px 64px rgba(0,0,0,0.7)',
    '0 20px 80px rgba(0,0,0,0.8)',
    '0 24px 96px rgba(0,0,0,0.9)',
    '0 1px 3px rgba(0,0,0,0.5)',
    '0 4px 16px rgba(0,0,0,0.4)',
    '0 8px 32px rgba(0,0,0,0.5)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 20px',
          transition: 'all 150ms ease',
          '&:active': {
            transform: 'scale(0.98)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid #2e2e45',
          transition: 'all 150ms ease',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#252535',
            '&:hover fieldset': {
              borderColor: '#6366f1',
            },
          },
        },
      },
    },
  },
});
