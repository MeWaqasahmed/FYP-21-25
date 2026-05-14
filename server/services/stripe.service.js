const stripe = require('../config/stripe');

/**
 * Create Stripe checkout session
 */
async function createCheckoutSession({ userId, email, planName, priceId }) {
  try {
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      client_reference_id: userId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription`,
      metadata: {
        userId,
        planName,
      },
    });

    return session;
  } catch (error) {
    console.error('Stripe checkout error:', error.message);
    throw new Error('Failed to create checkout session');
  }
}

/**
 * Cancel subscription
 */
async function cancelSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.cancel(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Stripe cancel error:', error.message);
    throw new Error('Failed to cancel subscription');
  }
}

/**
 * Get subscription details
 */
async function getSubscription(subscriptionId) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    return subscription;
  } catch (error) {
    console.error('Stripe retrieve error:', error.message);
    throw new Error('Failed to retrieve subscription');
  }
}

module.exports = {
  createCheckoutSession,
  cancelSubscription,
  getSubscription,
};
