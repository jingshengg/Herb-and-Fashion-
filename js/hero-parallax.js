(() => {
  const section = document.querySelector("[data-hero-scroll]");
  const scene = section?.querySelector("[data-hero-scene]");
  if (!section || !scene) return;
  const caption = scene.querySelector("[data-hero-caption]");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0;
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));

  function update() {
    frame = 0;

    if (reduceMotion.matches) {
      scene.style.setProperty("--hero-title-shift", "0px");
      scene.style.setProperty("--hero-story-opacity", "1");
      scene.style.setProperty("--hero-story-y", "0px");
      caption?.setAttribute("aria-hidden", "false");
      caption?.removeAttribute("inert");
      scene.style.setProperty("--hero-bg-shift", "0px");
      return;
    }

    const travel = Math.max(1, section.offsetHeight - scene.offsetHeight);
    const sectionTop = section.getBoundingClientRect().top + window.scrollY;
    const progress = clamp((window.scrollY - sectionTop) / travel);
    const riseProgress = clamp(progress / 0.58);
    const easedRise = riseProgress * riseProgress * (3 - 2 * riseProgress);
    const startShift = Math.min(window.innerHeight * 0.43, 360);
    const endShift = -Math.min(Math.max(window.innerHeight * 0.25, 140), 250);
    const titleShift = startShift + (endShift - startShift) * easedRise;
    const storyFade = clamp((progress - 0.68) / 0.14);

    scene.style.setProperty("--hero-title-shift", `${titleShift.toFixed(2)}px`);
    scene.style.setProperty("--hero-story-opacity", storyFade.toFixed(3));
    scene.style.setProperty("--hero-story-y", `${((1 - storyFade) * 18).toFixed(2)}px`);
    const captionVisible = storyFade >= 0.5;
    caption?.setAttribute("aria-hidden", captionVisible ? "false" : "true");
    if (storyFade >= 0.95) caption?.removeAttribute("inert");
    else caption?.setAttribute("inert", "");
    scene.style.setProperty("--hero-bg-shift", "0px");
  }

  function scheduleUpdate() {
    if (!frame) frame = window.requestAnimationFrame(update);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  reduceMotion.addEventListener?.("change", scheduleUpdate);
  window.addEventListener("herb-language-change", scheduleUpdate);
  scheduleUpdate();
})();
