import { Card, CardContent, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Box } from '@mui/material';

export default function ClicksLineChart({ data = [] }) {
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
            {payload[0].payload.date}
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
          Clicks Over Time
        </Typography>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="#2e2e45" />
            <XAxis dataKey="date" stroke="#475569" style={{ fontSize: 12 }} />
            <YAxis stroke="#475569" style={{ fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="clicks"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: '#6366f1', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
