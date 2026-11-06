(() => {
  const section = document.querySelector(".services-preview");
  if (!section) return;

  const list = section.querySelector("[data-service-list]");
  const points = Array.from(section.querySelectorAll("[data-service-point]"));
  const fill = section.querySelector("[data-service-timeline-fill]");
  const cta = section.querySelector("[data-services-cta]");
  if (!list || !points.length || !fill || !cta) return;

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduceMotion.matches) return;

  const settleTimers = new Map();
  let frameRequested = false;
  let railStart = 0;
  let railLength = 0;

  section.classList.add("has-scroll-effects");
  cta.setAttribute("aria-hidden", "true");
  cta.querySelector("a")?.setAttribute("tabindex", "-1");
  points.forEach((point) => point.setAttribute("aria-hidden", "true"));

  function clearSettleTimer(point) {
    const timer = settleTimers.get(point);
    if (timer) window.clearTimeout(timer);
    settleTimers.delete(point);
  }

  function markSettled(point) {
    if (!point.classList.contains("is-revealed")) return;
    point.classList.add("is-settled");
    updateCurrentPoint();
    updateTimeline();
    updateCta(window.innerHeight * 0.72);
  }

  points.forEach((point) => {
    point.addEventListener("transitionend", (event) => {
      if (event.target !== point || event.propertyName !== "transform") return;
      clearSettleTimer(point);
      markSettled(point);
    });
  });

  function updateRailGeometry() {
    const listRect = list.getBoundingClientRect();
    const firstRect = points[0].getBoundingClientRect();
    const lastRect = points[points.length - 1].getBoundingClientRect();
    railStart = firstRect.top + firstRect.height / 2 - listRect.top;
    const railEnd = lastRect.top + lastRect.height / 2 - listRect.top;
    railLength = Math.max(1, railEnd - railStart);
    const top = Math.max(0, railStart);
    const bottom = Math.max(0, listRect.height - railEnd);
    list.style.setProperty("--service-rail-top", `${top}px`);
    list.style.setProperty("--service-rail-bottom", `${bottom}px`);
  }

  function updateCurrentPoint() {
    let current = null;
    points.forEach((point) => {
      if (point.classList.contains("is-settled") && point.classList.contains("is-revealed")) current = point;
    });
    points.forEach((point) => point.classList.toggle("is-current", point === current));
  }

  function updateTimeline() {
    const currentIndex = points.findLastIndex
      ? points.findLastIndex((point) => point.classList.contains("is-settled") && point.classList.contains("is-revealed"))
      : (() => {
          for (let index = points.length - 1; index >= 0; index -= 1) {
            if (points[index].classList.contains("is-settled") && points[index].classList.contains("is-revealed")) return index;
          }
          return -1;
        })();

    if (currentIndex < 0 || railLength <= 1) {
      fill.style.height = "0%";
      return;
    }

    const listRect = list.getBoundingClientRect();
    const pointRect = points[currentIndex].getBoundingClientRect();
    const center = pointRect.top + pointRect.height / 2 - listRect.top;
    const progress = Math.max(0, Math.min(100, ((center - railStart) / railLength) * 100));
    fill.style.height = `${progress}%`;
  }

  function updateCta(triggerLine) {
    const allSettled = points.every((point) => point.classList.contains("is-settled") && point.classList.contains("is-revealed"));
    const shouldShow = allSettled && cta.getBoundingClientRect().top <= triggerLine;
    cta.classList.toggle("is-visible", shouldShow);
    cta.setAttribute("aria-hidden", String(!shouldShow));
    const link = cta.querySelector("a");
    if (link) link.tabIndex = shouldShow ? 0 : -1;
    if (shouldShow) points[points.length - 1].classList.remove("is-current");
    else updateCurrentPoint();
  }

  function renderScrollState() {
    frameRequested = false;
    const triggerLine = window.innerHeight * 0.72;
    let stateChanged = false;

    points.forEach((point, index) => {
      const top = point.getBoundingClientRect().top;
      const isRevealed = point.classList.contains("is-revealed");
      const priorPointsSettled = points.slice(0, index).every((prior) =>
        prior.classList.contains("is-settled") && prior.classList.contains("is-revealed")
      );

      if (!isRevealed && priorPointsSettled && top <= triggerLine) {
        point.classList.add("is-revealed");
        point.setAttribute("aria-hidden", "false");
        clearSettleTimer(point);
        settleTimers.set(point, window.setTimeout(() => markSettled(point), 950));
        stateChanged = true;
      } else if (isRevealed && (!priorPointsSettled || top > triggerLine + 34)) {
        point.classList.remove("is-revealed", "is-settled", "is-current");
        point.setAttribute("aria-hidden", "true");
        clearSettleTimer(point);
        stateChanged = true;
      }
    });

    if (stateChanged) {
      updateCurrentPoint();
      updateTimeline();
    }
    updateCta(triggerLine);
  }

  function requestRender() {
    if (frameRequested) return;
    frameRequested = true;
    window.requestAnimationFrame(renderScrollState);
  }

  updateRailGeometry();
  requestRender();
  window.addEventListener("scroll", requestRender, { passive: true });
  window.addEventListener("resize", () => {
    updateRailGeometry();
    requestRender();
  }, { passive: true });

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(() => {
      updateRailGeometry();
      requestRender();
    });
    observer.observe(list);
    points.forEach((point) => observer.observe(point));
  }
})();
