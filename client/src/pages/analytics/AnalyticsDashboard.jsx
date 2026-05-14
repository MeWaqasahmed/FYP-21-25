import { Box, Typography, Grid, Card, CardContent, ButtonGroup, IconButton } from '@mui/material';
import { Download } from 'lucide-react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useTitle } from '../../hooks/useTitle';
import { useStore } from '../../hooks/useStore';
import { analyticsAPI } from '../../api/analytics';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import ClicksLineChart from '../../components/analytics/ClicksLineChart';
import TopProductsBar from '../../components/analytics/TopProductsBar';
import ConversionDonut from '../../components/analytics/ConversionDonut';
import AnalyticsTable from '../../components/analytics/AnalyticsTable';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

export default function AnalyticsDashboard() {
  useTitle('Analytics');
  const { summary, clicks, isLoading, setRange } = useAnalytics();
  const { products } = useStore();

  const handleExport = async () => {
    try {
      const response = await analyticsAPI.export();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'analytics.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Analytics exported successfully!');
    } catch (error) {
      toast.error('Failed to export analytics');
    }
  };

  if (isLoading) {
    return (
      <PageWrapper title="Analytics">
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Analytics">
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Analytics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Track your performance metrics
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ButtonGroup variant="outlined">
              <Button onClick={() => setRange(7)}>7d</Button>
              <Button onClick={() => setRange(30)}>30d</Button>
              <Button onClick={() => setRange(90)}>90d</Button>
            </ButtonGroup>

            <IconButton onClick={handleExport} sx={{ bgcolor: 'primary.main', color: '#fff', '&:hover': { bgcolor: 'primary.dark' } }}>
              <Download size={20} />
            </IconButton>
          </Box>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total Clicks
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                  {summary?.summary?.clicks || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total Views
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                  {summary?.summary?.views || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ border: '1px solid #2e2e45', borderRadius: 3 }}>
              <CardContent>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Total Shares
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                  {summary?.summary?.shares || 0}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <ClicksLineChart data={clicks} />
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TopProductsBar data={summary?.topProducts || []} />
          </Grid>
          <Grid item xs={12} md={6}>
            <ConversionDonut data={summary?.summary || {}} />
          </Grid>
        </Grid>

        {/* Table */}
        <AnalyticsTable products={products} />
      </Box>
    </PageWrapper>
  );
}
