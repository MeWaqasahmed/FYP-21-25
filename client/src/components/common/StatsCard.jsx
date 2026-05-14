import { Box, Card, Typography } from '@mui/material';
import { TrendingUp, TrendingDown } from 'lucide-react';
import CountUp from 'react-countup';

export default function StatsCard({ icon: Icon, title, value, delta, color = '#6366f1' }) {
  const isPositive = delta >= 0;

  return (
    <Card
      sx={{
        p: 3,
        background: 'linear-gradient(145deg, #1a1a24 0%, #252535 100%)',
        border: '1px solid #2e2e45',
        borderRadius: 3,
        transition: 'all 150ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: `${color}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={24} color={color} />
        </Box>
        {delta !== undefined && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: isPositive ? 'success.main' : 'error.main',
            }}
          >
            {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {Math.abs(delta)}%
            </Typography>
          </Box>
        )}
      </Box>

      <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
        <CountUp end={value} duration={1} separator="," />
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
    </Card>
  );
}
