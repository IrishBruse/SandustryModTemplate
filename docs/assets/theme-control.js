(function () {
    var storageKey = "smt-docs-theme";

    function getMode() {
        var v = localStorage.getItem(storageKey);
        if (v === "light" || v === "dark" || v === "system") {
            return v;
        }
        return "system";
    }

    function setMode(mode) {
        localStorage.setItem(storageKey, mode);
        apply();
    }

    function cycleMode() {
        var order = ["system", "light", "dark"];
        var cur = getMode();
        var idx = order.indexOf(cur);
        if (idx < 0) {
            idx = 0;
        }
        setMode(order[(idx + 1) % order.length]);
    }

    function resolvedTheme() {
        var mode = getMode();
        if (mode === "dark") {
            return "dark";
        }
        if (mode === "light") {
            return "light";
        }
        return window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light";
    }

    function apply() {
        var link = document.getElementById("smt-dark-theme");
        document.documentElement.setAttribute(
            "data-smt-docs-theme",
            resolvedTheme()
        );
        if (!link) {
            return;
        }
        var mode = getMode();
        if (mode === "dark") {
            link.media = "all";
            return;
        }
        if (mode === "light") {
            link.media = "not all";
            return;
        }
        link.media = "(prefers-color-scheme: dark)";
    }

    function themeIconMarkup(mode) {
        if (mode === "light") {
            return [
                '<svg class="smt-theme-icon-svg" data-smt-glyph="light" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">',
                '<circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="1.75"/>',
                '<path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>',
                "</svg>",
            ].join("");
        }
        if (mode === "dark") {
            return [
                '<svg class="smt-theme-icon-svg" data-smt-glyph="dark" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">',
                '<path fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z"/>',
                "</svg>",
            ].join("");
        }
        return [
            '<svg class="smt-theme-icon-svg" data-smt-glyph="system" viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false">',
            "<defs>",
            '<clipPath id="smtThemeSysUL"><polygon points="0,0 24,0 0,24"/></clipPath>',
            '<clipPath id="smtThemeSysLR"><polygon points="24,24 24,0 0,24"/></clipPath>',
            "</defs>",
            '<g clip-path="url(#smtThemeSysUL)">',
            '<circle cx="8.25" cy="8.25" r="3.35" fill="none" stroke="currentColor" stroke-width="1.75"/>',
            '<path fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" d="M8.25 3.35v1.25M8.25 11.9v1.25M5.35 8.25H4.1M12.6 8.25h-1.25M6.05 5.6l-.85-.85M11.3 10.85l-.85-.85M6.05 10.9l-.85.85M11.3 5.65l-.85.85"/>',
            "</g>",
            '<g clip-path="url(#smtThemeSysLR)">',
            '<g transform="translate(11.25, 11.75) scale(0.52)">',
            '<path vector-effect="non-scaling-stroke" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z"/>',
            "</g>",
            "</g>",
            '<line x1="0.85" y1="23.15" x2="23.15" y2="0.85" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>',
            "</svg>",
        ].join("");
    }

    function updateButton(btn) {
        if (!btn) {
            return;
        }
        var mode = getMode();
        btn.innerHTML = themeIconMarkup(mode);
        btn.setAttribute(
            "aria-label",
            "Color theme is " +
                mode +
                ". Activate to cycle system default, light, and dark."
        );
        btn.setAttribute("title", "Theme: " + mode);
    }

    function insertThemeBar() {
        if (document.getElementById("smt-theme-bar")) {
            return;
        }
        var host = document.querySelector("main");
        if (!host) {
            return;
        }
        var bar = document.createElement("div");
        bar.id = "smt-theme-bar";
        bar.setAttribute("role", "group");
        bar.setAttribute("aria-label", "Theme selector");

        var btn = document.createElement("button");
        btn.id = "smt-theme-btn";
        btn.type = "button";
        btn.className = "smt-theme-button";
        updateButton(btn);
        btn.addEventListener("click", function () {
            cycleMode();
            updateButton(btn);
        });
        bar.appendChild(btn);
        host.appendChild(bar);
    }

    function syncSidebarToggleIcon() {
        var inner = document.querySelector(
            ".sidebar-toggle .sidebar-toggle-button"
        );
        if (!inner || inner.getAttribute("data-smt-sidebar-icon")) {
            return;
        }
        inner.setAttribute("data-smt-sidebar-icon", "true");
        inner.innerHTML = [
            '<svg class="smt-sidebar-toggle-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" focusable="false">',
            '<path fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" d="M9 6l7 7-7 7"/>',
            "</svg>",
        ].join("");
    }

    function drawerMediaQuery() {
        var raw = getComputedStyle(document.documentElement)
            .getPropertyValue("--_mobile-breakpoint")
            .trim();
        if (!raw) {
            raw = "640px";
        }
        return window.matchMedia("(max-width: " + raw + ")");
    }

    function syncDrawerChrome() {
        var mq = drawerMediaQuery();
        var sidebar = document.querySelector(".sidebar");
        var body = document.body;
        var scrim = document.getElementById("smt-drawer-scrim");
        if (!sidebar) {
            body.classList.remove("smt-drawer-open");
            if (scrim) {
                scrim.remove();
            }
            return;
        }
        var open = mq.matches && sidebar.classList.contains("show");
        if (open) {
            body.classList.add("smt-drawer-open");
            if (!scrim) {
                scrim = document.createElement("div");
                scrim.id = "smt-drawer-scrim";
                scrim.setAttribute("aria-hidden", "true");
                scrim.addEventListener("click", function () {
                    var btn = document.querySelector(".sidebar-toggle-button");
                    if (btn) {
                        btn.click();
                    }
                });
                document.body.appendChild(scrim);
            }
            return;
        }
        body.classList.remove("smt-drawer-open");
        if (scrim) {
            scrim.remove();
        }
    }

    function installDrawerChrome() {
        var sidebar = document.querySelector(".sidebar");
        if (!sidebar) {
            syncDrawerChrome();
            return;
        }
        if (!sidebar.getAttribute("data-smt-drawer-watch")) {
            sidebar.setAttribute("data-smt-drawer-watch", "true");
            var mq = drawerMediaQuery();
            new MutationObserver(syncDrawerChrome).observe(sidebar, {
                attributes: true,
                attributeFilter: ["class"],
            });
            mq.addEventListener("change", syncDrawerChrome);
        }
        syncDrawerChrome();
    }

    window.smtDocsifyThemePlugin = function (hook) {
        hook.mounted(function () {
            insertThemeBar();
            syncSidebarToggleIcon();
            installDrawerChrome();
        });
        hook.ready(function () {
            insertThemeBar();
            syncSidebarToggleIcon();
            installDrawerChrome();
        });
    };

    window.smtDocsTheme = {
        getMode: getMode,
        setMode: setMode,
        cycleMode: cycleMode,
        apply: apply,
    };

    apply();
})();
