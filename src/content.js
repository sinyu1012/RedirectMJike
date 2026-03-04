// content.js - 在 web.okjike.com 上检测登录跳转，自动重定向到 m.okjike.com
// 运行时机：document_start（SPA 框架加载前）

(function () {
  "use strict";

  const STORAGE_KEY = "jike_redirect_post_id";
  let savedPostInfo = null;
  let redirected = false;

  // 捕获原始 URL 中的帖子信息
  function captureOriginalUrl() {
    const url = window.location.href;
    const postInfo = extractPostIdFromWebUrl(url);
    if (postInfo) {
      savedPostInfo = postInfo;
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(postInfo));
      } catch (e) {
        // sessionStorage 不可用时忽略
      }
    } else {
      // 尝试从 sessionStorage 恢复
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY);
        if (stored) savedPostInfo = JSON.parse(stored);
      } catch (e) {
        // 忽略
      }
    }
  }

  function doRedirect() {
    if (redirected || !savedPostInfo) return;

    chrome.storage.sync.get({ enabled: true }, function (data) {
      if (!data.enabled || redirected) return;
      redirected = true;

      // 标记未登录状态，供 content-mobile.js 使用
      chrome.storage.local.set({ webLoggedIn: false });

      let mobileUrl;
      if (savedPostInfo.type === "repost") {
        mobileUrl = `https://m.okjike.com/reposts/${savedPostInfo.id}`;
      } else {
        mobileUrl = `https://m.okjike.com/originalPosts/${savedPostInfo.id}`;
      }

      // 清理 sessionStorage
      try {
        sessionStorage.removeItem(STORAGE_KEY);
      } catch (e) {
        // 忽略
      }

      // 通知 background 更新 badge
      chrome.runtime.sendMessage({ type: "redirected", url: mobileUrl });

      // 跳转（不留历史记录）
      window.location.replace(mobileUrl);
    });
  }

  function checkForLoginRedirect() {
    if (isLoginUrl(window.location.href)) {
      doRedirect();
    }
  }

  // 1. 捕获原始 URL
  captureOriginalUrl();

  // 2. Monkey-patch history API
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function () {
    originalPushState.apply(this, arguments);
    checkForLoginRedirect();
  };

  history.replaceState = function () {
    originalReplaceState.apply(this, arguments);
    checkForLoginRedirect();
  };

  // 3. 监听 popstate
  window.addEventListener("popstate", checkForLoginRedirect);

  // 4. 定时兜底检查
  let checkCount = 0;
  const maxChecks = 12;
  let loginDetected = false;
  const checkInterval = setInterval(function () {
    checkCount++;
    checkForLoginRedirect();

    // 3 秒后提前判定：如果 URL 不是 login 且页面已开始加载，乐观存 true
    if (
      checkCount === 6 &&
      !redirected &&
      !loginDetected &&
      savedPostInfo &&
      document.readyState !== "loading" &&
      !isLoginUrl(window.location.href)
    ) {
      loginDetected = true;
      chrome.storage.local.set({ webLoggedIn: true });
    }

    if (checkCount >= maxChecks || redirected) {
      clearInterval(checkInterval);
      if (!redirected) {
        // 最终确认：没有跳转到 login → 用户已登录
        if (savedPostInfo) {
          chrome.storage.local.set({ webLoggedIn: true });
        }
        try {
          sessionStorage.removeItem(STORAGE_KEY);
        } catch (e) {
          // 忽略
        }
      }
    }
  }, 500);

  // 监听设置变化，实时响应
  chrome.storage.onChanged.addListener(function (changes) {
    if (changes.enabled && !changes.enabled.newValue) {
      // 用户关闭了开关，停止检查
      redirected = true;
      clearInterval(checkInterval);
    }
  });
})();
