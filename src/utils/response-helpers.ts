/**
 * Helper utilities for managing API responses
 */

/**
 * Truncate large objects to prevent token limit issues
 * @param obj - The object to truncate
 * @param maxDepth - Maximum depth to traverse
 * @param maxArrayLength - Maximum array length to keep
 * @returns Truncated object
 */
export function truncateLargeObject(obj: any, maxDepth: number = 3, maxArrayLength: number = 10): any {
  if (!obj || typeof obj !== 'object') {
    return obj;
  }

  function truncate(item: any, currentDepth: number): any {
    // Handle null/undefined
    if (item === null || item === undefined) {
      return item;
    }

    // Handle primitives
    if (typeof item !== 'object') {
      return item;
    }

    // Handle dates
    if (item instanceof Date) {
      return item.toISOString();
    }

    // Stop at max depth
    if (currentDepth >= maxDepth) {
      return { truncated: true, type: Array.isArray(item) ? 'array' : 'object' };
    }

    // Handle arrays
    if (Array.isArray(item)) {
      if (item.length > maxArrayLength) {
        return [
          ...item.slice(0, maxArrayLength).map(i => truncate(i, currentDepth + 1)),
          { truncated: true, remaining: item.length - maxArrayLength }
        ];
      }
      return item.map(i => truncate(i, currentDepth + 1));
    }

    // Handle objects
    const result: any = {};
    const keys = Object.keys(item);
    
    for (const key of keys) {
      // Skip very large text fields
      if (typeof item[key] === 'string' && item[key].length > 1000) {
        result[key] = item[key].substring(0, 1000) + '... [truncated]';
      } else {
        result[key] = truncate(item[key], currentDepth + 1);
      }
    }

    return result;
  }

  return truncate(obj, 0);
}

/**
 * Extract essential fields from a channel object
 * @param channel - The channel object
 * @returns Simplified channel object
 */
export function extractEssentialChannelFields(channel: any): any {
  return {
    id: channel.id,
    type: channel.type,
    attributes: {
      channel_code: channel.attributes?.channel_code,
      title: channel.attributes?.title,
      is_active: channel.attributes?.is_active,
      properties: channel.attributes?.properties || [],
      created_at: channel.attributes?.created_at,
      updated_at: channel.attributes?.updated_at,
      // Only include settings keys, not full data
      settings_keys: channel.attributes?.settings ? 
        Object.keys(channel.attributes.settings) : 
        []
    },
    // Simplify relationships
    relationships: channel.relationships ? {
      properties: {
        count: channel.relationships.properties?.data?.length || 0
      },
      mappings: {
        count: channel.relationships.mappings?.data?.length || 0
      }
    } : undefined
  };
}