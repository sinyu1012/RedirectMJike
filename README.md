# 即刻重定向助手（RedirectMJike）

Chrome 扩展，解决即刻 Web 版（web.okjike.com）未登录时无法查看帖子的问题。

访问 web.okjike.com 的帖子页面时，如果未登录会被 SPA 路由到登录页。本扩展检测到这一行为后，自动跳转到手机版（m.okjike.com），无需登录即可查看内容。

## 功能

- **自动跳转**：未登录状态下访问 web.okjike.com 帖子页面，自动重定向到 m.okjike.com
- **支持多种 URL 格式**：`/originalPost/{id}`、`/u/{userId}/post/{id}`、`/repost/{id}`
- **开关控制**：可在 popup 中随时启用/禁用
- **链接转换**：在 popup 中粘贴任意即刻链接，双向转换 web ↔ mobile
- **当前页快捷操作**：如果当前页是即刻页面，一键跳转到另一版本

## 安装

### Chrome 应用商店

[重定向M.Jike](https://chrome.google.com/webstore/detail/%E9%87%8D%E5%AE%9A%E5%90%91mjike/incaphdljgidancjigdpfjlepppklaoa)

### 手动安装

1. 下载或克隆本仓库
2. 打开 Chrome，访问 `chrome://extensions/`
3. 开启右上角「开发者模式」
4. 点击「加载已解压的扩展程序」，选择 `src` 目录

## 使用说明

1. 安装后扩展默认启用
2. 正常访问 `https://web.okjike.com/originalPost/xxx` 等帖子链接
3. 如果未登录，页面会自动跳转到 `https://m.okjike.com/originalPosts/xxx`
4. 点击工具栏的即刻图标可以：
   - 开关自动跳转功能
   - 转换当前页面到另一版本
   - 粘贴链接进行双向转换
