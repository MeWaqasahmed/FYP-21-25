import { Button as MuiButton } from '@mui/material';

export default function Button({ variant = 'primary', children, ...props }) {
  const getStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          bgcolor: 'primary.main',
          color: '#fff',
          '&:hover': { bgcolor: 'primary.dark' },
        };
      case 'secondary':
        return {
          bgcolor: 'transparent',
          color: 'primary.main',
          border: '1px solid',
          borderColor: 'primary.main',
          '&:hover': { bgcolor: 'rgba(99, 102, 241, 0.1)' },
        };
      case 'danger':
        return {
          bgcolor: 'error.main',
          color: '#fff',
          '&:hover': { bgcolor: 'error.dark' },
        };
      case 'ghost':
        return {
          bgcolor: 'transparent',
          color: 'text.primary',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' },
        };
      case 'icon':
        return {
          minWidth: 40,
          width: 40,
          height: 40,
          borderRadius: '50%',
          bgcolor: 'rgba(255, 255, 255, 0.05)',
          color: 'text.primary',
          '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.1)' },
        };
      default:
        return {};
    }
  };

  return (
    <MuiButton
      sx={{
        ...getStyles(),
        textTransform: 'none',
        fontWeight: 600,
        borderRadius: 2,
        transition: 'all 150ms ease',
        '&:active': {
          transform: 'scale(0.98)',
        },
      }}
      {...props}
    >
      {children}
    </MuiButton>
  );
}
