var listener = function(details) {
  return {
    redirectUrl: chrome.extension.getURL('hey.html')
      + "?request="
      + encodeURIComponent(JSON.stringify(details))
  };
};

window.updateListener = function(){
  if(chrome.webRequest.onBeforeRequest.hasListener(listener)){
    chrome.webRequest.onBeforeRequest.removeListener(listener);
  }

  chrome.storage.sync.get('urls', function(data) {
    if(!_.isArray(data.urls)) {
      return;
    }
    urls = data.urls;
    chrome.webRequest
      .onBeforeRequest
      .addListener(listener, { urls: urls.map(function(v){ return v.url; }) }, ["blocking"]);
  });
}

window.updateListener();