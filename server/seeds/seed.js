require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User.model');
const Store = require('../models/Store.model');
const Product = require('../models/Product.model');
const Analytics = require('../models/Analytics.model');
const Subscription = require('../models/Subscription.model');
const Notification = require('../models/Notification.model');
const generateReferralCode = require('../utils/generateReferralCode');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
};

const categories = ['Fashion', 'Tech', 'Beauty', 'Health', 'Food', 'Lifestyle', 'Travel', 'Sports'];

const productNames = {
  Fashion: ['Designer Handbag', 'Luxury Watch', 'Sneaker Collection', 'Sunglasses', 'Leather Jacket'],
  Tech: ['Wireless Earbuds', 'Smart Watch', 'Laptop Stand', 'Phone Case', 'Portable Charger'],
  Beauty: ['Skincare Set', 'Makeup Palette', 'Hair Dryer', 'Perfume', 'Face Mask Kit'],
  Health: ['Protein Powder', 'Yoga Mat', 'Fitness Tracker', 'Vitamins', 'Resistance Bands'],
  Food: ['Organic Coffee', 'Protein Bars', 'Cooking Set', 'Spice Collection', 'Tea Sampler'],
  Lifestyle: ['Candle Set', 'Journal', 'Plant Collection', 'Home Decor', 'Throw Blanket'],
  Travel: ['Travel Backpack', 'Luggage Set', 'Travel Pillow', 'Camera Bag', 'Packing Cubes'],
  Sports: ['Running Shoes', 'Gym Bag', 'Water Bottle', 'Sports Watch', 'Workout Gloves'],
};

