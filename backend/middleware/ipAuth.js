/**
 * IP Whitelist Authentication Middleware
 * Only allows uploads from whitelisted IP addresses (development only)
 * 
 * In production (NODE_ENV=production), IP check is bypassed
 * Security relies on ADMIN_SECRET header only
 *
 * Environment Variables:
 * - WHITELISTED_IPS: comma-separated list of allowed IP addresses (dev only)
 *   Example: 192.168.1.100,192.168.1.101,127.0.0.1
 * - NODE_ENV: set to 'production' to disable IP whitelist
 */

export const ipAuth = (req, res, next) => {
  // Skip IP check in production - rely on ADMIN_SECRET instead
  if (process.env.NODE_ENV === 'production') {
    console.log('✅ Running in production mode - IP whitelist disabled');
    return next();
  }

  const whitelistedIpsStr = process.env.WHITELISTED_IPS || '';
  
  if (!whitelistedIpsStr) {
    console.warn('⚠️  WARNING: WHITELISTED_IPS not set. IP check bypassed.');
    return next();
  }

  const whitelistedIps = whitelistedIpsStr
    .split(',')
    .map((ip) => ip.trim());

  // Get client IP address (handles proxies like nginx)
  const clientIp =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip;

  // Normalize IPv6 loopback to IPv4
  const normalizedClientIp = clientIp === '::1' ? '127.0.0.1' : clientIp;

  console.log(`📍 Request from IP: ${normalizedClientIp}`);
  console.log(`✅ Whitelisted IPs: ${whitelistedIps.join(', ')}`);

  if (!whitelistedIps.includes(normalizedClientIp)) {
    return res.status(403).json({
      success: false,
      error: `Unauthorized: IP address ${normalizedClientIp} is not whitelisted`,
      clientIp: normalizedClientIp,
      whitelistedIps: whitelistedIps,
    });
  }

  console.log(`✅ IP ${normalizedClientIp} is whitelisted. Proceeding...`);
  next();
};
