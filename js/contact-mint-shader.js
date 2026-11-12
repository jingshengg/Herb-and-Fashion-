(() => {
  const section = document.querySelector(".contact-preview");
  if (!section) return;

  const canvas = document.createElement("canvas");
  canvas.className = "contact-mint-shader";
  canvas.setAttribute("aria-hidden", "true");

  const gl = canvas.getContext("webgl", {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: false,
  });
  if (!gl) return;

  const precision = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT)?.precision
    ? "highp"
    : "mediump";
  const vertexSource = `
    attribute vec2 a_position;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
    }
  `;
  const fragmentSource = `
    precision ${precision} float;
    uniform vec2 u_resolution;
    uniform float u_time;

    float hash(vec2 p) {
      vec3 p3 = fract(vec3(p.xyx) * 0.1031);
      p3 += dot(p3, p3.yzx + 33.33);
      return fract((p3.x + p3.y) * p3.z);
    }

    float noise(vec2 p) {
      vec2 cell = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(cell);
      float b = hash(cell + vec2(1.0, 0.0));
      float c = hash(cell + vec2(0.0, 1.0));
      float d = hash(cell + vec2(1.0, 1.0));
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }

    float fbm(vec2 p) {
      float value = 0.0;
      float amplitude = 0.5;
      mat2 turn = mat2(1.6, 1.2, -1.2, 1.6);
      for (int i = 0; i < 3; i++) {
        value += amplitude * noise(p);
        p = turn * p;
        amplitude *= 0.5;
      }
      return value / 0.875;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_resolution;
      float fromTop = 1.0 - uv.y;
      float fromBottom = uv.y;
      float topBlend = 1.0 - smoothstep(0.0, 0.22, fromTop);
      float bottomBlend = smoothstep(0.76, 1.0, fromTop);
      float edgeBlend = smoothstep(0.0, 0.16, min(fromTop, fromBottom));
      vec3 cream = vec3(0.969, 0.957, 0.925);
      vec3 warmPaper = vec3(0.941, 0.910, 0.859);
      vec3 footerPaper = vec3(0.894, 0.871, 0.812);
      vec3 seaGlass = vec3(0.757, 0.847, 0.776);
      vec3 paleMint = vec3(0.663, 0.788, 0.718);
      vec3 dawnPeach = vec3(0.941, 0.824, 0.698);
      vec3 color = mix(cream, warmPaper, topBlend);
      color = mix(color, footerPaper, bottomBlend);

      float aspect = u_resolution.x / max(u_resolution.y, 1.0);
      vec2 p = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);
      float time = u_time * 0.067;

      // Two slowly moving noise fields bend each other into soft, liquid boundaries.
      float driftX = noise(p * 1.75 + vec2(time * 0.85, -time * 0.18));
      float driftY = noise(p * 1.75 + vec2(5.7 - time * 0.22, time * 0.62));
      vec2 warp = (vec2(driftX, driftY) - 0.5) * 1.35;
      float body = fbm(p * 1.9 + warp + vec2(-time * 0.45, time * 0.22));
      float veil = fbm(p * 2.55 + warp * 1.18 + vec2(4.8 + time * 0.27, 2.1 - time * 0.19));
      float dawnField = fbm(p * 1.28 - warp * 0.42 + vec2(3.1 + time * 0.16, -2.4 + time * 0.10));

      float seaFlow = smoothstep(0.36, 0.72, body);
      float mintFlow = smoothstep(0.43, 0.76, veil);
      float dawnFlow = smoothstep(0.44, 0.76, dawnField);
      color = mix(color, seaGlass, seaFlow * 0.58 * edgeBlend);
      color = mix(color, paleMint, mintFlow * 0.50 * edgeBlend);
      color = mix(color, dawnPeach, dawnFlow * 0.20 * edgeBlend);

      // A fine, fixed grain gives the haze a matte, tactile surface without flicker.
      float grain = hash(gl_FragCoord.xy) - 0.5;
      color += grain * 0.032 * edgeBlend;
      gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    }
  `;

  function compileShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      throw new Error("Unable to compile the Contact Us background shader.");
    }
    return shader;
  }

  let program;
  try {
    const vertexShader = compileShader(gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Unable to link the Contact Us background shader.");
    }
  } catch {
    gl.deleteProgram(program);
    return;
  }

  section.prepend(canvas);
  gl.useProgram(program);

  const vertices = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertices);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
    -1, -1, 1, -1, -1, 1,
    -1, 1, 1, -1, 1, 1,
  ]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, "a_position");
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  const resolutionUniform = gl.getUniformLocation(program, "u_resolution");
  const timeUniform = gl.getUniformLocation(program, "u_time");
  const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");

  let animationFrame = 0;
  let startTime = 0;
  let inRange = false;
  let drawable = false;

  function render(timeSeconds = 0) {
    if (!drawable) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(resolutionUniform, canvas.width, canvas.height);
    gl.uniform1f(timeUniform, timeSeconds);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  function resize() {
    const bounds = section.getBoundingClientRect();
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.15);
    const width = Math.max(1, Math.round(bounds.width * pixelRatio));
    const height = Math.max(1, Math.round(bounds.height * pixelRatio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    drawable = bounds.width > 0 && bounds.height > 0;
    if (drawable) render(startTime ? (performance.now() - startTime) / 1000 : 0);
  }

  function stop() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = 0;
  }

  function frame(now) {
    if (!inRange || motionPreference.matches || document.hidden) {
      animationFrame = 0;
      return;
    }
    if (!startTime) startTime = now;
    render((now - startTime) / 1000);
    animationFrame = requestAnimationFrame(frame);
  }

  function syncAnimation() {
    if (!inRange || motionPreference.matches || document.hidden) {
      stop();
      render(startTime ? (performance.now() - startTime) / 1000 : 0);
      return;
    }
    if (!animationFrame) animationFrame = requestAnimationFrame(frame);
  }

  resize();
  if ("ResizeObserver" in window) new ResizeObserver(resize).observe(section);
  else window.addEventListener("resize", resize, { passive: true });

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    inRange = entry.isIntersecting;
    syncAnimation();
  }, { rootMargin: "220px 0px" });
  visibilityObserver.observe(section);

  motionPreference.addEventListener?.("change", syncAnimation);
  document.addEventListener("visibilitychange", syncAnimation);
  canvas.addEventListener("webglcontextlost", (event) => {
    event.preventDefault();
    stop();
  });
})();
