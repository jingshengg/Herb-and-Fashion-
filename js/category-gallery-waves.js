(() => {
  const section = document.querySelector(".products-preview");
  const canvas = section?.querySelector("[data-products-water]");
  const stage = section?.querySelector("[data-category-gallery-stage]");
  if (!section || !canvas || !stage) return;

  const coarsePointerQuery = window.matchMedia("(pointer: coarse)");
  const isCompactViewport = () => window.innerWidth <= 1100 || coarsePointerQuery.matches;

  function start2DFallback(targetCanvas) {
    // Use a fresh canvas if WebGL already claimed the original one but its
    // shader could not compile on this device.
    const ctx = targetCanvas.getContext("2d");
    if (!ctx) return;
    const rings = [];
    let frame = 0;
    let cssWidth = 1;
    let cssHeight = 1;
    let lastPointer = null;
    let lastRippleAt = 0;

    function resizeFallback() {
      const rect = section.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1);
      cssWidth = Math.max(1, rect.width);
      cssHeight = Math.max(1, rect.height);
      targetCanvas.width = Math.max(1, Math.round(cssWidth * dpr));
      targetCanvas.height = Math.max(1, Math.round(cssHeight * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scheduleFallback();
    }

    function addFallbackRipple(clientX, clientY, strength = 1) {
      const rect = section.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      rings.push({ x: clientX - rect.left, y: clientY - rect.top, born: performance.now(), strength });
      while (rings.length > 10) rings.shift();
      scheduleFallback();
    }

    function scheduleFallback() {
      if (!frame) frame = window.requestAnimationFrame(renderFallback);
    }

    function renderFallback(now) {
      frame = 0;
      ctx.clearRect(0, 0, cssWidth, cssHeight);
      for (let i = rings.length - 1; i >= 0; i -= 1) {
        const ring = rings[i];
        const age = (now - ring.born) / 1000;
        if (age > 2.05) { rings.splice(i, 1); continue; }
        const radius = 28 + age * (isCompactViewport() ? 88 : 100);
        const fade = Math.max(0, 1 - age / 2.05) * Math.min(1, ring.strength);
        [0, 10, 20].forEach((offset, index) => {
          ctx.beginPath();
          ctx.ellipse(ring.x, ring.y, radius + offset, (radius + offset) * .58, -.12, 0, Math.PI * 2);
          ctx.lineWidth = index === 1 ? 1.8 : 1.1;
          ctx.strokeStyle = index === 1
            ? `rgba(255, 255, 255, ${.33 * fade})`
            : `rgba(91, 151, 145, ${.23 * fade})`;
          ctx.stroke();
        });
      }
      if (rings.length) scheduleFallback();
    }

    section.addEventListener("pointermove", (event) => {
      const now = performance.now();
      const compact = isCompactViewport();
      if (lastPointer && Math.hypot(event.clientX - lastPointer.x, event.clientY - lastPointer.y) > (compact ? 7 : 5) && now - lastRippleAt > (compact ? 42 : 32)) {
        addFallbackRipple(event.clientX, event.clientY, event.pointerType === "touch" ? .98 : .82);
        lastRippleAt = now;
      }
      lastPointer = { x: event.clientX, y: event.clientY };
    }, { passive: true });
    section.addEventListener("pointerdown", (event) => {
      lastPointer = { x: event.clientX, y: event.clientY };
      addFallbackRipple(event.clientX, event.clientY, .9);
    }, { passive: true });
    section.addEventListener("pointerleave", () => { lastPointer = null; }, { passive: true });
    window.addEventListener("resize", resizeFallback, { passive: true });
    if ("ResizeObserver" in window) new ResizeObserver(resizeFallback).observe(section);
    resizeFallback();
  }

  function replaceWith2DFallback() {
    const fallbackCanvas = document.createElement("canvas");
    fallbackCanvas.className = canvas.className;
    fallbackCanvas.dataset.productsWater = "";
    fallbackCanvas.setAttribute("aria-hidden", "true");
    canvas.replaceWith(fallbackCanvas);
    start2DFallback(fallbackCanvas);
  }

  const gl = canvas.getContext("webgl", { alpha: true, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false });
  if (!gl) {
    // Keep pointer ripples available on devices/browsers where WebGL is disabled.
    start2DFallback(canvas);
    return;
  }

  // Five simultaneous ripples preserve the hand-drawn water feel while keeping
  // the fragment shader responsive on half-width laptops and mobile GPUs.
  const rippleCount = 5;
  const vertexSource = `
    attribute vec2 aPosition;
    varying vec2 vUv;
    void main() {
      vUv = aPosition * 0.5 + 0.5;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `;
  const rippleTerms = Array.from({ length: rippleCount }, (_, index) => `
    {
      vec4 impulse = uRipples[${index}];
      float age = uTime - impulse.z;
      if (impulse.w > 0.0 && age >= 0.0 && age < 2.4) {
        vec2 origin = vec2((impulse.x - 0.5) * aspect, impulse.y - 0.5);
        vec2 delta = position - origin;
        float distanceFromOrigin = length(delta) + 0.0001;
        vec2 radial = delta / distanceFromOrigin;
        float ringDistance = distanceFromOrigin - age * uRippleSpeed;
        float envelope = exp(-abs(ringDistance) * 38.0) * exp(-age * 0.9) * impulse.w;
        float phase = ringDistance * 126.0;
        float sine = sin(phase);
        float cosine = cos(phase);
        float slope = cosine * 126.0 - sine * 38.0 * sign(ringDistance);
        float crest = exp(-abs(ringDistance) * 76.0) * exp(-age * 0.98) * impulse.w;
        height += sine * envelope * 0.11;
        gradient += radial * slope * envelope * 0.095;
        shimmer += envelope * (0.48 + 0.52 * cosine) + crest * 0.45;
      }
    }
  `).join("");
  const fragmentSource = `
    precision mediump float;
    varying vec2 vUv;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uRippleSpeed;
    uniform vec4 uRipples[${rippleCount}];
    void main() {
      float aspect = uResolution.x / max(1.0, uResolution.y);
      vec2 position = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);
      float height = 0.0;
      float shimmer = 0.0;
      vec2 gradient = vec2(0.0);
      ${rippleTerms}
      vec3 normal = normalize(vec3(-gradient.x, -gradient.y, 1.0));
      vec3 lightDirection = normalize(vec3(-0.38, 0.55, 0.74));
      float diffuse = max(dot(normal, lightDirection), 0.0);
      float specular = pow(max(dot(reflect(-lightDirection, normal), vec3(0.0, 0.0, 1.0)), 0.0), 7.0);
      float causticField = sin((vUv.x * 34.0 + vUv.y * 5.0 + height * 15.0 + uTime * 0.055))
                         * sin((vUv.y * 31.0 - vUv.x * 4.0 - height * 13.0 - uTime * 0.045));
      float caustic = pow(max(causticField, 0.0), 5.0) * clamp(shimmer * 0.8, 0.0, 1.0);
      float rippleEdge = clamp(shimmer * 0.3, 0.0, 0.58);
      float alpha = clamp(specular * 0.52 + caustic * 0.82 + rippleEdge * 0.9, 0.0, 0.88);
      vec3 waterColor = mix(vec3(0.55, 0.82, 0.79), vec3(1.0, 0.88, 0.66), clamp(specular + caustic * 1.3, 0.0, 1.0));
      waterColor += vec3(0.48, 0.56, 0.5) * caustic;
      waterColor += vec3(0.34, 0.46, 0.4) * diffuse * rippleEdge;
      waterColor += vec3(0.34, 0.38, 0.32) * rippleEdge;
      gl_FragColor = vec4(waterColor, alpha);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) {
    replaceWith2DFallback();
    return;
  }
  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    replaceWith2DFallback();
    return;
  }

  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const positionLocation = gl.getAttribLocation(program, "aPosition");
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
  const resolutionLocation = gl.getUniformLocation(program, "uResolution");
  const timeLocation = gl.getUniformLocation(program, "uTime");
  const rippleSpeedLocation = gl.getUniformLocation(program, "uRippleSpeed");
  const ripplesLocation = gl.getUniformLocation(program, "uRipples[0]");
  const impulses = [];
  const impulseUniformData = new Float32Array(rippleCount * 4);
  let frame = 0;
  let lastRenderedAt = 0;
  let lastImpulseTime = 0;
  let drag = null;
  let width = 1;
  let height = 1;

  function resize() {
    const rect = section.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 0.95);
    width = Math.max(1, Math.min(1600, Math.round(rect.width * dpr)));
    height = Math.max(1, Math.min(1700, Math.round(rect.height * dpr)));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLocation, width, height);
    }
    gl.uniform1f(rippleSpeedLocation, isCompactViewport() ? 0.36 : 0.42);
  }

  function addImpulse(clientX, clientY, strength = 0.9) {
    const rect = section.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = 1 - Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    const now = performance.now() / 1000;
    impulses.push({ x, y, time: now, strength: Math.max(0.8, strength) });
    while (impulses.length > rippleCount) impulses.shift();
    lastImpulseTime = now;
    if (!frame) frame = window.requestAnimationFrame(render);
  }

  function render(timestamp = performance.now()) {
    frame = 0;
    if (timestamp - lastRenderedAt < 30) {
      frame = window.requestAnimationFrame(render);
      return;
    }
    lastRenderedAt = timestamp;
    const now = performance.now() / 1000;
    const active = impulses.filter((impulse) => now - impulse.time < 2.4);
    impulses.splice(0, impulses.length, ...active);
    if (!active.length && now - lastImpulseTime > 2.45) {
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      return;
    }

    impulseUniformData.fill(0);
    active.forEach((impulse, index) => {
      const offset = index * 4;
      impulseUniformData[offset] = impulse.x;
      impulseUniformData[offset + 1] = impulse.y;
      impulseUniformData[offset + 2] = impulse.time;
      impulseUniformData[offset + 3] = impulse.strength;
    });
    gl.useProgram(program);
    gl.uniform1f(timeLocation, now);
    gl.uniform4fv(ripplesLocation, impulseUniformData);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    frame = window.requestAnimationFrame(render);
  }

  section.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag = { x: event.clientX, y: event.clientY, lastX: event.clientX, lastY: event.clientY, lastTime: performance.now() / 1000 };
    addImpulse(event.clientX, event.clientY, .98);
  }, { passive: true });

  let hoverPoint = null;
  let lastHoverTime = 0;
  section.addEventListener("pointermove", (event) => {
    const now = performance.now() / 1000;
    if (drag) {
      const dx = event.clientX - drag.lastX;
      const dy = event.clientY - drag.lastY;
      const distance = Math.hypot(dx, dy);
      const compact = isCompactViewport();
      if (distance > (compact ? 5 : 3) && now - drag.lastTime > (compact ? 0.04 : 0.03)) {
        addImpulse(event.clientX, event.clientY, Math.min(2.0, .95 + distance / 48));
        drag.lastX = event.clientX;
        drag.lastY = event.clientY;
        drag.lastTime = now;
      }
      return;
    }

    // Desktop hover movement creates ripples without requiring a click or pressed button.
    if (event.pointerType !== "mouse" || event.buttons !== 0) return;
    if (hoverPoint) {
      const distance = Math.hypot(event.clientX - hoverPoint.x, event.clientY - hoverPoint.y);
      const compact = isCompactViewport();
      if (distance > (compact ? 7 : 5) && now - lastHoverTime > (compact ? 0.05 : 0.04)) {
        addImpulse(event.clientX, event.clientY, Math.min(1.8, .8 + distance / 70));
        lastHoverTime = now;
      }
    }
    hoverPoint = { x: event.clientX, y: event.clientY };
  }, { passive: true });

  section.addEventListener("pointerleave", () => { hoverPoint = null; }, { passive: true });
  window.addEventListener("pointerup", () => { drag = null; }, { passive: true });
  window.addEventListener("pointercancel", () => { drag = null; hoverPoint = null; }, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("orientationchange", resize, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    } else if (!document.hidden && impulses.length && !frame) frame = window.requestAnimationFrame(render);
  });
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(section);
  resize();
})();


