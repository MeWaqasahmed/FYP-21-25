const Subscription = require('../models/Subscription.model');
const User = require('../models/User.model');
const apiResponse = require('../utils/apiResponse');
const { createCheckoutSession, cancelSubscription } = require('../services/stripe.service');
const { sendSubscriptionConfirmation } = require('../services/email.service');
const stripe = require('../config/stripe');

// Plan configurations
const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    priceId: null,
    features: {
      maxProducts: 5,
      aiGenerations: 10,
      analyticsRetentionDays: 30,
      scheduledPosts: false,
    },
  },
  pro: {
    name: 'Pro',
    price: 29,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro',
    features: {
      maxProducts: 50,
      aiGenerations: 100,
      analyticsRetentionDays: 90,
      scheduledPosts: true,
    },
  },
  premium: {
    name: 'Premium',
    price: 99,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID || 'price_premium',
    features: {
      maxProducts: 999999,
      aiGenerations: 999999,
      analyticsRetentionDays: 365,
      scheduledPosts: true,
    },
  },
};

/**
 * Get available plans
 * GET /api/subscription/plans
 */
exports.getPlans = async (req, res, next) => {
  try {
    return apiResponse(res, 200, true, { plans: PLANS });
  } catch (error) {
    next(error);
  }
};

/**
 * Create Stripe checkout session
 * POST /api/subscription/checkout
 */
exports.createCheckout = async (req, res, next) => {
  try {
    const { planName } = req.body;

    if (!['pro', 'premium'].includes(planName)) {
      return apiResponse(res, 400, false, null, 'Invalid plan');
    }

    const user = await User.findById(req.user.userId);
    const plan = PLANS[planName];

    const session = await createCheckoutSession({
      userId: user._id.toString(),
      email: user.email,
      planName,
      priceId: plan.priceId,
    });

    return apiResponse(res, 200, true, { sessionUrl: session.url });
  } catch (error) {
    next(error);
  }
};

/**
 * Stripe webhook handler
 * POST /api/subscription/webhook
 */
exports.handleWebhook = async (req, res, next) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId || session.client_reference_id;
        const planName = session.metadata.planName;

        // Update subscription
        await Subscription.findOneAndUpdate(
          { user: userId },
          {
            plan: planName,
            status: 'active',
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
            currentPeriodStart: new Date(),
            currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            features: PLANS[planName].features,
          },
          { upsert: true, new: true }
        );

        // Send confirmation email
        const user = await User.findById(userId);
        if (user) {
          sendSubscriptionConfirmation(user.email, PLANS[planName].name);
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        // Downgrade to free plan
        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            plan: 'free',
            status: 'cancelled',
            features: PLANS.free.features,
          }
        );

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;

        await Subscription.findOneAndUpdate(
          { stripeSubscriptionId: subscription.id },
          {
            status: subscription.status,
            currentPeriodStart: new Date(subscription.current_period_start * 1000),
            currentPeriodEnd: new Date(subscription.current_period_end * 1000),
          }
        );

        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error.message);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

/**
 * Get current subscription
 * GET /api/subscription/my
 */
exports.getMySubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.userId });

    if (!subscription) {
      return apiResponse(res, 404, false, null, 'Subscription not found');
    }

    return apiResponse(res, 200, true, { subscription });
  } catch (error) {
    next(error);
  }
};

/**
 * Cancel subscription
 * DELETE /api/subscription/cancel
 */
exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.userId });

    if (!subscription || !subscription.stripeSubscriptionId) {
      return apiResponse(res, 404, false, null, 'No active subscription found');
    }

    await cancelSubscription(subscription.stripeSubscriptionId);

    subscription.status = 'cancelled';
    await subscription.save();

    return apiResponse(res, 200, true, null, 'Subscription cancelled successfully');
  } catch (error) {
    next(error);
  }
};
