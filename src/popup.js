// popup.js - 管理页面逻辑

document.addEventListener("DOMContentLoaded", function () {
  const enableToggle = document.getElementById("enableToggle");
  const currentTabSection = document.getElementById("currentTabSection");
  const currentTabBtn = document.getElementById("currentTabBtn");
  const copyShareBtn = document.getElementById("copyShareBtn");
  const pageInfo = document.getElementById("pageInfo");
  const pageTitle = document.getElementById("pageTitle");
  const pageDesc = document.getElementById("pageDesc");
  const shareLinks = document.getElementById("shareLinks");
  const webLink = document.getElementById("webLink");
  const mobileLink = document.getElementById("mobileLink");
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
    if (!converted) return;

    currentTabSection.style.display = "";

    const isMobile = url.includes("m.okjike.com");
    const webUrl = isMobile ? converted : url;
    const mobileUrl = isMobile ? url : converted;

    // 显示跳转按钮
    currentTabBtn.style.display = "";
    currentTabBtn.textContent = isMobile ? "在 Web 版打开" : "在手机版打开";
    currentTabBtn.addEventListener("click", function () {
      chrome.tabs.update(tab.id, { url: converted });
      window.close();
    });

    // 显示双版本链接
    shareLinks.style.display = "";
    webLink.href = webUrl;
    webLink.textContent = webUrl;
    mobileLink.href = mobileUrl;
    mobileLink.textContent = mobileUrl;

    // 提取页面标题和摘要
    chrome.scripting
      .executeScript({
        target: { tabId: tab.id },
        func: function () {
          var title = document.title || "";
          var desc =
            (
              document.querySelector('meta[property="og:description"]') ||
              document.querySelector('meta[name="description"]')
            )?.content || "";
          return { title: title, desc: desc };
        },
      })
      .then(function (results) {
        var data = results?.[0]?.result;
        if (!data) return;

        var title = data.title.replace(/\s*-\s*即刻$/, "").trim();
        var desc = data.desc.trim();

        if (title || desc) {
          pageInfo.style.display = "";
          pageTitle.textContent = title || "(无标题)";
          if (desc) {
            pageDesc.textContent = desc;
            pageDesc.style.display = "";
          }
        }

        // 显示复制分享文案按钮
        copyShareBtn.style.display = "";
        copyShareBtn.addEventListener("click", function () {
          var text = "";
          if (title) text += title + "\n\n";
          text += "Web 版：" + webUrl + "\n";
          text += "手机版：" + mobileUrl;

          navigator.clipboard.writeText(text).then(function () {
            copyShareBtn.textContent = "已复制";
            setTimeout(function () {
              copyShareBtn.textContent = "复制分享文案";
            }, 1500);
          });
        });
      })
      .catch(function () {
        // scripting 失败时仍然显示复制按钮，只是没有标题摘要
        copyShareBtn.style.display = "";
        copyShareBtn.addEventListener("click", function () {
          var text = "Web 版：" + webUrl + "\n" + "手机版：" + mobileUrl;
          navigator.clipboard.writeText(text).then(function () {
            copyShareBtn.textContent = "已复制";
            setTimeout(function () {
              copyShareBtn.textContent = "复制分享文案";
            }, 1500);
          });
        });
      });
  });

  // 3. 单行链接复制按钮
  document.querySelectorAll(".copy-link-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var targetId = btn.getAttribute("data-target");
      var link = document.getElementById(targetId);
      navigator.clipboard.writeText(link.href).then(function () {
        btn.textContent = "已复制";
        setTimeout(function () {
          btn.textContent = "复制";
        }, 1500);
      });
    });
  });

  // 4. 链接转换器
  urlInput.addEventListener("input", function () {
    var url = urlInput.value.trim();
    if (!url) {
      convertResult.style.display = "none";
      return;
    }

    var converted = convertUrl(url);
    if (converted) {
      convertResult.style.display = "";
      resultLink.href = converted;
      resultLink.textContent = converted;
    } else {
      convertResult.style.display = "none";
    }
  });

  copyBtn.addEventListener("click", function () {
    var url = resultLink.href;
    navigator.clipboard.writeText(url).then(function () {
      copyBtn.textContent = "已复制";
      setTimeout(function () {
        copyBtn.textContent = "复制";
      }, 1500);
    });
  });
});
