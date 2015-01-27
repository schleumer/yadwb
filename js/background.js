// set default URLs for first run
var defaultUrls = [
  {
    "url": "*://*.facebook.com/*"
  }, {
    "url": "*://facebook.com/*"
  }, {
    "url": "*://9gag.com/*"
  }, {
    "url": "*://*.9gag.com/*"
  }, {
    "url": "*://*.twitter.com/*"
  }, {
    "url": "*://twitter.com/*"
  }
];


// listener called by `onBeforeRequest`
var listener = function(details) {
  return {
    redirectUrl: chrome.extension.getURL('block.html')
      + "?request="
      // maybe it will explode in a future
      // lucky it's not future
      + encodeURIComponent(JSON.stringify(details))
  };
};

// global(nnnnggggggg) listener updater
window.updateListener = function(callsaul){
  // detach listeners if there's some
  if(chrome.webRequest.onBeforeRequest.hasListener(listener)){
    chrome.webRequest.onBeforeRequest.removeListener(listener);
  }

  // get URLs from storage
  chrome.storage.sync.get('urls', function(data) {
    // check if it's a array, if use defaultUrls as first run data
    if(!_.isArray(data.urls)) {
      chrome.storage.sync.set({
        urls: defaultUrls
      }, function() {
        // then recall
        window.updateListener(callsaul);
      });
      return;
    }

    // if it's empty, we will not waste our time on this
    if(_.isEmpty(data.urls)) {
      return;
    }

    urls = data.urls;
    // attach the listener into `onBeforeRequest` 
    // using urls as filter, no RegExp for slow down requests.
    chrome.webRequest
      .onBeforeRequest
      .addListener(listener, { urls: urls.map(function(v){ return v.url; }) }, ["blocking"]);

    if (callsaul) {
      callsaul();
    }
  });
}

// first call
window.updateListener();