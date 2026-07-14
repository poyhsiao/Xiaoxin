import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MetadataService {
  async fetch(url: string) {
    try {
      const { data } = await axios.get(url, { timeout: 5000 });
      const html = typeof data === 'string' ? data : '';

      const getMeta = (prop: string) => {
        const match = html.match(new RegExp(`<meta[^>]*${prop}=["']([^"']*)["'][^>]*>`, 'i'));
        return match?.[1];
      };

      return {
        title: getMeta('property="og:title"') || getMeta('name="title"') || '',
        description: getMeta('property="og:description"') || getMeta('name="description"') || '',
        ogImage: getMeta('property="og:image"') || '',
        favicon: '',
      };
    } catch {
      return { title: '', description: '', ogImage: '', favicon: '' };
    }
  }
}
