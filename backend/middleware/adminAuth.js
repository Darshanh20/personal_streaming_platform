/**
 * Admin Authentication Middleware
 * Validates x-admin-key header against ADMIN_SECRET
 * No login, no JWT - only secret key validation
 */

export const adminAuth = (req, res, next) => {
  const adminKey = req.headers['x-admin-key'];
  const expectedKey = process.env.ADMIN_SECRET;

  // Check if key exists
  if (!adminKey) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized: Missing x-admin-key header',
    });
  }

  // Check if key matches
  if (adminKey !== expectedKey) {
    return res.status(403).json({
      success: false,
      error: 'Unauthorized: Invalid admin key',
    });
  }

  // Key is valid, proceed
  next();
};

