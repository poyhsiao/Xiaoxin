import { Injectable } from '@nestjs/common';
import axios from 'axios';

const SSRF_BLOCK_PATTERNS = [
  /^http:\/\//i,
  /^https?:\/\/localhost/i,
  /^https?:\/\/127\./i,
  /^https?:\/\/10\./i,
  /^https?:\/\/172\.(1[6-9]|2\d|3[01])\./i,
  /^https?:\/\/192\.168\./i,
  /^https?:\/\/0\.0\.0\.0/i,
  /^https?:\/\/\w*\.onion/i,
];

@Injectable()
export class MetadataService {
  private isUrlAllowed(url: string): boolean {
    if (!url.startsWith('https://')) return false;
    return !SSRF_BLOCK_PATTERNS.some((p) => p.test(url));
  }

  async fetch(url: string) {
    if (!this.isUrlAllowed(url)) {
      return { title: '', description: '', ogImage: '', favicon: '', error: 'URL not allowed' };
    }

    try {
      const { data } = await axios.get(url, { timeout: 5000 });
      const html = typeof data === 'string' ? data : '';

      const getMeta = (prop: string, attr: 'property' | 'name') => {
        const re = new RegExp(`<meta\\s+${attr}=["']${prop}["'][^>]*content=["']([^"']*)["'][^>]*>|<meta\\s+[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${prop}["'][^>]*>`, 'i');
        const match = html.match(re);
        return match?.[1] || match?.[2] || '';
      };

      return {
        title: getMeta('og:title', 'property') || getMeta('title', 'name') || '',
        description: getMeta('og:description', 'property') || getMeta('description', 'name') || '',
        ogImage: getMeta('og:image', 'property') || '',
        favicon: '',
      };
    } catch {
      return { title: '', description: '', ogImage: '', favicon: '' };
    }
  }
}
