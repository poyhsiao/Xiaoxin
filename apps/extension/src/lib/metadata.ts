export interface PageMetadata {
  url: string;
  title?: string;
  description?: string;
  ogImage?: string;
  favicon?: string;
}

// Blocked schemes for SSRF prevention
const BLOCKED_SCHEMES = ['javascript', 'data', 'blob', 'file'];
// Blocked hosts (private networks)
const BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0', '::1', '169.254.169.254', 'metadata.google.internal'];

function isUrlSafe(url: string): boolean {
  try {
    const parsed = new URL(url);
    // Check scheme
    if (BLOCKED_SCHEMES.includes(parsed.protocol.replace(':', ''))) {
      return false;
    }
    // Check host against blocked list
    const hostname = parsed.hostname.toLowerCase();
    if (BLOCKED_HOSTS.some(blocked => hostname === blocked || hostname.endsWith('.internal') || hostname.endsWith('.metadata'))) {
      return false;
    }
    // Block private IP ranges (simplified check)
    if (/^(10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.|192\.168\.)/.test(hostname)) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function getCurrentTab(): Promise<chrome.tabs.Tab | null> {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

export async function fetchMetadata(url: string): Promise<PageMetadata> {
  // SSRF protection: validate URL before fetching
  if (!isUrlSafe(url)) {
    console.warn('SSRF protection: blocked unsafe URL', url);
    return { url, title: new URL(url).hostname };
  }

  try {
    const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const title = doc.querySelector('meta[property="og:title"]')?.getAttribute('content')
      || doc.querySelector('title')?.textContent
      || new URL(url).hostname;

    const description = doc.querySelector('meta[property="og:description"]')?.getAttribute('content')
      || doc.querySelector('meta[name="description"]')?.getAttribute('content')
      || '';

    const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')
      || '';

    const favicon = doc.querySelector('link[rel="icon"]')?.getAttribute('href')
      || doc.querySelector('link[rel="shortcut icon"]')?.getAttribute('href')
      || `https://www.google.com/s2/favicons?domain=${new URL(url).hostname}&sz=32`;

    return {
      url,
      title,
      description,
      ogImage: ogImage.startsWith('http') ? ogImage : new URL(ogImage, url).href,
      favicon: favicon.startsWith('http') ? favicon : new URL(favicon, url).href,
    };
  } catch {
    return { url, title: new URL(url).hostname };
  }
}

export function getFaviconForUrl(url: string): string {
  try {
    const hostname = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
  } catch {
    return '';
  }
}
