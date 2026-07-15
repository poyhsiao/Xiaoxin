import { Test, TestingModule } from '@nestjs/testing';
import { MetadataService } from './metadata.service';
import axios from 'axios';

jest.mock('axios');

describe('MetadataService', () => {
  let service: MetadataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetadataService],
    }).compile();

    service = module.get<MetadataService>(MetadataService);

    jest.clearAllMocks();
  });

  describe('fetch', () => {
    const allowedUrl = 'https://github.com/test/page';

    it('should extract og:title and og:description from HTML', async () => {
      const html = `
        <html>
          <head>
            <meta property="og:title" content="Page Title" />
            <meta property="og:description" content="Page Description" />
            <meta property="og:image" content="https://example.com/image.png" />
          </head>
          <body></body>
        </html>
      `;
      (axios.get as jest.Mock).mockResolvedValue({ data: html });

      const result = await service.fetch(allowedUrl);

      expect(result.title).toBe('Page Title');
      expect(result.description).toBe('Page Description');
      expect(result.ogImage).toBe('https://example.com/image.png');
    });

    it('should fall back to name attribute if property not found', async () => {
      const html = `
        <html>
          <head>
            <meta name="title" content="Name Title" />
            <meta name="description" content="Name Description" />
          </head>
          <body></body>
        </html>
      `;
      (axios.get as jest.Mock).mockResolvedValue({ data: html });

      const result = await service.fetch(allowedUrl);

      expect(result.title).toBe('Name Title');
      expect(result.description).toBe('Name Description');
    });

    it('should return empty strings on network error', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await service.fetch(allowedUrl);

      expect(result).toEqual({ title: '', description: '', ogImage: '', favicon: '' });
    });

    it('should return empty strings when HTML has no meta tags', async () => {
      (axios.get as jest.Mock).mockResolvedValue({ data: '<html><body></body></html>' });

      const result = await service.fetch(allowedUrl);

      expect(result).toEqual({ title: '', description: '', ogImage: '', favicon: '' });
    });

    it('should reject disallowed domains (SSRF protection)', async () => {
      const result = await service.fetch('http://127.0.0.1/malicious');
      expect(result).toEqual({ title: '', description: '', ogImage: '', favicon: '', error: 'URL not allowed' });
    });

    it('should reject non-HTTPS URLs (SSRF protection)', async () => {
      const result = await service.fetch('http://localhost:6379');
      expect(result).toEqual({ title: '', description: '', ogImage: '', favicon: '', error: 'URL not allowed' });
    });
  });
});
