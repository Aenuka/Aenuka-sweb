(() => {
  const routes = new Set(["home", "about", "skills", "projects", "contact"]);

  function routeFromPath() {
    const route = window.location.pathname.replace(/^\/+|\/+$/g, "") || "home";
    return routes.has(route) ? route : "home";
  }

  function setActiveLink(route) {
    document.querySelectorAll("[data-nav-link]").forEach((link) => {
      link.classList.toggle("active", link.dataset.route === route);
    });
  }

  function showRoute(route, behavior = "smooth") {
    const section = document.getElementById(route);
    if (!section) return;

    setActiveLink(route);
    section.scrollIntoView({ behavior, block: "start" });
  }

  document.querySelectorAll("[data-route]").forEach((link) => {
    link.addEventListener("click", (event) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      event.preventDefault();
      const route = link.dataset.route;
      const path = route === "home" ? "/" : `/${route}`;

      if (window.location.pathname !== path) {
        window.history.pushState({ route }, "", path);
      }
      showRoute(route);
    });
  });

  window.addEventListener("popstate", () => showRoute(routeFromPath()));
  window.addEventListener("load", () => showRoute(routeFromPath(), "auto"));
})();
