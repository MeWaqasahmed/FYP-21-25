const Product = require('../models/Product.model');
const Store = require('../models/Store.model');
const Subscription = require('../models/Subscription.model');
const generateReferralCode = require('../utils/generateReferralCode');
const apiResponse = require('../utils/apiResponse');

/**
 * Upload new product
 * POST /api/products
 */
exports.uploadProduct = async (req, res, next) => {
  try {
    const { name, description, category, referralUrl, price, displayPrice, seoDescription, hashtags } = req.body;

    // Get user's store
    const store = await Store.findOne({ owner: req.user.userId });
    if (!store) {
      return apiResponse(res, 404, false, null, 'Please create a store first');
    }

    // Check subscription limits
    const subscription = await Subscription.findOne({ user: req.user.userId });
    const productCount = await Product.countDocuments({ owner: req.user.userId, isActive: true });

    if (productCount >= subscription.features.maxProducts) {
      return apiResponse(res, 403, false, null, `Product limit reached. Upgrade your plan to add more products.`);
    }

    // Handle uploaded images
    const images = req.files ? req.files.map((file) => file.path) : [];

    // Generate unique referral code
    const referralCode = generateReferralCode();

    const product = await Product.create({
      store: store._id,
      owner: req.user.userId,
      name,
      description,
      category,
      referralUrl,
      referralCode,
      price,
      displayPrice,
      images,
      seoDescription,
      hashtags: hashtags || [],
    });

    // Update store product count
    store.totalProducts += 1;
    await store.save();

    return apiResponse(res, 201, true, { product }, 'Product uploaded successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get own products with filters
 * GET /api/products/my
 */
exports.getMyProducts = async (req, res, next) => {
  try {
    const { category, search, isActive, page = 1, limit = 12 } = req.query;

    const query = { owner: req.user.userId };

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Product.countDocuments(query);

    return apiResponse(res, 200, true, {
      products,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get single product
 * GET /api/products/:id
 */
exports.getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id).populate('store', 'name username logo');

    if (!product) {
      return apiResponse(res, 404, false, null, 'Product not found');
    }

    return apiResponse(res, 200, true, { product });
  } catch (error) {
    next(error);
  }
};

/**
 * Update product
 * PATCH /api/products/:id
 */
exports.updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, category, referralUrl, price, displayPrice, seoDescription, hashtags, isActive } = req.body;

    const product = await Product.findOne({ _id: id, owner: req.user.userId });

    if (!product) {
      return apiResponse(res, 404, false, null, 'Product not found');
    }

    // Handle new uploaded images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => file.path);
      product.images = [...product.images, ...newImages];
    }

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (category) product.category = category;
    if (referralUrl) product.referralUrl = referralUrl;
    if (price !== undefined) product.price = price;
    if (displayPrice !== undefined) product.displayPrice = displayPrice;
    if (seoDescription !== undefined) product.seoDescription = seoDescription;
    if (hashtags) product.hashtags = hashtags;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    return apiResponse(res, 200, true, { product }, 'Product updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete product (soft delete)
 * DELETE /api/products/:id
 */
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, owner: req.user.userId });

    if (!product) {
      return apiResponse(res, 404, false, null, 'Product not found');
    }

    // Soft delete
    product.isActive = false;
    await product.save();

    // Update store product count
    const store = await Store.findById(product.store);
    if (store) {
      store.totalProducts = Math.max(0, store.totalProducts - 1);
      await store.save();
    }

    return apiResponse(res, 200, true, null, 'Product deleted successfully');
  } catch (error) {
    next(error);
  }
};
