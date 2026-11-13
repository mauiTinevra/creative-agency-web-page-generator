// Builds one block per site from the list in sites.js.
const work = document.getElementById("work");

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

// A browser-style frame holding a scaled-down live copy of the site.
function preview(site, kind, width, height) {
  const frame = el("a", "frame frame-" + kind);
  frame.href = site.url;
  frame.target = "_blank";
  frame.rel = "noopener";
  frame.setAttribute("aria-label", "Open " + site.name + " in a new tab");

  const screen = el("div", "screen");
  screen.dataset.width = width;
  screen.style.aspectRatio = width + " / " + height;

  const page = el("iframe");
  page.src = site.url;
  page.loading = "lazy";
  page.title = site.name + " " + kind + " preview";
  page.tabIndex = -1;
  page.setAttribute("aria-hidden", "true");
  page.setAttribute("scrolling", "no");
  page.style.width = width + "px";
  page.style.height = height + "px";

  screen.append(page);
  frame.append(screen);
  return frame;
}

for (const site of window.SITES) {
  const host = new URL(site.url).host;
  const project = el("article", "project");

  const stage = el("div", "stage");
  stage.append(preview(site, "desktop", 1280, 800));

  const info = el("div", "info");
  info.append(el("p", "category", site.category));
  info.append(el("h2", "", site.name));
  info.append(el("p", "description", site.description));

  info.append(el("h3", "", "What we built"));
  const built = el("ul", "built");
  for (const item of site.built) built.append(el("li", "", item));
  info.append(built);

  const visit = el("a", "button", "Visit " + host);
  visit.href = site.url;
  visit.target = "_blank";
  visit.rel = "noopener";
  info.append(visit);

  project.append(stage, info);
  work.append(project);
}

// Keep each live preview scaled to the size of its frame.
const scaler = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const screen = entry.target;
    screen.style.setProperty("--scale", screen.clientWidth / screen.dataset.width);
  }
});
document.querySelectorAll(".screen").forEach((screen) => scaler.observe(screen));
