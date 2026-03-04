// URL 匹配模式
const WEB_POST_PATTERNS = [
  // /originalPost/{postId}
  /^https?:\/\/web\.okjike\.com\/originalPost\/([a-zA-Z0-9]+)/,
  // /u/{userId}/post/{postId}
  /^https?:\/\/web\.okjike\.com\/u\/[a-zA-Z0-9-]+\/post\/([a-zA-Z0-9]+)/,
];

const MOBILE_POST_PATTERN =
  /^https?:\/\/m\.okjike\.com\/originalPosts\/([a-zA-Z0-9]+)/;

const WEB_REPOST_PATTERN =
  /^https?:\/\/web\.okjike\.com\/repost\/([a-zA-Z0-9]+)/;

const MOBILE_REPOST_PATTERN =
  /^https?:\/\/m\.okjike\.com\/reposts\/([a-zA-Z0-9]+)/;

const LOGIN_PATTERN = /^https?:\/\/web\.okjike\.com\/login/;

function extractPostIdFromWebUrl(url) {
  for (const pattern of WEB_POST_PATTERNS) {
    const match = url.match(pattern);
    if (match) return { type: "post", id: match[1] };
  }
  const repostMatch = url.match(WEB_REPOST_PATTERN);
  if (repostMatch) return { type: "repost", id: repostMatch[1] };
  return null;
}

function extractPostIdFromMobileUrl(url) {
  const postMatch = url.match(MOBILE_POST_PATTERN);
  if (postMatch) return { type: "post", id: postMatch[1] };
  const repostMatch = url.match(MOBILE_REPOST_PATTERN);
  if (repostMatch) return { type: "repost", id: repostMatch[1] };
  return null;
}

function webToMobile(url) {
  const result = extractPostIdFromWebUrl(url);
  if (!result) return null;
  if (result.type === "repost") {
    return `https://m.okjike.com/reposts/${result.id}`;
  }
  return `https://m.okjike.com/originalPosts/${result.id}`;
}

function mobileToWeb(url) {
  const result = extractPostIdFromMobileUrl(url);
  if (!result) return null;
  if (result.type === "repost") {
    return `https://web.okjike.com/repost/${result.id}`;
  }
  return `https://web.okjike.com/originalPost/${result.id}`;
}

function convertUrl(url) {
  return webToMobile(url) || mobileToWeb(url) || null;
}

function isWebPostUrl(url) {
  return extractPostIdFromWebUrl(url) !== null;
}

function isLoginUrl(url) {
  return LOGIN_PATTERN.test(url);
}
