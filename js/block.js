document.addEventListener("DOMContentLoaded", function() {
  var parsed = JSON.parse(queryString.parse(location.search).request);
  var url = parsed.url;
  chrome.storage.sync.get(['wasteMessage'], function(data) {
    var message = (data.wasteMessage || chrome.i18n.getMessage('default_waste_message'))
      .replace(/:url:/g, url);
    document.getElementById('message').innerHTML = message;
  });

  document.getElementById('donate_message').innerHTML = chrome.i18n.getMessage('donate_message');
});