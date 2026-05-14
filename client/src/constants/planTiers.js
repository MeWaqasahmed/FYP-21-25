export const PLAN_TIERS = {
  FREE: 'free',
  PRO: 'pro',
  PREMIUM: 'premium',
};

export const PLAN_FEATURES = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      '5 Products',
      '10 AI Generations/month',
      '30 Days Analytics',
      'Basic Support',
    ],
  },
  pro: {
    name: 'Pro',
    price: 29,
    features: [
      '50 Products',
      '100 AI Generations/month',
      '90 Days Analytics',
      'Scheduled Posts',
      'Priority Support',
      'Custom Store Theme',
    ],
  },
  premium: {
    name: 'Premium',
    price: 99,
    features: [
      'Unlimited Products',
      'Unlimited AI Generations',
      '1 Year Analytics',
      'Scheduled Posts',
      '24/7 Premium Support',
      'Custom Store Theme',
      'Advanced Analytics',
      'API Access',
    ],
  },
};
