import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#6366f1', '#f59e0b', '#22c55e'];

export default function ConversionDonut({ data = [] }) {
  const chartData = [
    { name: 'Clicks', value: data.clicks || 0 },
    { name: 'Views', value: data.views || 0 },
    { name: 'Shares', value: data.shares || 0 },
  ].filter((item) => item.value > 0);

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
            {payload[0].name}
          </Typography>
          <Typography variant="body2" color="primary.main">
            {payload[0].value}
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
          Event Breakdown
        </Typography>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