const seedDatabase = async () => {
  try {
    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Store.deleteMany({});
    await Product.deleteMany({});
    await Analytics.deleteMany({});
    await Subscription.deleteMany({});
    await Notification.deleteMany({});

    // Create admin user
    console.log('👤 Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@platform.com',
      password: 'Admin@1234',
      role: 'admin',
      isVerified: true,
      isActive: true,
    });

    await Subscription.create({
      user: admin._id,
      plan: 'premium',
      status: 'active',
      features: {
        maxProducts: 999999,
        aiGenerations: 999999,
        analyticsRetentionDays: 365,
        scheduledPosts: true,
      },
    });

    // Create influencers
    console.log('👥 Creating influencers...');
    const influencers = [];

    for (let i = 1; i <= 3; i++) {
      const influencer = await User.create({
        name: `Influencer ${i}`,
        username: `influencer${i}`,
        email: `influencer${i}@test.com`,
        password: 'Test@1234',
        role: 'influencer',
        bio: `I'm a passionate content creator focusing on ${categories[i - 1]} and lifestyle.`,
        avatar: `https://i.pravatar.cc/150?img=${i}`,
        socialLinks: {
          instagram: `@influencer${i}`,
          facebook: `influencer${i}`,
          tiktok: `@influencer${i}`,
        },
        isVerified: true,
        isActive: true,
      });

      influencers.push(influencer);

      // Create subscription
      const plan = i === 1 ? 'free' : i === 2 ? 'pro' : 'premium';
      await Subscription.create({
        user: influencer._id,
        plan,
        status: 'active',
        features:
          plan === 'free'
            ? { maxProducts: 5, aiGenerations: 10, analyticsRetentionDays: 30, scheduledPosts: false }
            : plan === 'pro'
            ? { maxProducts: 50, aiGenerations: 100, analyticsRetentionDays: 90, scheduledPosts: true }
            : { maxProducts: 999999, aiGenerations: 999999, analyticsRetentionDays: 365, scheduledPosts: true },
      });

      // Create store
      console.log(`🏪 Creating store for ${influencer.name}...`);
      const store = await Store.create({
        owner: influencer._id,
        name: `${influencer.name}'s Store`,
        username: `store${i}`,
        description: `Welcome to my curated collection of ${categories[i - 1].toLowerCase()} products!`,
        logo: `https://i.pravatar.cc/200?img=${i}`,
        bannerImage: `https://picsum.photos/seed/store${i}/1200/400`,
        theme: {
          primaryColor: ['#6366f1', '#8b5cf6', '#ec4899'][i - 1],
          accentColor: '#f59e0b',
          fontFamily: 'Inter',
        },
        categories: [categories[i - 1], categories[(i + 2) % categories.length]],
        isPublished: true,
        totalProducts: 5,
      });

      // Create products
      console.log(`📦 Creating products for ${store.name}...`);
      const category = categories[i - 1];
      const productList = productNames[category];

      for (let j = 0; j < 5; j++) {
        const product = await Product.create({
          store: store._id,
          owner: influencer._id,
          name: productList[j],
          description: `Amazing ${productList[j].toLowerCase()} that I personally use and love! High quality and great value.`,
          seoDescription: `Discover the best ${productList[j].toLowerCase()} for ${category.toLowerCase()} enthusiasts. Premium quality, tested and recommended by influencers.`,
          hashtags: [
            `#${category.toLowerCase()}`,
            `#${productList[j].replace(/\s+/g, '')}`,
            '#influencer',
            '#shopping',
            '#recommended',
          ],
          category,
          images: [
            `https://picsum.photos/seed/product${i}${j}a/800/800`,
            `https://picsum.photos/seed/product${i}${j}b/800/800`,
          ],
          referralUrl: `https://example.com/product/${i}${j}`,
          referralCode: generateReferralCode(),
          price: Math.floor(Math.random() * 200) + 20,
          displayPrice: `$${Math.floor(Math.random() * 200) + 20}`,
          clickCount: Math.floor(Math.random() * 500),
          viewCount: Math.floor(Math.random() * 1000),
          isActive: true,
        });

        // Create analytics events for the past 30 days
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const eventsCount = Math.floor(Math.random() * 50) + 10;

        for (let k = 0; k < eventsCount; k++) {
          const randomDate = new Date(
            thirtyDaysAgo.getTime() + Math.random() * (Date.now() - thirtyDaysAgo.getTime())
          );

          await Analytics.create({
            product: product._id,
            store: store._id,
            owner: influencer._id,
            event: ['click', 'view', 'share'][Math.floor(Math.random() * 3)],
            ipHash: `hash${Math.random().toString(36).substring(7)}`,
            userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            referrer: 'https://instagram.com',
            country: ['US', 'UK', 'CA', 'AU'][Math.floor(Math.random() * 4)],
            createdAt: randomDate,
          });
        }
      }

      // Update store total clicks
      const totalClicks = await Analytics.countDocuments({ store: store._id, event: 'click' });
      store.totalClicks = totalClicks;
      await store.save();

      // Create sample notifications
      console.log(`🔔 Creating notifications for ${influencer.name}...`);
      await Notification.create([
        {
          user: influencer._id,
          type: 'milestone',
          title: '🎉 Milestone Reached!',
          message: 'Your store just hit 100 total clicks!',
          isRead: false,
          metadata: { storeId: store._id, clicks: 100 },
        },
        {
          user: influencer._id,
          type: 'subscription',
          title: 'Subscription Active',
          message: `Your ${plan} plan is now active!`,
          isRead: true,
          metadata: { plan },
        },
        {
          user: influencer._id,
          type: 'ai_complete',
          title: 'AI Content Generated',
          message: 'Your product descriptions have been generated successfully!',
          isRead: true,
        },
      ]);
    }

    console.log('✅ Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 1 Admin: admin@platform.com / Admin@1234`);
    console.log(`   - 3 Influencers: influencer1@test.com / Test@1234 (and influencer2, influencer3)`);
    console.log(`   - 3 Stores (all published)`);
    console.log(`   - 15 Products (5 per store)`);
    console.log(`   - Analytics events for the past 30 days`);
    console.log(`   - Sample notifications\n`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

// Run seed
connectDB().then(seedDatabase);
