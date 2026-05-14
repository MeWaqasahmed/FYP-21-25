import { Box, Grid, Card, CardContent, Typography } from '@mui/material';
import { Package, MousePointerClick, TrendingUp, Crown, Sparkles } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { analyticsAPI } from '../../api/analytics';
import { productsAPI } from '../../api/products';
import { subscriptionAPI } from '../../api/subscription';
import { useAuthStore } from '../../store/authSlice';
import { useTitle } from '../../hooks/useTitle';
import { useSocket } from '../../hooks/useSocket';
import PageWrapper from '../../components/layout/PageWrapper';
import StatsCard from '../../components/common/StatsCard';
import ChartWidget from '../../components/dashboard/ChartWidget';
import TopProductsTable from '../../components/dashboard/TopProductsTable';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export default function InfluencerDashboard() {
  useTitle('Dashboard');
  useSocket(); // Initialize socket connection
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const { data: summaryData, isLoading: loadingSummary } = useQuery({
    queryKey: ['analytics-summary'],
    queryFn: () => analyticsAPI.getSummary(),
  });

  const { data: clicksData, isLoading: loadingClicks } = useQuery({
    queryKey: ['analytics-clicks'],
    queryFn: () => analyticsAPI.getClicks(),
  });

  const { data: productsData } = useQuery({
    queryKey: ['my-products'],
    queryFn: () => productsAPI.getMy(),
  });

  const { data: subscriptionData } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionAPI.getMy(),
  });

  const summary = summaryData?.data?.data?.summary || {};
  const topProducts = summaryData?.data?.data?.topProducts || [];
  const clicks = clicksData?.data?.data?.clicksData || [];
  const products = productsData?.data?.data?.products || [];
  const subscription = subscriptionData?.data?.data?.subscription;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loadingSummary || loadingClicks) {
    return (
      <PageWrapper title="Dashboard">
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Dashboard">
      <Box>
        {/* Greeting */}
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 4 }}>
          {getGreeting()}, {user?.name} 👋
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              icon={MousePointerClick}
              title="Total Clicks"
              value={summary.clicks || 0}
              delta={18.5}
              color="#6366f1"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              icon={Package}
              title="Active Products"
              value={products.filter((p) => p.isActive).length}
              color="#22c55e"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              icon={TrendingUp}
              title="Top Product Clicks"
              value={topProducts[0]?.clickCount || 0}
              color="#f59e0b"
            />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <StatsCard
              icon={Crown}
              title="Subscription"
              value={subscription?.plan?.toUpperCase() || 'FREE'}
              color="#ec4899"
            />
          </Grid>
        </Grid>

        {/* Charts and Tables */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} lg={8}>
            <ChartWidget
              title="Clicks Last 30 Days"
              data={clicks}
              dataKey="clicks"
              xKey="date"
            />
          </Grid>
          <Grid item xs={12} lg={4}>
            <TopProductsTable products={topProducts} />
          </Grid>
        </Grid>

        {/* AI Quick Action */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                border: '1px solid #2e2e45',
                borderRadius: 3,
                background: 'linear-gradient(145deg, #1a1a24 0%, #252535 100%)',
              }}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(99, 102, 241, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Sparkles size={24} color="#6366f1" />
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      AI Content Generator
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create engaging content with AI
                    </Typography>
                  </Box>
                </Box>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => navigate('/ai-tools')}
                >
                  Generate Content
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageWrapper>
  );
}
