import { Box, Typography, Grid } from '@mui/material';
import { Users, Store, Crown, MousePointerClick } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminAPI } from '../../api/admin';
import { useTitle } from '../../hooks/useTitle';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/common/StatsCard';
import Loader from '../../components/common/Loader';

export default function AdminDashboard() {
  useTitle('Admin Dashboard');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminAPI.getStats(),
  });

  const stats = data?.data?.data;

  if (isLoading) {
    return (
      <PageWrapper title="Admin Dashboard">
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Admin Dashboard">
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          Platform Overview
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              icon={Users}
              title="Total Users"
              value={stats?.users?.total || 0}
              color="#6366f1"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              icon={Store}
              title="Active Stores"
              value={stats?.stores?.published || 0}
              color="#22c55e"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              icon={Crown}
              title="Paid Subscriptions"
              value={stats?.revenue?.paidSubscriptions || 0}
              color="#f59e0b"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              icon={MousePointerClick}
              title="Clicks (30d)"
              value={stats?.analytics?.clicksLast30Days || 0}
              color="#ec4899"
            />
          </Grid>
        </Grid>
      </Box>
    </PageWrapper>
  );
}
