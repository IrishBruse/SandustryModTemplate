(function () {
  var IGNORE_TITLE = {
    Accessors: true,
    Classes: true,
    Constructors: true,
    Enumerations: true,
    "Enumeration Members": true,
    Functions: true,
    Interfaces: true,
    Methods: true,
    Modules: true,
    Namespaces: true,
    Overrides: true,
    Properties: true,
    References: true,
    "Type Aliases": true,
    "Type Parameters": true,
    Variables: true,
  };
  var MAX_RESULTS = 40;

  function searchInput() {
    return document.querySelector(".search input[type='search']");
  }

  function normalize(text) {
    return String(text || "")
      .toLowerCase()
      .replace(/\s+\(worker\)$/, "")
      .replace(/\(\)\s*$/, "")
      .replace(/[/\\]+/g, ".")
      .replace(/[_\s]+/g, ".")
      .replace(/\.+/g, ".")
      .replace(/^\.+|\.+$/g, "")
      .trim();
  }

  function displayTitle(el) {
    var node = el.querySelector(".title");
    return node
      ? String(node.textContent || "")
          .replace(/\s+/g, " ")
          .trim()
      : "";
  }

  function displayHref(el) {
    var link = el.querySelector("a");
    return link ? String(link.getAttribute("href") || "") : "";
  }

  function scoreTitle(rawTitle, query, href) {
    var t = normalize(rawTitle);
    var q = normalize(query);
    if (!t || !q) return 0;

    var worker = /\(worker\)/i.test(rawTitle) ? -20 : 0;
    if (t === q) return 1000 + worker;
    if (t.endsWith("." + q)) return 920 + worker;

    var last = t.split(".").pop();
    if (last === q) return 880 + worker;

    if (t.indexOf(q) !== -1) {
      var dotted = q.indexOf(".") !== -1 ? 90 : 0;
      return 480 + dotted + Math.max(0, 80 - t.length) + worker;
    }

    var parts = q.split(".").filter(Boolean);
    if (parts.length > 1) {
      var i = 0;
      var pos = 0;
      for (; i < parts.length; i++) {
        var at = t.indexOf(parts[i], pos);
        if (at === -1) break;
        pos = at + parts[i].length;
      }
      if (i === parts.length) return 360 + parts.length * 20 + worker;
    }

    var path = normalize(href.replace(/^#\/?/, "").replace(/\?.*$/, ""));
    if (path && path.indexOf(q) !== -1) return 200 + worker;

    return 40 + worker;
  }

  function retune() {
    var panel = document.querySelector(".search .results-panel");
    var input = searchInput();
    if (!panel || !input) return;

    var q = input.value.trim();
    if (!q) return;

    var posts = Array.prototype.slice.call(panel.querySelectorAll(".matching-post"));
    if (!posts.length) return;

    var ranked = posts.filter(function (el) {
      return !IGNORE_TITLE[displayTitle(el)];
    });

    ranked.sort(function (a, b) {
      var sa = scoreTitle(displayTitle(a), q, displayHref(a));
      var sb = scoreTitle(displayTitle(b), q, displayHref(b));
      if (sb !== sa) return sb - sa;
      return displayTitle(a).length - displayTitle(b).length;
    });

    var shown = ranked.slice(0, MAX_RESULTS);
    panel.replaceChildren.apply(panel, shown);

    var status = document.querySelector(".search .results-status");
    if (!status) return;
    if (ranked.length > MAX_RESULTS) {
      status.textContent = "Found " + ranked.length + " results (showing " + MAX_RESULTS + ")";
    } else if (ranked.length) {
      status.textContent = "Found " + ranked.length + " results";
    }
  }

  window.smtDocsifySearchRankPlugin = function (hook) {
    hook.ready(function () {
      var panel = document.querySelector(".search .results-panel");
      if (!panel) return;

      var observer = new MutationObserver(function () {
        observer.disconnect();
        retune();
        observer.observe(panel, { childList: true });
      });
      observer.observe(panel, { childList: true });
    });
  };
})();
