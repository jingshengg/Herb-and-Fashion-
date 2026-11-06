(() => {
  const storageKey = "hf-page-intro-seen-v1";
  let shouldPlay = false;

  try {
    if (window.localStorage.getItem(storageKey) !== "1") {
      window.localStorage.setItem(storageKey, "1");
      shouldPlay = true;
    }
  } catch {
    try {
      if (window.sessionStorage.getItem(storageKey) !== "1") {
        window.sessionStorage.setItem(storageKey, "1");
        shouldPlay = true;
      }
    } catch {
      // If browser storage is disabled, still honor this page load.
      shouldPlay = true;
    }
  }

  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  if (!shouldPlay || prefersReducedMotion) return;

  const rootElement = document.documentElement;
  rootElement.classList.add("hf-intro-pending");

  const createPanel = (side, chineseText) => {
    const panel = document.createElement("div");
    panel.className = "hf-page-intro__panel hf-page-intro__panel--" + side;

    const text = document.createElement("span");
    text.className = "hf-page-intro__chinese";
    text.lang = "zh-Hans";
    text.textContent = chineseText;
    panel.append(text);

    return panel;
  };

  const mountIntro = () => {
    if (!rootElement.classList.contains("hf-intro-pending")) return;

    const intro = document.createElement("div");
    intro.className = "hf-page-intro";
    intro.setAttribute("aria-hidden", "true");

    const leftPanel = createPanel("left", "草本时尚");
    const rightPanel = createPanel("right", "草本时尚");

    const english = document.createElement("div");
    english.className = "hf-page-intro__english";
    english.lang = "en";
    ["Herb", "and", "Fashion", "Malaysia"].forEach((word) => {
      const span = document.createElement("span");
      span.className = "hf-page-intro__word";
      span.textContent = word;
      english.append(span);
    });

    intro.append(leftPanel, rightPanel, english);
    rootElement.append(intro);

    const wasBodyInert = document.body.inert;
    document.body.inert = true;
    rootElement.classList.remove("hf-intro-pending");
    rootElement.classList.add("hf-intro-playing");

    let finished = false;
    let panelsFinished = 0;
    let openingFallback = 0;
    const timers = [];

    const finishIntro = () => {
      if (finished) return;
      finished = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      window.clearTimeout(openingFallback);
      document.body.inert = wasBodyInert;
      rootElement.classList.remove("hf-intro-playing");
      intro.remove();
    };

    const handlePanelExit = (event) => {
      if (!intro.classList.contains("is-opening")) return;
      if (!event.target.classList.contains("hf-page-intro__panel") || event.propertyName !== "transform") return;
      panelsFinished += 1;
      if (panelsFinished >= 2) finishIntro();
    };

    intro.addEventListener("transitionend", handlePanelExit);

    requestAnimationFrame(() => requestAnimationFrame(() => intro.classList.add("is-entering")));

    timers.push(window.setTimeout(() => intro.classList.add("is-english-leaving"), 1500));
    timers.push(window.setTimeout(() => intro.classList.add("is-chinese-visible"), 1900));
    timers.push(window.setTimeout(() => {
      intro.classList.add("is-opening");
      openingFallback = window.setTimeout(finishIntro, 1550);
    }, 3000));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountIntro, { once: true });
  } else {
    mountIntro();
  }
})();
