// popup.js - 管理页面逻辑

document.addEventListener("DOMContentLoaded", function () {
  const enableToggle = document.getElementById("enableToggle");
  const currentTabSection = document.getElementById("currentTabSection");
  const currentTabBtn = document.getElementById("currentTabBtn");
  const urlInput = document.getElementById("urlInput");
  const convertResult = document.getElementById("convertResult");
  const resultLink = document.getElementById("resultLink");
  const copyBtn = document.getElementById("copyBtn");

  // 1. 加载开关状态
  chrome.storage.sync.get({ enabled: true }, function (data) {
    enableToggle.checked = data.enabled;
  });

  enableToggle.addEventListener("change", function () {
    chrome.storage.sync.set({ enabled: enableToggle.checked });
  });

  // 2. 检测当前标签页
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (!tab || !tab.url) return;

    const url = tab.url;
    const converted = convertUrl(url);
    if (converted) {
      currentTabSection.style.display = "";
      const isMobile = url.includes("m.okjike.com");
      currentTabBtn.textContent = isMobile
        ? "在 Web 版打开"
        : "在手机版打开";
      currentTabBtn.addEventListener("click", function () {
        chrome.tabs.update(tab.id, { url: converted });
        window.close();
      });
    }
  });

  // 3. 链接转换器
  urlInput.addEventListener("input", function () {
    const url = urlInput.value.trim();
    if (!url) {
      convertResult.style.display = "none";
      return;
    }

    const converted = convertUrl(url);
    if (converted) {
      convertResult.style.display = "";
      resultLink.href = converted;
      resultLink.textContent = converted;
    } else {
      convertResult.style.display = "none";
    }
  });

  copyBtn.addEventListener("click", function () {
    const url = resultLink.href;
    navigator.clipboard.writeText(url).then(function () {
      copyBtn.textContent = "已复制";
      setTimeout(function () {
        copyBtn.textContent = "复制";
      }, 1500);
    });
  });
});
