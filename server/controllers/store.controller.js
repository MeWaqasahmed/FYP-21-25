const Store = require('../models/Store.model');
const Product = require('../models/Product.model');
const apiResponse = require('../utils/apiResponse');

/**
 * Create store (one per influencer)
 * POST /api/store
 */
exports.createStore = async (req, res, next) => {
  try {
    const { name, username, description, logo, bannerImage, theme, categories } = req.body;

    // Check if user already has a store
    const existingStore = await Store.findOne({ owner: req.user.userId });
    if (existingStore) {
      return apiResponse(res, 409, false, null, 'You already have a store');
    }

    // Check if username is taken
    const usernameExists = await Store.findOne({ username });
    if (usernameExists) {
      return apiResponse(res, 409, false, null, 'Store username already taken');
    }

    const store = await Store.create({
      owner: req.user.userId,
      name,
      username,
      description,
      logo,
      bannerImage,
      theme,
      categories,
    });

    return apiResponse(res, 201, true, { store }, 'Store created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get own store
 * GET /api/store/my
 */
exports.getMyStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user.userId }).populate('owner', 'name email avatar');

    if (!store) {
      return apiResponse(res, 404, false, null, 'Store not found');
    }

    return apiResponse(res, 200, true, { store });
  } catch (error) {
    next(error);
  }
};

/**
 * Update store
 * PATCH /api/store
 */
exports.updateStore = async (req, res, next) => {
  try {
    const { name, description, logo, bannerImage, theme, categories, isPublished } = req.body;

    const store = await Store.findOneAndUpdate(
      { owner: req.user.userId },
      {
        ...(name && { name }),
        ...(description !== undefined && { description }),
        ...(logo !== undefined && { logo }),
        ...(bannerImage !== undefined && { bannerImage }),
        ...(theme && { theme }),
        ...(categories && { categories }),
        ...(isPublished !== undefined && { isPublished }),
      },
      { new: true, runValidators: true }
    );

    if (!store) {
      return apiResponse(res, 404, false, null, 'Store not found');
    }

    return apiResponse(res, 200, true, { store }, 'Store updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Delete store (soft delete)
 * DELETE /api/store
 */
exports.deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user.userId });

    if (!store) {
      return apiResponse(res, 404, false, null, 'Store not found');
    }

    // Soft delete all products
    await Product.updateMany({ store: store._id }, { isActive: false });

    // Delete store
    await Store.findByIdAndDelete(store._id);

    return apiResponse(res, 200, true, null, 'Store deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get public store by username
 * GET /api/store/:username
 */
exports.getPublicStore = async (req, res, next) => {
  try {
    const { username } = req.params;

    const store = await Store.findOne({ username, isPublished: true }).populate('owner', 'name avatar bio socialLinks');

    if (!store) {
      return apiResponse(res, 404, false, null, 'Store not found');
    }

    // Get active products
    const products = await Product.find({ store: store._id, isActive: true })
      .select('name description category images referralCode clickCount price displayPrice')
      .sort({ createdAt: -1 });

    return apiResponse(res, 200, true, { store, products });
  } catch (error) {
    next(error);
  }
};

/**
 * Browse all public stores
 * GET /api/store/browse
 */
exports.browseStores = async (req, res, next) => {
  try {
    const { search, category, page = 1, limit = 12 } = req.query;

    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      query.categories = category;
    }

    const stores = await Store.find(query)
      .populate('owner', 'name avatar')
      .sort({ totalClicks: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Store.countDocuments(query);

    return apiResponse(res, 200, true, {
      stores,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    next(error);
  }
};
