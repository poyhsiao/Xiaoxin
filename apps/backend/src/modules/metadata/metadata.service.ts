import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MetadataService {
  private isUrlAllowed(rawUrl: string): boolean {
    let url: URL;

    try {
      url = new URL(rawUrl);
    } catch {
      return false;
    }

    if (url.protocol !== 'https:') return false;

    const host = url.hostname.toLowerCase();

    if (host === 'localhost' || host === '0.0.0.0') return false;

    if (host.endsWith('.onion')) return false;

    if (
      host.startsWith('127.') ||
      host.startsWith('10.') ||
      /^192\.168\./.test(host) ||
      /^172\.(1[6-9]|2\d|3[01])\./.test(host)
    ) {
      return false;
    }

    return true;
  }

  async fetch(url: string) {
    if (!this.isUrlAllowed(url)) {
      return { title: '', description: '', ogImage: '', favicon: '', error: 'URL not allowed' };
    }

    try {
      const { data } = await axios.get(url, {
        timeout: 5000,
        maxRedirects: 0,
        maxContentLength: 2 * 1024 * 1024,
        maxBodyLength: 2 * 1024 * 1024,
      });
      const html = typeof data === 'string' ? data : '';

      const getMeta = (prop: string, attr: 'property' | 'name') => {
        const reAttrFirst = new RegExp(
          `<meta\\s+${attr}=["']${prop}["'][^>]*content=["']([^"']*)["']`,
          'i',
        );
        const reContentFirst = new RegExp(
          `<meta\\s+[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${prop}["']`,
          'i',
        );

        const match = html.match(reAttrFirst) || html.match(reContentFirst);
        return match?.[1] || '';
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
