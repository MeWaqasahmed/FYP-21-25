import { Box, Typography } from '@mui/material';
import Button from './Button';

export default function EmptyState({ icon: Icon, title, message, action, onAction }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        textAlign: 'center',
        p: 4,
      }}
    >
      {Icon && (
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            bgcolor: 'rgba(99, 102, 241, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <Icon size={40} color="#6366f1" />
        </Box>
      )}

      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        {title}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 400 }}>
        {message}
      </Typography>

      {action && onAction && (
        <Button variant="primary" onClick={onAction}>
          {action}
        </Button>
      )}
    </Box>
  );
}
