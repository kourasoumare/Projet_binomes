(function () {
  const KEY = "node-course-theme";
  const root = document.documentElement;

  function getInitialTheme() {
    const saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function applyTheme(theme) {
    root.classList.toggle("theme-dark", theme === "dark");
  }

  function syncButton(theme, btn) {
    btn.textContent = theme === "dark" ? "Mode clair" : "Mode sombre";
    btn.setAttribute("aria-label", "Basculer le thème");
    btn.setAttribute("title", "Basculer le thème");
  }

  function initToggle() {
    const btn = document.createElement("button");
    btn.id = "theme-toggle";
    btn.type = "button";

    const initial = getInitialTheme();
    applyTheme(initial);
    syncButton(initial, btn);

    btn.addEventListener("click", function () {
      const next = root.classList.contains("theme-dark") ? "light" : "dark";
      applyTheme(next);
      localStorage.setItem(KEY, next);
      syncButton(next, btn);
    });

    document.body.appendChild(btn);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initToggle);
  } else {
    initToggle();
  }
})();
