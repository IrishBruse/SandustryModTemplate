(function () {
  function tocHrefForId(vm, id) {
    if (vm && vm.config && vm.config.router === "history") {
      return vm.route.path + "?id=" + encodeURIComponent(id);
    }
    var base = typeof location !== "undefined" ? location.hash : "";
    if (!base || base === "#") {
      var p = vm && vm.route && vm.route.path ? vm.route.path : "/";
      if (p.charAt(0) !== "/") {
        p = "/" + p;
      }
      base = "#" + p;
    }
    var q = base.indexOf("?");
    if (q >= 0) {
      base = base.slice(0, q);
    }
    if (base.charAt(0) !== "#") {
      base = "#" + base;
    }
    if (base === "#") {
      base = "#/";
    }
    return base + "?id=" + encodeURIComponent(id);
  }

  function fullUrlForHeading(vm, id) {
    var tail = tocHrefForId(vm, id);
    if (vm && vm.config && vm.config.router === "history") {
      var origin = typeof location !== "undefined" ? location.origin : "";
      var path = tail;
      if (path.charAt(0) !== "/") {
        path = "/" + path;
      }
      return origin + path;
    }
    var base = typeof location !== "undefined" ? location.href.replace(/#.*$/, "") : "";
    if (tail.indexOf("#") !== 0) {
      tail = "#" + tail.replace(/^#/, "");
    }
    return base + tail;
  }

  function chainSvg() {
    return (
      '<svg class="smt-heading-copy-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" focusable="false">' +
      '<path d="M440-280H280q-83 0-141.5-58.5T80-480q0-83 58.5-141.5T280-680h160v80H280q-50 0-85 35t-35 85q0 50 35 85t85 35h160v80ZM320-440v-80h320v80H320Zm200 160v-80h160q50 0 85-35t35-85q0-50-35-85t-85-35H520v-80h160q83 0 141.5 58.5T880-480q0 83-58.5 141.5T680-280H520Z"/>' +
      "</svg>"
    );
  }

  function flashCopied(btn) {
    window.clearTimeout(btn.smtCopyTimer);
    if (btn.smtCopyTooltipEl && btn.smtCopyTooltipEl.parentNode) {
      btn.smtCopyTooltipEl.remove();
    }
    var tip = document.createElement("span");
    tip.className = "smt-heading-copy-tooltip";
    tip.textContent = "Copied";
    tip.setAttribute("role", "status");
    btn.classList.add("smt-heading-copy-feedback");
    btn.appendChild(tip);
    btn.smtCopyTooltipEl = tip;

    function cleanup() {
      window.clearTimeout(btn.smtCopyTimer);
      btn.smtCopyTimer = null;
      if (tip.parentNode) {
        tip.remove();
      }
      if (btn.smtCopyTooltipEl === tip) {
        btn.smtCopyTooltipEl = null;
      }
      btn.classList.remove("smt-heading-copy-feedback");
    }
    tip.addEventListener("animationend", cleanup, { once: true });
    btn.smtCopyTimer = window.setTimeout(cleanup, 3200);
  }

  function legacyCopy(text, btn) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      flashCopied(btn);
    } catch {
      /* ignore copy failure; the button stays in the idle state */
    }
    document.body.removeChild(ta);
  }

  function copyUrl(url, btn) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(
        function () {
          flashCopied(btn);
        },
        function () {
          legacyCopy(url, btn);
        },
      );
      return;
    }
    legacyCopy(url, btn);
  }

  function enhanceHeadings(vm) {
    var article =
      document.querySelector("article.markdown-section") ||
      document.querySelector(".markdown-section");
    if (!article) {
      return;
    }
    var heads = article.querySelectorAll("h1, h2, h3, h4, h5, h6");
    var i;
    var h;
    for (i = 0; i < heads.length; i++) {
      h = heads[i];
      if (h.classList.contains("smt-heading-with-anchor")) {
        continue;
      }
      var a = h.querySelector(":scope > a.anchor");
      if (!a) {
        continue;
      }
      var id = h.id || (a.getAttribute("data-id") || "").trim() || "";
      if (!id) {
        continue;
      }
      if (!h.id) {
        h.id = id;
      }
      var inner = a.querySelector("span");
      var text = inner ? inner.textContent : a.textContent;
      var titleSpan = document.createElement("span");
      titleSpan.className = "smt-heading-text";
      titleSpan.textContent = text;
      var btn = document.createElement("button");
      btn.type = "button";
      btn.className = "smt-heading-copy";
      btn.setAttribute("title", "Copy link to this section");
      btn.setAttribute("aria-label", "Copy link to this section");
      btn.innerHTML = chainSvg();
      (function (headingId, copyBtn) {
        copyBtn.addEventListener("click", function (ev) {
          ev.preventDefault();
          ev.stopPropagation();
          var hashHref = tocHrefForId(vm, headingId);
          if (vm && vm.config && vm.config.router === "history") {
            if (typeof history !== "undefined" && history.replaceState) {
              history.replaceState(null, "", hashHref);
            } else if (typeof location !== "undefined") {
              location.assign(hashHref);
            }
          } else if (typeof location !== "undefined") {
            var nextHash = hashHref.charAt(0) === "#" ? hashHref.slice(1) : hashHref;
            if (location.hash.replace(/^#/, "") !== nextHash) {
              location.hash = nextHash;
            }
          }
          var url = fullUrlForHeading(vm, headingId);
          copyUrl(url, copyBtn);
        });
      })(id, btn);
      while (h.firstChild) {
        h.removeChild(h.firstChild);
      }
      h.classList.add("smt-heading-with-anchor");
      h.appendChild(titleSpan);
      h.appendChild(btn);
    }
  }

  window.smtDocsifyHeadingCopyPlugin = function (hook, vm) {
    hook.doneEach(function () {
      enhanceHeadings(vm);
    });
  };
})();
