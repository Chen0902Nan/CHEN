// 监听来自 content script 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    // 打开 popup 页面
    chrome.action.openPopup();
    sendResponse({ success: true });
  }
  return true;
});
