document.addEventListener("DOMContentLoaded", function() {
  var parsed = JSON.parse(queryString.parse(location.search).request);
  document.getElementById("request-url").innerHTML = parsed.url;
});