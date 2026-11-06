(() => {
  const section = document.querySelector(".products-preview");
  const gallery = section?.querySelector("[data-category-gallery]");
  const stage = gallery?.querySelector("[data-category-gallery-stage]");
  const waves = section?.querySelector("[data-products-waves]");
  const flow = waves?.querySelector(".products-preview__wave-flow");
  if (!section || !gallery || !stage || !waves || !flow) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let pointerStart = null;
  let resetTimer = 0;
  let rippleFrame = 0;

  const clamp = (value, minimum, maximum) => Math.max(minimum, Math.min(maximum, value));

  function setImpulse(direction, dragOffset = 0) {
    const maxDistance = Math.min(132, Math.max(54, window.innerWidth * 0.075));
    const distance = Math.abs(dragOffset) > 1
      ? Math.min(maxDistance, Math.max(40, Math.abs(dragOffset) * 0.72))
      : maxDistance;
    const start = clamp(dragOffset * 0.28, -58, 58);
    const signedDistance = direction * distance;

    waves.style.setProperty("--wave-start-x", `${start}px`);
    waves.style.setProperty("--wave-target-x", `${start + signedDistance}px`);
    waves.style.setProperty("--wave-recoil-x", `${start + signedDistance * 0.56}px`);
    waves.style.setProperty("--wave-tail-x", `${start + signedDistance * 0.16}px`);
    waves.style.setProperty("--wave-skew", `${-direction * Math.min(1.8, distance / 78)}deg`);
  }

  function ripple(direction, dragOffset = 0) {
    setImpulse(direction, dragOffset);
    waves.classList.remove("is-dragging", "is-rippling");
    window.clearTimeout(resetTimer);
    window.cancelAnimationFrame(rippleFrame);
    rippleFrame = window.requestAnimationFrame(() => {
      waves.classList.add("is-rippling");
      resetTimer = window.setTimeout(() => waves.classList.remove("is-rippling"), 1020);
    });
  }

  function finishPointer(event, cancelled = false) {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const deltaX = event.clientX - pointerStart.x;
    const shouldRipple = pointerStart.started && !cancelled && Math.abs(deltaX) >= 14;
    pointerStart = null;
    if (shouldRipple) {
      ripple(deltaX < 0 ? -1 : 1, deltaX * 0.42);
    } else {
      waves.classList.remove("is-dragging");
    }
  }

  // Observe the gallery's existing pointer stream; these listeners never cancel or alter it.
  stage.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    pointerStart = { id: event.pointerId, x: event.clientX, y: event.clientY, started: false };
  });

  window.addEventListener("pointermove", (event) => {
    if (!pointerStart || event.pointerId !== pointerStart.id) return;
    const deltaX = event.clientX - pointerStart.x;
    const deltaY = event.clientY - pointerStart.y;
    if (Math.abs(deltaX) < 7 || Math.abs(deltaX) <= Math.abs(deltaY)) return;

    pointerStart.started = true;
    const offset = clamp(deltaX * 0.42, -105, 105);
    waves.style.setProperty("--wave-drag-x", `${offset}px`);
    waves.style.setProperty("--wave-skew", `${Math.sign(deltaX) * Math.min(1.8, Math.abs(deltaX) / 70)}deg`);
    waves.classList.add("is-dragging");
  }, { passive: true });

  window.addEventListener("pointerup", (event) => finishPointer(event));
  window.addEventListener("pointercancel", (event) => finishPointer(event, true));

  // Next moves the cards left; Previous moves them right. The wave follows that direction.
  gallery.addEventListener("click", (event) => {
    if (!(event.target instanceof Element)) return;
    if (event.target.closest("[data-gallery-next]")) ripple(-1);
    else if (event.target.closest("[data-gallery-previous]")) ripple(1);
  });

  stage.addEventListener("keydown", (event) => {
    if (event.repeat) return;
    if (event.key === "ArrowRight") ripple(-1);
    else if (event.key === "ArrowLeft") ripple(1);
  });
})();
