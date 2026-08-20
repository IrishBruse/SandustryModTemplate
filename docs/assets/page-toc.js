(function () {
    var scrollHandler = null;
    var refreshGeneration = 0;

    function headingLevel(tagName) {
        var m = /^H([1-6])$/i.exec(tagName);
        return m ? parseInt(m[1], 10) : 0;
    }

    function linkTextFromHeading(h) {
        var clone = h.cloneNode(true);
        var anchors = clone.querySelectorAll("a.anchor, .anchor");
        for (var i = 0; i < anchors.length; i++) {
            var a = anchors[i];
            var t = a.textContent || "";
            a.replaceWith(document.createTextNode(t));
        }
        var out = clone.textContent.replace(/\s+/g, " ").trim();
        if (out) {
            return out;
        }
        return "Untitled";
    }

    function headingDomId(h) {
        if (h.id) {
            return h.id;
        }
        var a = h.querySelector("a.anchor[data-id]");
        if (a) {
            return a.getAttribute("data-id") || "";
        }
        return "";
    }

    function slugifyText(unclean) {
        var fn = window.Docsify && window.Docsify.slugify;
        if (typeof fn === "function") {
            return fn(unclean);
        }
        return String(unclean)
            .toLowerCase()
            .trim()
            .replace(/[^\w\u00c0-\u024f]+/g, "-")
            .replace(/^-|-$/g, "") || "heading";
    }

    function ensureHeadingIds(article) {
        var heads = article.querySelectorAll("h1, h2, h3, h4, h5, h6");
        var used = {};
        var i;
        var h;
        for (i = 0; i < heads.length; i++) {
            h = heads[i];
            var existing = headingDomId(h);
            if (existing) {
                used[existing] = true;
            }
        }
        for (i = 0; i < heads.length; i++) {
            h = heads[i];
            if (headingDomId(h)) {
                continue;
            }
            var text = linkTextFromHeading(h);
            var base = slugifyText(text);
            var id = base;
            var n = 2;
            while (used[id]) {
                id = base + "-" + n;
                n += 1;
            }
            used[id] = true;
            h.id = id;
        }
    }

    function tocHref(vm, id) {
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

    function buildTree(headings) {
        var root = { children: [] };
        var stack = [{ level: 0, item: root }];
        for (var i = 0; i < headings.length; i++) {
            var h = headings[i];
            var level = headingLevel(h.tagName);
            if (level < 1) {
                continue;
            }
            var id = headingDomId(h);
            if (!id) {
                continue;
            }
            var text = linkTextFromHeading(h);
            var item = { level: level, id: id, text: text, children: [] };
            while (stack.length > 1 && stack[stack.length - 1].level >= level) {
                stack.pop();
            }
            var parent = stack[stack.length - 1].item;
            parent.children.push(item);
            stack.push({ level: level, item: item });
        }
        return root.children;
    }

    function renderUl(nodes, vm) {
        if (!nodes || nodes.length === 0) {
            return null;
        }
        var ul = document.createElement("ul");
        for (var i = 0; i < nodes.length; i++) {
            var n = nodes[i];
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.className = "smt-page-toc-link";
            a.setAttribute("data-smt-toc-id", n.id);
            a.href = tocHref(vm, n.id);
            a.textContent = n.text;
            li.appendChild(a);
            var nested = renderUl(n.children, vm);
            if (nested) {
                li.appendChild(nested);
            }
            ul.appendChild(li);
        }
        return ul;
    }

    function clearActive(aside) {
        if (!aside) {
            return;
        }
        var links = aside.querySelectorAll("a.smt-page-toc-link");
        for (var i = 0; i < links.length; i++) {
            links[i].classList.remove("smt-page-toc-active");
        }
    }

    function bindScrollSpy(aside, article) {
        if (scrollHandler) {
            window.removeEventListener("scroll", scrollHandler);
            scrollHandler = null;
        }
        var heads = article.querySelectorAll(
            "h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"
        );
        if (heads.length === 0) {
            return;
        }
        var links = aside.querySelectorAll("a.smt-page-toc-link");
        var byId = {};
        for (var j = 0; j < links.length; j++) {
            var lid = links[j].getAttribute("data-smt-toc-id");
            if (lid) {
                byId[lid] = links[j];
            }
        }
        var margin = 96;
        scrollHandler = function () {
            var pick = "";
            for (var k = 0; k < heads.length; k++) {
                var top = heads[k].getBoundingClientRect().top;
                if (top <= margin) {
                    pick = heads[k].id;
                }
            }
            if (!pick) {
                pick = heads[0].id;
            }
            clearActive(aside);
            var active = byId[pick];
            if (active) {
                active.classList.add("smt-page-toc-active");
            }
        };
        window.addEventListener("scroll", scrollHandler, { passive: true });
        scrollHandler();
    }

    function refreshPageToc(vm) {
        if (scrollHandler) {
            window.removeEventListener("scroll", scrollHandler);
            scrollHandler = null;
        }
        var oldAside = document.getElementById("smt-page-toc");
        if (oldAside) {
            oldAside.remove();
        }
        var content = document.querySelector("main > .content");
        var article =
            (content &&
                (content.querySelector("article.markdown-section") ||
                    content.querySelector(".markdown-section"))) ||
            document.querySelector("article.markdown-section") ||
            document.querySelector(".markdown-section");
        if (!content || !article) {
            return;
        }
        ensureHeadingIds(article);
        var headings = article.querySelectorAll("h1, h2, h3, h4, h5, h6");
        var tree = buildTree(headings);
        if (tree.length === 0) {
            return;
        }
        var list = renderUl(tree, vm);
        if (!list) {
            return;
        }
        var aside = document.createElement("aside");
        aside.id = "smt-page-toc";
        aside.setAttribute("aria-label", "On this page");
        var title = document.createElement("p");
        title.className = "smt-page-toc-title";
        title.textContent = "On this page";
        aside.appendChild(title);
        aside.appendChild(list);
        content.appendChild(aside);
        bindScrollSpy(aside, article);
    }

    function scheduleRefresh(vm) {
        refreshGeneration += 1;
        var ticket = refreshGeneration;
        function runIfCurrent() {
            if (ticket !== refreshGeneration) {
                return;
            }
            refreshPageToc(vm);
        }
        requestAnimationFrame(runIfCurrent);
        setTimeout(runIfCurrent, 120);
    }

    window.smtDocsifyPageTocPlugin = function (hook, vm) {
        hook.doneEach(function () {
            scheduleRefresh(vm);
        });
    };
})();
