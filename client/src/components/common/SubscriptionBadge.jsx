import { Chip } from '@mui/material';

export default function SubscriptionBadge({ plan, size = 'small' }) {
  const getColor = () => {
    switch (plan?.toLowerCase()) {
      case 'premium':
        return { bg: '#f59e0b', text: '#fff' };
      case 'pro':
        return { bg: '#6366f1', text: '#fff' };
      default:
        return { bg: '#64748b', text: '#fff' };
    }
  };

  const colors = getColor();

  return (
    <Chip
      label={plan?.toUpperCase() || 'FREE'}
      size={size}
      sx={{
        bgcolor: colors.bg,
        color: colors.text,
        fontWeight: 700,
        fontSize: size === 'small' ? 10 : 12,
      }}
    />
  );
}
