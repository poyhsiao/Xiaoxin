import { describe, it, expect } from 'vitest';
import {
  isValidUrl,
  normalizeUrl,
  extractDomain,
  validateAndNormalizeUrl,
} from '../src/url';

describe('URL Validation', () => {
  describe('isValidUrl', () => {
    it('should return true for valid HTTP URLs', () => {
      expect(isValidUrl('http://example.com')).toBe(true);
    });

    it('should return true for valid HTTPS URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
    });

    it('should return true for URLs with paths', () => {
      expect(isValidUrl('https://example.com/path/to/page')).toBe(true);
    });

    it('should return true for URLs with query params', () => {
      expect(isValidUrl('https://example.com?query=value')).toBe(true);
    });

    it('should return true for URLs with port', () => {
      expect(isValidUrl('https://example.com:8080')).toBe(true);
    });

    it('should return false for invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
    });

    it('should return false for empty string', () => {
      expect(isValidUrl('')).toBe(false);
    });

    it('should return false for null/undefined', () => {
      expect(isValidUrl(null as unknown as string)).toBe(false);
      expect(isValidUrl(undefined as unknown as string)).toBe(false);
    });

    it('should return false for FTP URLs', () => {
      expect(isValidUrl('ftp://example.com')).toBe(false);
    });

    it('should return false for file:// URLs', () => {
      expect(isValidUrl('file:///path/to/file')).toBe(false);
    });

    it('should return true for localhost', () => {
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://localhost')).toBe(true);
    });

    it('should return false for protocol relative URLs', () => {
      expect(isValidUrl('//example.com')).toBe(false);
    });

    it('should return false for URLs without domain (no dot, not localhost)', () => {
      expect(isValidUrl('https://example')).toBe(false);
    });
  });

  describe('normalizeUrl', () => {
    it('should add https:// for URLs without protocol', () => {
      expect(normalizeUrl('example.com')).toBe('https://example.com');
    });

    it('should preserve existing https://', () => {
      expect(normalizeUrl('https://example.com')).toBe('https://example.com');
    });

    it('should preserve existing http://', () => {
      expect(normalizeUrl('http://example.com')).toBe('http://example.com');
    });

    it('should trim whitespace', () => {
      expect(normalizeUrl('  https://example.com  ')).toBe('https://example.com');
    });

    it('should return empty string for empty input', () => {
      expect(normalizeUrl('')).toBe('');
      expect(normalizeUrl('   ')).toBe('');
    });
  });

  describe('extractDomain', () => {
    it('should extract domain from URL', () => {
      expect(extractDomain('https://example.com/path')).toBe('example.com');
    });

    it('should extract domain with subdomain', () => {
      expect(extractDomain('https://sub.example.com/page')).toBe('sub.example.com');
    });

    it('should extract domain with port', () => {
      expect(extractDomain('http://localhost:3000')).toBe('localhost');
    });

    it('should handle protocol-relative URLs', () => {
      expect(extractDomain('//example.com/path')).toBe('example.com');
    });

    it('should handle punycode domains', () => {
      expect(extractDomain('https://xn--bcher-kva.example/path')).toBe('xn--bcher-kva.example');
    });

    it('should return null for empty string', () => {
      expect(extractDomain('')).toBe(null);
    });
  });

  describe('validateAndNormalizeUrl', () => {
    it('should return normalized URL for valid input', () => {
      expect(validateAndNormalizeUrl('example.com')).toBe('https://example.com');
    });

    it('should return normalized URL for valid full URL', () => {
      expect(validateAndNormalizeUrl('https://example.com')).toBe('https://example.com');
    });

    it('should trim whitespace and add protocol if missing', () => {
      expect(validateAndNormalizeUrl('  example.com/path  ')).toBe('https://example.com/path');
    });

    it('should return null for empty string', () => {
      expect(validateAndNormalizeUrl('')).toBe(null);
    });
  });
});
