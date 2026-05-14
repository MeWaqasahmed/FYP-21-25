import { Box, Typography, Container, Grid, Card, CardContent } from '@mui/material';
import { Store, Sparkles, BarChart2, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTitle } from '../../hooks/useTitle';
import Button from '../../components/common/Button';
import { PLAN_FEATURES } from '../../constants/planTiers';

const features = [
  {
    icon: Store,
    title: 'Branded Storefront',
    description: 'Create your own customizable store with your unique branding and style.',
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Content',
    description: 'Generate SEO descriptions, hashtags, and social media captions instantly.',
  },
  {
    icon: BarChart2,
    title: 'Advanced Analytics',
    description: 'Track clicks, views, and conversions with detailed analytics dashboards.',
  },
];

export default function LandingPage() {
  useTitle('Home');

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.5rem', md: '4rem' },
                fontWeight: 800,
                mb: 2,
                color: '#fff',
              }}
            >
              Your Creator Business, Supercharged.
            </Typography>

            <Typography
              variant="h5"
              sx={{
                mb: 4,
                color: 'rgba(255,255,255,0.9)',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Build your branded storefront, track analytics, and grow your influencer business with AI-powered tools.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/register"
                variant="primary"
                size="large"
                endIcon={<ArrowRight size={20} />}
                sx={{
                  bgcolor: '#fff',
                  color: '#6366f1',
                  height: 56,
                  px: 4,
                  fontSize: '1.1rem',
                  '&:hover': { bgcolor: '#f1f5f9' },
                }}
              >
                Get Started Free
              </Button>

              <Button
                component={Link}
                to="/browse"
                variant="ghost"
                size="large"
                sx={{
                  color: '#fff',
                  border: '2px solid #fff',
                  height: 56,
                  px: 4,
                  fontSize: '1.1rem',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                }}
              >
                See How It Works
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 12, bgcolor: 'background.default' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
            Everything You Need to Succeed
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
            Powerful tools designed for modern influencers
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Grid item xs={12} md={4} key={index}>
                  <Card
                    sx={{
                      border: '1px solid #2e2e45',
                      borderRadius: 3,
                      height: '100%',
                      transition: 'all 150ms ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 32px rgba(99,102,241,0.3)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          bgcolor: 'rgba(99,102,241,0.2)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                        }}
                      >
                        <Icon size={32} color="#6366f1" />
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section */}
      <Box sx={{ py: 12, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2, textAlign: 'center' }}>
            Simple, Transparent Pricing
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
            Choose the plan that fits your needs
          </Typography>

          <Grid container spacing={3} sx={{ maxWidth: 1000, mx: 'auto' }}>
            {Object.entries(PLAN_FEATURES).map(([planKey, plan]) => (
              <Grid item xs={12} md={4} key={planKey}>
                <Card
                  sx={{
                    border: planKey === 'pro' ? '2px solid' : '1px solid',
                    borderColor: planKey === 'pro' ? 'primary.main' : '#2e2e45',
                    borderRadius: 3,
                    height: '100%',
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {plan.name}
                    </Typography>
                    <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
                      ${plan.price}
                      <Typography component="span" variant="body2" color="text.secondary">
                        /mo
                      </Typography>
                    </Typography>
                    <Button
                      component={Link}
                      to="/register"
                      variant={planKey === 'pro' ? 'primary' : 'secondary'}
                      fullWidth
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 4, bgcolor: 'background.default', borderTop: '1px solid #2e2e45' }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
            © 2026 Influencer Platform. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
