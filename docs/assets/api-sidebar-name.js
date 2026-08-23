(function () {
  var MAIN_NAME = "Sandustry Mod Template";
  var API_NAME = "Sandkit API";
  var MAIN_LINK = "#/";
  var API_LINK = "#/api/README";

  function isApiRoute(route) {
    var path = (route && route.path) || location.hash.slice(1) || "/";
    return path === "/api" || path.indexOf("/api/") === 0;
  }

  function updateSidebarBrand(route) {
    var el = document.querySelector(".sidebar .app-name");
    if (!el) {
      return;
    }

    var api = isApiRoute(route);
    el.textContent = api ? API_NAME : MAIN_NAME;
    el.setAttribute("href", api ? API_LINK : MAIN_LINK);
  }

  window.smtDocsifyApiSidebarNamePlugin = function (hook) {
    hook.doneEach(function () {
      updateSidebarBrand(this.route);
    });
    hook.ready(function () {
      updateSidebarBrand(this.route);
    });
  };
})();
