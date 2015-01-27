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

var requestHolder = {};

// listener called by `onHeadersReceived`
var listener = function(details) {
  // ishygddt
  headers = requestHolder[details.requestId];
  // sweep the dirty under the carpet
  // TODO: >implying all requests ends here
  delete requestHolder[details.requestId];
  if(details.type === "sub_frame") {
    return;
  }
  if(details.type === "main_frame") {
    var checkReferer = headers.filter(function(header){
      return header.name == "Referer";
    }).length;
    if(checkReferer < 1) {
      return {
        redirectUrl: chrome.extension.getURL('block.html')
          + "?request="
          // maybe it will explode in a future
          // lucky it's not future
          + encodeURIComponent(JSON.stringify(details))
      };
    }
  }
};

// global(nnnnggggggg) listener updater
window.updateListener = function(callsaul){
  // detach listeners if there's some
  if(chrome.webRequest.onHeadersReceived.hasListener(listener)){
    chrome.webRequest.onHeadersReceived.removeListener(listener);
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
    // attach the listener into `onHeadersReceived` 
    // using urls as filter, no RegExp for slow down requests.
    chrome.webRequest
      .onHeadersReceived
      .addListener(listener, { urls: urls.map(function(v){ return v.url; }) }, ["blocking", "responseHeaders"]);

    chrome.webRequest
      .onBeforeSendHeaders
      .addListener(function(details) {
        // ayy lmao, relax, it's just processed when URL matches :)
        requestHolder[details.requestId] = details.requestHeaders;
      }, {urls: urls.map(function(v){ return v.url; })}, ["requestHeaders"])

    if (callsaul) {
      callsaul();
    }
  });
}

// first call
window.updateListener();