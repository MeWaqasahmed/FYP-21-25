import { Box, Typography, Grid, Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { Check, Crown } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { subscriptionAPI } from '../../api/subscription';
import { useTitle } from '../../hooks/useTitle';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { PLAN_FEATURES } from '../../constants/planTiers';
import toast from 'react-hot-toast';

export default function SubscriptionPlans() {
  useTitle('Subscription');

  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => subscriptionAPI.getMy(),
  });

  const { data: plansData } = useQuery({
    queryKey: ['plans'],
    queryFn: () => subscriptionAPI.getPlans(),
  });

  const checkoutMutation = useMutation({
    mutationFn: subscriptionAPI.createCheckout,
    onSuccess: (response) => {
      window.location.href = response.data.data.sessionUrl;
    },
    onError: () => {
      toast.error('Failed to create checkout session');
    },
  });

  const currentSubscription = subscriptionData?.data?.data?.subscription;
  const plans = plansData?.data?.data?.plans || {};

  const handleUpgrade = (planName) => {
    checkoutMutation.mutate({ planName });
  };

  if (isLoading) {
    return (
      <PageWrapper title="Subscription">
        <Loader />
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="Subscription">
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
          Choose Your Plan
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 6, textAlign: 'center' }}>
          Upgrade to unlock more features and grow your business
        </Typography>

        <Grid container spacing={3} sx={{ maxWidth: 1200, mx: 'auto' }}>
          {Object.entries(PLAN_FEATURES).map(([planKey, plan]) => {
            const isCurrentPlan = currentSubscription?.plan === planKey;
            const isPro = planKey === 'pro';

            return (
              <Grid item xs={12} md={4} key={planKey}>
                <Card
                  sx={{
                    border: isPro ? '2px solid' : '1px solid',
                    borderColor: isPro ? 'primary.main' : '#2e2e45',
                    borderRadius: 3,
                    position: 'relative',
                    height: '100%',
                    background: isPro
                      ? 'linear-gradient(145deg, rgba(99,102,241,0.1) 0%, #1a1a24 100%)'
                      : 'linear-gradient(145deg, #1a1a24 0%, #252535 100%)',
                    boxShadow: isPro ? '0 0 40px rgba(99,102,241,0.3)' : 'none',
                  }}
                >
                  {isPro && (
                    <Chip
                      label="POPULAR"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: 'primary.main',
                        color: '#fff',
                        fontWeight: 700,
                      }}
                    />
                  )}

                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                      <Crown size={24} color={isPro ? '#6366f1' : '#64748b'} />
                      <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {plan.name}
                      </Typography>
                    </Box>

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h3" sx={{ fontWeight: 800 }}>
                        ${plan.price}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        per month
                      </Typography>
                    </Box>

                    {isCurrentPlan && (
                      <Chip
                        label="Current Plan"
                        size="small"
                        sx={{
                          mb: 3,
                          bgcolor: 'success.main',
                          color: '#fff',
                          fontWeight: 600,
                        }}
                      />
                    )}

                    <List sx={{ mb: 3 }}>
                      {plan.features.map((feature, index) => (
                        <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <Check size={20} color="#22c55e" />
                          </ListItemIcon>
                          <ListItemText
                            primary={feature}
                            primaryTypographyProps={{ variant: 'body2' }}
                          />
                        </ListItem>
                      ))}
                    </List>

                    <Button
                      variant={isPro ? 'primary' : 'secondary'}
                      fullWidth
                      disabled={isCurrentPlan || checkoutMutation.isPending}
                      onClick={() => handleUpgrade(planKey)}
                      sx={{ height: 48 }}
                    >
                      {isCurrentPlan
                        ? 'Current Plan'
                        : checkoutMutation.isPending
                        ? 'Processing...'
                        : planKey === 'free'
                        ? 'Current Plan'
                        : 'Upgrade'}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </PageWrapper>
  );
}
