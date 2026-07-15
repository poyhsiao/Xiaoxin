/**
 * URL validation utilities for Xiaoxin extension
 */

/**
 * Validates if a string is a valid URL with proper domain
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false;
    }
    // Check for valid hostname: must have at least one dot or be localhost
    const hostname = parsed.hostname;
    if (!hostname.includes('.') && hostname !== 'localhost') {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Normalizes a URL by trimming whitespace and ensuring protocol
 */
export function normalizeUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';

  // Add https:// if no protocol specified
  if (!trimmed.match(/^https?:\/\//i)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

/**
 * Extracts domain from URL
 */
export function extractDomain(url: string): string | null {
  try {
    const parsed = new URL(normalizeUrl(url));
    return parsed.hostname;
  } catch {
    return null;
  }
}

/**
 * Validates URL and returns normalized version or null
 */
export function validateAndNormalizeUrl(url: string): string | null {
  const normalized = normalizeUrl(url);
  return isValidUrl(normalized) ? normalized : null;
}
