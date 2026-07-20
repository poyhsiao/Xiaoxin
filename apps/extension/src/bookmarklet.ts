/**
 * Bookmarklet URL generator
 * Generates bookmarklet URLs for one-click bookmark saving
 */

export interface BookmarkletParams {
  title?: string;
  url?: string;
  description?: string;
  collectionId?: string;
}

const MAX_URL_LENGTH = 2000;

export function generateBookmarkletUrl(baseUrl: string, params?: BookmarkletParams): string {
  // Build the bookmarklet JavaScript code
  const jsCode = buildBookmarkletJs(baseUrl, params);

  // If URL would be too long, use POST method
  if (jsCode.length > MAX_URL_LENGTH) {
    return buildPostBookmarklet(baseUrl, params);
  }

  return `javascript:${jsCode}`;
}

function buildBookmarkletJs(baseUrl: string, params?: BookmarkletParams): string {
  // Create the bookmarklet popup code
  const popupHtml = params
    ? `<div style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:white;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.3);z-index:999999;font-family:sans-serif;max-width:400px;">
        <h3 style="margin:0 0 10px">小新書籤</h3>
        <p>正在保存書籤...</p>
      </div>`
    : '';

  // Encode page info
  const pageUrl = params?.url || '(window.location.href)';
  const pageTitle = params?.title || '(document.title)';

  const js = `
    (function(){
      var url=${pageUrl};
      var title=${JSON.stringify(params?.title || '')}||document.title;
      var collectionId=${JSON.stringify(params?.collectionId || '')};
      var apiUrl=${JSON.stringify(baseUrl)};

      fetch(apiUrl + '/api/bookmarklet?url=' + encodeURIComponent(url) + '&title=' + encodeURIComponent(title) + '&collectionId=' + collectionId)
        .then(function(r){return r.json();})
        .then(function(r){
          if(r.success){
            alert('書籤已保存: ' + title);
          } else {
            alert('保存失敗: ' + (r.error||'未知錯誤'));
          }
        })
        .catch(function(e){
          alert('保存書籤失敗');
        });
    })();
  `.replace(/\s+/g, ' ').trim();

  return js;
}

function buildPostBookmarklet(baseUrl: string, params?: BookmarkletParams): string {
  // For long URLs, use a form POST approach via a popup window
  const formId = 'xiaoxin_bookmarklet_form_' + Date.now();
  const html = `
    <html><body>
    <form id="${formId}" action="${baseUrl}/api/bookmarklet" method="POST" style="display:none">
      <input name="url" value="${params?.url || ''}">
      <input name="title" value="${params?.title || ''}">
      <input name="collectionId" value="${params?.collectionId || ''}">
    </form>
    <script>document.getElementById('${formId}').submit();</script>
    </body></html>
  `.replace(/\s+/g, ' ');

  const dataUrl = 'data:text/html;base64,' + btoa(html);
  return `javascript:window.open('${dataUrl}','_blank','width=1,height=1')`;
}

export function parseBookmarkletParams(url: string): BookmarkletParams | null {
  try {
    const urlObj = new URL(url);
    const params: BookmarkletParams = {};

    if (urlObj.searchParams.has('url')) {
      params.url = urlObj.searchParams.get('url') || undefined;
    }
    if (urlObj.searchParams.has('title')) {
      params.title = urlObj.searchParams.get('title') || undefined;
    }
    if (urlObj.searchParams.has('collectionId')) {
      params.collectionId = urlObj.searchParams.get('collectionId') || undefined;
    }
    if (urlObj.searchParams.has('description')) {
      params.description = urlObj.searchParams.get('description') || undefined;
    }

    return params;
  } catch {
    return null;
  }
}

export function isBookmarkletUrl(url: string): boolean {
  return url.startsWith('javascript:');
}

export function createBookmarkletHtml(baseUrl?: string): string {
  const origin = baseUrl || 'https://xiaoxin.app';
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>小新書籤 Bookmarklet</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
    .bookmarklet { display: inline-block; padding: 12px 24px; background: #4A90E2; color: white; border-radius: 6px; cursor: pointer; text-decoration: none; font-size: 16px; }
    .bookmarklet:hover { background: #357ABD; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
    pre { background: #f5f5f5; padding: 15px; border-radius: 6px; overflow-x: auto; }
  </style>
</head>
<body>
  <h1>小新書籤 Bookmarklet</h1>
  <p>將下面的連結拖到書籤工具列，或右鍵點擊加入書籤：</p>
  <p><a class="bookmarklet" href="${generateBookmarkletUrl(origin)}">📚 小新書籤</a></p>
  <p>或在任何頁面點擊書籤工具列的按鈕即可快速保存書籤。</p>
  <h2>使用方式</h2>
  <ol>
    <li>將上方按鈕拖到書籤工具列</li>
    <li>瀏覽任意網頁時，點擊該書籤</li>
    <li>書籤將自動保存到您的 Xiaoxin 帳戶</li>
  </ol>
</body>
</html>`;
}
