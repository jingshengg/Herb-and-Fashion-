(() => {
  const root = document.documentElement;
  const header = document.querySelector(".site-header");
  const productSection = document.querySelector(".products-preview");
  const productTrack = document.querySelector("[data-products-intro-track]");
  const productTitle = document.querySelector("[data-products-title]");
  const productTagline = document.querySelector("[data-products-tagline]");
  const serviceSection = document.querySelector(".services-preview");
  const serviceStage = serviceSection?.querySelector("[data-services-stage]");
  const servicePoints = Array.from(serviceSection?.querySelectorAll("[data-service-point]") || []);
  const serviceHeadings = servicePoints.map((point) => point.querySelector(".service-typewriter"));
  const serviceCta = serviceSection?.querySelector("[data-services-cta]");
  const serviceLink = serviceCta?.querySelector("a");
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const wideBreakpoint = 1100;

  let storyTimeline = null;
  let productTitleTimeline = null;
  let resizeTimer = 0;
  let lastMode = null;
  let lastViewportWidth = 0;
  let lastViewportHeight = 0;
  let lastAccessVisiblePoints = -1;
  let lastAccessCtaVisible = null;

  // Use the same layout viewport as ScrollTrigger and the CSS 100vh fallback.
  const viewportHeight = () => Math.round(window.innerHeight || document.documentElement.clientHeight);
  const viewportWidth = () => Math.round(window.innerWidth || document.documentElement.clientWidth);
  const headerHeight = () => Math.max(0, Math.round(header?.getBoundingClientRect().height || 80));
  const stageHeight = () => Math.max(320, viewportHeight() - headerHeight());
  const currentLanguage = () => root.lang.toLowerCase().startsWith("zh") ? "zh" : "en";
  const mode = () => viewportWidth() > wideBreakpoint ? "wide" : "stacked";

  function syncDimensions() {
    const height = viewportHeight();
    const width = viewportWidth();
    const headerSize = headerHeight();
    const stage = Math.max(320, height - headerSize);
    root.style.setProperty("--overview-header-height", `${headerSize}px`);
    root.style.setProperty("--overview-stage-height", `${stage}px`);
    return { height, width, headerSize, stage };
  }

  function headingText(element, language = currentLanguage()) {
    if (!element) return "";
    return language === "zh" ? element.dataset.typeZh || "" : element.dataset.typeEn || "";
  }

  function renderTypewriter(language = currentLanguage()) {
    serviceHeadings.forEach((element) => {
      if (!element) return;
      const text = headingText(element, language);
      const heading = element.closest("h3");
      if (heading) heading.setAttribute("aria-label", text);
      element.setAttribute("aria-hidden", "true");
      element.replaceChildren();

      const segments = language === "zh" ? Array.from(text) : text.split(/(\s+)/u);
      segments.forEach((segment) => {
        if (!segment) return;
        if (/^\s+$/u.test(segment)) {
          element.append(document.createTextNode(segment));
          return;
        }
        Array.from(segment).forEach((glyph) => {
          const span = document.createElement("span");
          span.className = "service-type-char";
          span.textContent = glyph;
          element.append(span);
        });
      });
    });
  }

  function setAccess(visiblePoints = 0, ctaVisible = false) {
    const visible = Math.max(0, Math.min(servicePoints.length, visiblePoints));
    if (visible !== lastAccessVisiblePoints) {
      servicePoints.forEach((point, index) => {
        const hidden = index >= visible;
        if (point.getAttribute("aria-hidden") !== String(hidden)) {
          point.setAttribute("aria-hidden", String(hidden));
        }
      });
      lastAccessVisiblePoints = visible;
    }
    if (ctaVisible !== lastAccessCtaVisible) {
      if (serviceCta) serviceCta.setAttribute("aria-hidden", String(!ctaVisible));
      if (serviceLink) serviceLink.tabIndex = ctaVisible ? 0 : -1;
      lastAccessCtaVisible = ctaVisible;
    }
  }

  function clearStory() {
    storyTimeline?.scrollTrigger?.kill();
    storyTimeline?.kill();
    storyTimeline = null;
    productTitleTimeline?.scrollTrigger?.kill();
    productTitleTimeline?.kill();
    productTitleTimeline = null;
    root.classList.remove(
      "overview-scroll-story-ready",
      "overview-scroll-story-ready-wide",
      "overview-scroll-story-ready-stacked",
      "overview-story-wide-active",
      "overview-scroll-story-static"
    );
    if (serviceStage) gsap?.set(serviceStage, { clearProps: "transform,position,top,left,width,zIndex" });
    servicePoints.forEach((point) => gsap?.set(point, { clearProps: "opacity,visibility,transform" }));
    serviceHeadings.forEach((heading) => {
      heading?.querySelectorAll(".service-type-char").forEach((glyph) => {
        gsap?.set(glyph, { clearProps: "opacity,visibility,transform" });
      });
    });
    if (serviceCta) gsap?.set(serviceCta, { clearProps: "opacity,visibility,transform" });
    setAccess(servicePoints.length, true);
  }

  function showStaticFallback() {
    clearStory();
    root.classList.add("overview-scroll-story-static");
    syncDimensions();
    [productTitle, productTagline].forEach((element) => {
      if (!element) return;
      element.style.opacity = "1";
      element.style.transform = "none";
      element.style.visibility = "visible";
    });
    servicePoints.forEach((point) => {
      point.style.opacity = "1";
      point.style.visibility = "visible";
      point.style.transform = "none";
    });
    if (serviceCta) {
      serviceCta.style.opacity = "1";
      serviceCta.style.visibility = "visible";
      serviceCta.style.transform = "none";
    }
    if (serviceLink) serviceLink.tabIndex = 0;
    serviceHeadings.forEach((element) => {
      if (!element) return;
      element.removeAttribute("aria-hidden");
      element.textContent = headingText(element);
      element.closest("h3")?.removeAttribute("aria-label");
    });
  }

  if (!productSection || !serviceSection || !serviceStage || servicePoints.length !== 4) {
    showStaticFallback();
    return;
  }

  if (!gsap || !ScrollTrigger || reduceMotion.matches) {
    showStaticFallback();
    window.addEventListener("herb-language-change", (event) => {
      serviceHeadings.forEach((element) => {
        if (!element) return;
        element.removeAttribute("aria-hidden");
        element.textContent = headingText(element, event.detail?.language === "zh" ? "zh" : "en");
        element.closest("h3")?.removeAttribute("aria-label");
      });
    });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  function addProductHeadingReveal() {
    productTitleTimeline?.scrollTrigger?.kill();
    productTitleTimeline?.kill();
    productTitleTimeline = null;
    if (!productTrack || !productTitle || !productTagline || mode() !== "wide") return;

    productTitleTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: productTrack,
        start: "top 88%",
        end: "top 36%",
        scrub: true,
        invalidateOnRefresh: true
      }
    });
    productTitleTimeline
      .fromTo(productTitle,
        { y: () => -Math.min(170, Math.max(105, viewportHeight() * .16)), autoAlpha: 1 },
        { y: 0, autoAlpha: 1, ease: "none", duration: .68 }, 0)
      .fromTo(productTagline,
        { autoAlpha: 0 },
        { autoAlpha: 1, ease: "none", duration: .24 }, .72);
  }

  function buildStory() {
    clearStory();
    const layout = mode();
    const dimensions = syncDimensions();
    lastMode = layout;
    lastViewportWidth = dimensions.width;
    lastViewportHeight = dimensions.height;
    renderTypewriter();
    root.classList.add("overview-scroll-story-ready", layout === "wide"
      ? "overview-scroll-story-ready-wide"
      : "overview-scroll-story-ready-stacked");

    // Wide screens hold the product/water view while the services video rises
    // over it. Narrow screens scroll products normally, then pin only the
    // viewport-sized services stage before revealing its four points.
    const curtainPauseDistance = layout === "wide" ? 140 : 0;
    const coverDistance = layout === "wide" ? Math.round(dimensions.stage * .45) : 0;
    const pointStep = Math.round(Math.min(156, Math.max(138, dimensions.stage * .17)));
    const pointDuration = Math.round(pointStep * .62);
    const ctaDuration = 42;
    const ctaHoldDistance = 220;
    const pointsEnd = pointStep * Math.max(0, servicePoints.length - 1) + pointDuration;
    const pointsStart = curtainPauseDistance + coverDistance;
    const ctaStart = pointsStart + pointsEnd;
    const totalDistance = ctaStart + ctaDuration + ctaHoldDistance;
    const glyphDuration = Math.max(6, pointDuration * .09);
    const glyphStagger = Math.max(32, pointDuration * .52);

    gsap.set(serviceStage, { yPercent: layout === "wide" ? 100 : 0, autoAlpha: 1, force3D: true });
    gsap.set(servicePoints, { autoAlpha: 0, y: 12 });
    servicePoints.forEach((point) => {
      gsap.set(point.querySelectorAll(".service-type-char"), { autoAlpha: 0 });
    });
    gsap.set(serviceCta, { autoAlpha: 0, y: 8 });
    setAccess(0, false);

    storyTimeline = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: layout === "wide" ? productSection : serviceStage,
        start: layout === "wide" ? "bottom bottom" : () => `top top+=${headerHeight()}`,
        end: () => `+=${totalDistance}`,
        pin: layout === "wide" ? productSection : serviceStage,
        pinSpacing: true,
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onEnter: () => {
          if (layout === "wide") root.classList.add("overview-story-wide-active");
        },
        onEnterBack: () => {
          if (layout === "wide") root.classList.add("overview-story-wide-active");
        },
        onLeave: () => {
          if (layout === "wide") {
            root.classList.remove("overview-story-wide-active");
            gsap.set(serviceStage, { yPercent: 0, force3D: true });
          }
          setAccess(servicePoints.length, true);
        },
        onLeaveBack: () => {
          if (layout === "wide") {
            root.classList.remove("overview-story-wide-active");
            gsap.set(serviceStage, { yPercent: 100, force3D: true });
          }
          setAccess(0, false);
        },
        onUpdate: (self) => {
          const elapsed = self.progress * totalDistance - pointsStart;
          const visiblePoints = Math.max(0, Math.min(servicePoints.length,
            Math.ceil(Math.max(0, elapsed) / pointStep)));
          setAccess(visiblePoints, elapsed >= pointsEnd + ctaDuration * .72);
        }
      }
    });

    if (layout === "wide") {
      storyTimeline.fromTo(serviceStage,
        { yPercent: 100, force3D: true },
        { yPercent: 0, duration: coverDistance, force3D: true, immediateRender: false }, curtainPauseDistance);
    }

    servicePoints.forEach((point, index) => {
      const pointStart = pointsStart + pointStep * index;
      storyTimeline.to(point, {
        autoAlpha: 1,
        y: 0,
        duration: pointDuration,
        force3D: true
      }, pointStart);

      const glyphs = point.querySelectorAll(".service-type-char");
      if (glyphs.length) {
        storyTimeline.to(glyphs, {
          autoAlpha: 1,
          duration: glyphDuration,
          stagger: { amount: glyphStagger, from: "start" }
        }, pointStart + Math.min(8, pointDuration * .06));
      }
    });

    storyTimeline.to(serviceCta, {
      autoAlpha: 1,
      y: 0,
      duration: ctaDuration,
      force3D: true
    }, ctaStart);

    // Keep the services scene pinned briefly after the CTA appears.
    const ctaHold = { progress: 0 };
    storyTimeline.to(ctaHold, {
      progress: 1,
      duration: ctaHoldDistance
    }, ctaStart + ctaDuration);

    addProductHeadingReveal();
    ScrollTrigger.refresh();
  }

  buildStory();

  function scheduleLayoutRefresh() {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      const width = viewportWidth();
      const height = viewportHeight();
      const modeChanged = mode() !== lastMode;
      const widthChanged = Math.abs(width - lastViewportWidth) > 24;
      const heightChanged = Math.abs(height - lastViewportHeight) > 48;
      if (modeChanged || widthChanged || heightChanged) buildStory();
      else {
        syncDimensions();
        ScrollTrigger.refresh();
      }
    }, 260);
  }

  window.addEventListener("resize", scheduleLayoutRefresh, { passive: true });
  window.addEventListener("herb-language-change", () => buildStory());
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
  serviceStage.querySelector("video")?.addEventListener("loadedmetadata", () => ScrollTrigger.refresh(), { once: true });
  if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
})();






