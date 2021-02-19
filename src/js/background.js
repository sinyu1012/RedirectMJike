chrome.webRequest.onBeforeRequest.addListener(function interceptRequest(request) {
	return {redirectUrl: getOriginalUrl (request.url)}; 
}, {urls: ['https://m.okjike.com/*']}, ['blocking']);
  
  function getOriginalUrl (url) {
	let realUrl = url.replace('m.okjike.com','web.okjike.com')
	realUrl = realUrl.replace('/originalPosts/','/originalPost/')
	realUrl = realUrl.replace('/users/','/u/')
	realUrl = realUrl.replace('/topics/','/topic/')
	return realUrl
  }