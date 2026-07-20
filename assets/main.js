(function () {
  var year = document.getElementById("y");
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  window.trackAndNavigate = window.trackAndNavigate || function (event, name, data, url, target) {
    if (typeof window.gtag === "function" && name) {
      window.gtag("event", name, data || {});
    }
    if (url) {
      if (target === "_blank") {
        window.open(url, "_blank", "noopener");
      } else {
        window.location.href = url;
      }
      if (event && typeof event.preventDefault === "function") {
        event.preventDefault();
      }
      return false;
    }
    return true;
  };
})();
