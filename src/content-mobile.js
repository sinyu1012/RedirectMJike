// content-mobile.js - 在 m.okjike.com 上检测已登录 Web 版，自动跳转到 web.okjike.com
// 运行时机：document_start

(function () {
  "use strict";

  var postInfo = extractPostIdFromMobileUrl(window.location.href);
  if (!postInfo) return;

  chrome.storage.sync.get({ mobileToWebEnabled: true }, function (syncData) {
    if (!syncData.mobileToWebEnabled) return;

    chrome.storage.local.get({ webLoggedIn: false }, function (localData) {
      if (!localData.webLoggedIn) return;

      var webUrl;
      if (postInfo.type === "repost") {
        webUrl = "https://web.okjike.com/repost/" + postInfo.id;
      } else {
        webUrl = "https://web.okjike.com/originalPost/" + postInfo.id;
      }

      chrome.runtime.sendMessage({ type: "redirected", url: webUrl });
      window.location.replace(webUrl);
    });
  });
})();
