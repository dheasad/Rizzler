import { cleanResponseData } from "../utils/dataSanitizer.js";

/**
 * Middleware to automatically sanitize all responses
 * Removes null, undefined, NaN, and empty values from response data
 * Apply this globally or to specific routes
 */
export const sanitizeResponseMiddleware = (req, res, next) => {
  // Store original send and json methods
  const originalSend = res.send.bind(res);
  const originalJson = res.json.bind(res);

  // Override send method
  res.send = function(data) {
    // Only sanitize if data is an object (skip for strings, buffers, etc.)
    if (data && typeof data === 'object' && !Buffer.isBuffer(data)) {
      const cleanedData = cleanResponseData(data);
      return originalSend(cleanedData);
    }
    return originalSend(data);
  };

  // Override json method
  res.json = function(data) {
    // Sanitize JSON responses
    if (data && typeof data === 'object') {
      const cleanedData = cleanResponseData(data);
      return originalJson(cleanedData);
    }
    return originalJson(data);
  };

  next();
};

