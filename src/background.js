// background.js - Service Worker

// 安装时初始化默认设置
chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.get(
    { enabled: true, mobileToWebEnabled: true },
    function (data) {
      var defaults = {};
      if (data.enabled === undefined) defaults.enabled = true;
      if (data.mobileToWebEnabled === undefined)
        defaults.mobileToWebEnabled = true;
      if (Object.keys(defaults).length > 0) {
        chrome.storage.sync.set(defaults);
      }
    }
  );
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
