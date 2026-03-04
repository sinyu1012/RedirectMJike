// background.js - Service Worker

// 安装时初始化默认设置
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get({ enabled: true }, function (data) {
    if (data.enabled === undefined) {
      chrome.storage.sync.set({ enabled: true });
    }
  });
});

// 处理来自 content script 的消息
chrome.runtime.onMessage.addListener(function (message, sender) {
  if (message.type === "redirected") {
    // 在扩展图标上显示 badge 提示
    chrome.action.setBadgeText({ text: "✓", tabId: sender.tab?.id });
    chrome.action.setBadgeBackgroundColor({
      color: "#FFE411",
      tabId: sender.tab?.id,
    });
  }
});
