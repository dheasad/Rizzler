/**
 * Data Sanitizer Utility
 * Removes null, undefined, NaN, empty values, and objects without 'value' key from response data
 * Handles different chart types (line, bar, pie, sankey, table, etc.)
 */

/**
 * Removes null, undefined, and empty values from data arrays recursively
 * Handles different chart types (line, bar, pie, sankey, table, etc.)
 * @param {Object} structuredData - Output from structuredData() function
 * @returns {Object} Sanitized structured data
 */
export const sanitizeResponseData = (structuredData) => {
  if (!structuredData || typeof structuredData !== 'object') {
    return structuredData;
  }

  // Clone the structured data to avoid mutation
  const sanitized = {
    datatype: structuredData.datatype,
    data: sanitizeDataArrays(structuredData.data),
    diagramConfig: structuredData.diagramConfig,
    ...(structuredData.options && { options: structuredData.options })
  };

  return sanitized;
};

/**
 * Recursively sanitizes data arrays
 * @param {Array} dataArrays - Array of data arrays from structuredData
 * @returns {Array} Sanitized data arrays
 */
const sanitizeDataArrays = (dataArrays) => {
  if (!Array.isArray(dataArrays)) {
    return dataArrays;
  }

  return dataArrays
    .map(item => {
      // Handle nested arrays (for multi-series charts like line charts)
      if (Array.isArray(item)) {
        const sanitized = sanitizeDataArrays(item);
        // Keep empty arrays - frontend handles them for plot structure
        return sanitized;
      }

      // Handle data objects (individual data points)
      if (item && typeof item === 'object') {
        return sanitizeDataObject(item);
      }

      // Handle primitive values
      return item;
    })
    .filter(item => {
      // Remove null, undefined, and objects without 'value' key
      if (item === null || item === undefined) return false;
      return true;
    });
};

/**
 * Sanitizes individual data objects
 * @param {Object} obj - Data object (e.g., {value, category, year})
 * @returns {Object|null} Sanitized object or null if invalid
 */
const sanitizeDataObject = (obj) => {
  // Check if this is a data point object that should have a 'value' key
  // Only apply this check to objects that look like data points (have year, category, etc.)
  const isDataPoint = obj.hasOwnProperty('year') || obj.hasOwnProperty('category') || 
                     obj.hasOwnProperty('x') || obj.hasOwnProperty('y');
  
  if (isDataPoint) {
    // Check if value is missing, undefined, null, or NaN
    if (!obj.hasOwnProperty('value') || obj.value === undefined || obj.value === null || isNaN(obj.value)) {
      return null; // Filter out data points without valid 'value'
    }
  }

  const sanitized = {};
  let hasValidData = false;

  for (const key in obj) {
    const value = obj[key];

    // Skip null and undefined values
    if (value === null || value === undefined) {
      continue;
    }

    // For value fields, skip if NaN or Infinity
    if (key === 'value') {
      if (isNaN(value) || !isFinite(value)) {
        continue;
      }
      // Keep 0 values as they might be meaningful
      sanitized[key] = value;
      hasValidData = true;
    }
    // For arrays (nested structures)
    else if (Array.isArray(value)) {
      const sanitizedArray = sanitizeDataArrays(value);
      if (sanitizedArray.length > 0) {
        sanitized[key] = sanitizedArray;
        hasValidData = true;
      }
    }
    // For objects (nested structures)
    else if (typeof value === 'object') {
      const sanitizedObj = sanitizeDataObject(value);
      if (sanitizedObj && Object.keys(sanitizedObj).length > 0) {
        sanitized[key] = sanitizedObj;
        hasValidData = true;
      }
    }
    // For primitive values (strings, numbers, booleans)
    else {
      sanitized[key] = value;
      hasValidData = true;
    }
  }

  // Return null if no valid data found
  return hasValidData ? sanitized : null;
};

/**
 * Wrapper function for easier usage in controllers
 * Use this right before res.send() or res.json()
 * @param {*} data - Data to clean (can be structured or unstructured)
 * @returns {*} Cleaned data
 */
export const cleanResponseData = (data) => {
  // Handle both structured and non-structured data
  // Structured data has: datatype, data, diagramConfig, and optionally options
  if (data && data.datatype && data.data && data.diagramConfig) {
    return sanitizeResponseData(data);
  }
  
  // If not structured data, return as is
  return data;
};

