import { createBookmark } from '../lib/api';

export default defineBackground(() => {
  console.log('Xiaoxin extension background loaded');

  // Handle messages from popup/sidebar
  browser.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.type === 'SAVE_BOOKMARK') {
      const { url, title, description, collectionId } = request.data;

      createBookmark({ url, title, description, collectionId })
        .then(bookmark => sendResponse({ success: true, bookmark }))
        .catch(error => sendResponse({ success: false, error: error.message }));

      return true;
    }
  });

  // Context menu
  browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
      id: 'save-to-xiaoxin',
      title: '📌 儲存到小新書籤',
      contexts: ['page', 'link'],
    });
  });

  browser.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'save-to-xiaoxin') {
      const url = info.linkUrl || info.pageUrl || '';
      const title = info.pageTitle || '';

      browser.runtime.sendMessage({
        type: 'OPEN_POPUP_WITH_BOOKMARK',
        data: { url, title },
      });
    }
  });
});
