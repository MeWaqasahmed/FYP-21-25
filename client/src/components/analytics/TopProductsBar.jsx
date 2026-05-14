import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TopProductsBar({ data = [] }) {
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <Box
          sx={{
            bgcolor: '#252535',
            border: '1px solid #2e2e45',
            borderRadius: 2,
            p: 1.5,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {payload[0].payload.name}
          </Typography>
          <Typography variant="body2" color="primary.main">
            {payload[0].value} clicks
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Card
      sx={{
        border: '1px solid #2e2e45',
        borderRadius: 3,
        background: 'linear-gradient(145deg, #1a1a24 0%, #252535 100%)',
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
          Top Products
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="#2e2e45" />
            <XAxis dataKey="name" stroke="#475569" style={{ fontSize: 12 }} />
            <YAxis stroke="#475569" style={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="clickCount" fill="#6366f1" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
