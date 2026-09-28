import { horizons, sceneConfig, terrainLayers } from "./scene-config";

export interface MountainRenderer {
  draw: (elapsed: number) => void;
  resize: () => void;
  dispose: () => void;
}

// One photo texture, four silhouette meshes and one transparent title plane.
// Perspective and depth testing provide occlusion; this is photographic scenery,
// not a reconstructed geographic terrain model.
export function createMountainRenderer(
  host: HTMLElement,
  photo: HTMLImageElement,
  title: HTMLElement,
  onContextLost: () => void,
): MountainRenderer {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  canvas.dataset.mountainCanvas = "true";
  const gl = canvas.getContext("webgl", {
    alpha: false, antialias: true, depth: true, preserveDrawingBuffer: false,
    powerPreference: "low-power",
  });
  if (!gl) throw new Error("Mountain rendering unavailable");

  const buffers: WebGLBuffer[] = [];
  const textures: WebGLTexture[] = [];
  const shaders: WebGLShader[] = [];
  let program: WebGLProgram | null = null;
  let disposed = false;
  let lastElapsed = 0;
  let width = 1;
  let height = 1;
  let fit: number[] = [0, 0, 1, 1];
  let titleFit: number[] = [0, 0, 1, 1];

  function dispose() {
    if (disposed) return;
    disposed = true;
    canvas.removeEventListener("webglcontextlost", contextLost);
    buffers.forEach((buffer) => gl!.deleteBuffer(buffer));
    textures.forEach((texture) => gl!.deleteTexture(texture));
    shaders.forEach((shader) => gl!.deleteShader(shader));
    if (program) gl!.deleteProgram(program);
    gl!.getExtension("WEBGL_lose_context")?.loseContext();
    canvas.remove();
  }

  function contextLost(event: Event) {
    event.preventDefault();
    if (!disposed) onContextLost();
  }

  function shader(type: number, source: string) {
    const result = gl!.createShader(type);
    if (!result) throw new Error("Mountain shader unavailable");
    shaders.push(result);
    gl!.shaderSource(result, source);
    gl!.compileShader(result);
    if (!gl!.getShaderParameter(result, gl!.COMPILE_STATUS)) {
      throw new Error("Mountain shader compilation failed");
    }
    return result;
  }

  function mesh(
    points: readonly (readonly [number, number])[],
    floor: readonly (readonly [number, number])[] = [[0, 100], [100, 100]],
    skirt = false,
  ) {
    const vertices: number[] = [];
    const add = (x: number, y: number, textureY = y) => vertices.push(x / 100, y / 100, x / 100, textureY / 100);
    const at = (profile: readonly (readonly [number, number])[], x: number) => {
      const index = profile.findIndex((point) => point[0] >= x);
      if (index <= 0) return profile[0][1];
      const [a, b] = [profile[index - 1], profile[index]];
      return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
    };
    const columns = [...new Set([...points, ...floor].map(([x]) => x))].sort((a, b) => a - b);
    for (let i = 0; i < columns.length - 1; i++) {
      const x = columns[i], nextX = columns[i + 1];
      const y = at(points, x), nextY = at(points, nextX);
      const bottom = at(floor, x), nextBottom = at(floor, nextX);
      add(x, y); add(x, bottom, skirt ? y : bottom); add(nextX, nextY);
      add(nextX, nextY); add(x, bottom, skirt ? y : bottom); add(nextX, nextBottom, skirt ? nextY : nextBottom);
    }
    const buffer = gl!.createBuffer();
    if (!buffer) throw new Error("Mountain mesh unavailable");
    buffers.push(buffer);
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
    gl!.bufferData(gl!.ARRAY_BUFFER, new Float32Array(vertices), gl!.STATIC_DRAW);
    return { buffer, count: vertices.length / 4 };
  }

  function texture() {
    const result = gl!.createTexture();
    if (!result) throw new Error("Mountain texture unavailable");
    textures.push(result);
    gl!.bindTexture(gl!.TEXTURE_2D, result);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.LINEAR);
    gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.LINEAR);
    return result;
  }

  try {
    const vertex = shader(gl.VERTEX_SHADER, `
      attribute vec2 point;
      attribute vec2 texturePoint;
      uniform vec4 fit;
      uniform vec2 viewport;
      uniform float depth;
      uniform float lift;
      uniform float turn;
      varying vec2 uv;
      varying float sheetY;
      void main() {
        uv = texturePoint;
        sheetY = point.y;
        vec2 pixel = fit.xy + point * fit.zw;
        vec2 clip = vec2(pixel.x / viewport.x * 2.0 - 1.0,
                         1.0 - pixel.y / viewport.y * 2.0 - lift * 2.0);
        float distance = 4.0 - depth;
        vec3 p = vec3(clip * distance, depth);
        float rotatedX = p.x * cos(turn);
        float rotatedZ = p.z - p.x * sin(turn);
        distance = 4.0 - rotatedZ;
        gl_Position = vec4(rotatedX, p.y,
                           1.1333333 * distance - 1.0666667, distance);
      }
    `);
    const fragment = shader(gl.FRAGMENT_SHADER, `
      precision mediump float;
      uniform sampler2D image;
      uniform float opacity;
      uniform float skirt;
      uniform vec3 materialColor;
      varying vec2 uv;
      varying float sheetY;
      void main() {
        if (skirt > 0.5) {
          gl_FragColor = vec4(materialColor * (1.03 - sheetY * 0.12), 1.0);
          return;
        }
        vec4 color = texture2D(image, uv);
        if (color.a < 0.02) discard;
        gl_FragColor = vec4(color.rgb, color.a * opacity);
      }
    `);
    program = gl.createProgram();
    if (!program) throw new Error("Mountain program unavailable");
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error("Mountain program linking failed");
    }
    gl.useProgram(program);
    const point = gl.getAttribLocation(program, "point");
    const texturePoint = gl.getAttribLocation(program, "texturePoint");
    const uniforms = {
      fit: gl.getUniformLocation(program, "fit"),
      viewport: gl.getUniformLocation(program, "viewport"),
      depth: gl.getUniformLocation(program, "depth"),
      lift: gl.getUniformLocation(program, "lift"),
      turn: gl.getUniformLocation(program, "turn"),
      opacity: gl.getUniformLocation(program, "opacity"),
      skirt: gl.getUniformLocation(program, "skirt"),
      materialColor: gl.getUniformLocation(program, "materialColor"),
    };
    // Each visible band contains only its own mountain/terrace pixels. Extending
    // the far mesh to the floor would reveal the entire photograph too early.
    const terrain = terrainLayers.map((_, index) => mesh(horizons[index], horizons[index + 1]));
    const skyMesh = mesh([[0, 0], [100, 0]], horizons[0]);
    // Muted material below each band covers joins without revealing later
    // mountains or stretching a boundary pixel into visible vertical streaks.
    // All skirt pixels are occluded by the next band in the settled composition.
    const skirts = terrainLayers.map((_, index) => mesh(horizons[index + 1], [[0, 100], [100, 100]], true));
    const titleMesh = mesh([[0, 0], [100, 0]]);
    const photoTexture = texture();
    const maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE) as number;
    let source: HTMLImageElement | HTMLCanvasElement = photo;
    if (Math.max(photo.naturalWidth, photo.naturalHeight) > maxTexture) {
      const scaled = document.createElement("canvas");
      const scale = maxTexture / Math.max(photo.naturalWidth, photo.naturalHeight);
      scaled.width = Math.round(photo.naturalWidth * scale);
      scaled.height = Math.round(photo.naturalHeight * scale);
      const context = scaled.getContext("2d");
      if (!context) throw new Error("Mountain texture scaling unavailable");
      context.drawImage(photo, 0, 0, scaled.width, scaled.height);
      source = scaled;
    }
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    const titleTexture = texture();
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    canvas.addEventListener("webglcontextlost", contextLost);
    host.append(canvas);

    function resize() {
      if (disposed) return;
      const box = host.getBoundingClientRect();
      width = Math.max(1, box.width); height = Math.max(1, box.height);
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5,
        Math.sqrt(1_800_000 / (width * height)), maxTexture / width, maxTexture / height);
      canvas.width = Math.max(1, Math.round(width * ratio));
      canvas.height = Math.max(1, Math.round(height * ratio));
      const scale = Math.max(width / sceneConfig.width, height / sceneConfig.height);
      const photoWidth = sceneConfig.width * scale;
      const photoHeight = sceneConfig.height * scale;
      fit = [(width - photoWidth) / 2, (height - photoHeight) * sceneConfig.focalY, photoWidth, photoHeight];
      const titleBox = title.getBoundingClientRect();
      titleFit = [titleBox.left - box.left, titleBox.top - box.top, titleBox.width, titleBox.height];
      const titleCanvas = document.createElement("canvas");
      const textRatio = Math.min(window.devicePixelRatio || 1, 2, maxTexture / Math.max(titleBox.width, titleBox.height, 1));
      titleCanvas.width = Math.max(1, Math.ceil(titleBox.width * textRatio));
      titleCanvas.height = Math.max(1, Math.ceil(titleBox.height * textRatio));
      const context = titleCanvas.getContext("2d");
      if (!context) throw new Error("Mountain title unavailable");
      context.scale(textRatio, textRatio);
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.shadowColor = "rgba(9,23,15,.55)";
      context.shadowBlur = 8;
      title.querySelectorAll<HTMLElement>("[data-title-line]").forEach((line) => {
        const style = getComputedStyle(line);
        const lineBox = line.getBoundingClientRect();
        context.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        context.letterSpacing = style.letterSpacing;
        const text = style.textTransform === "uppercase"
          ? (line.textContent ?? "").toLocaleUpperCase("vi-VN") : line.textContent ?? "";
        const x = titleBox.width / 2, y = lineBox.top - titleBox.top + lineBox.height / 2;
        const maxWidth = titleBox.width - 8;
        context.save();
        context.shadowBlur = 0; context.fillStyle = "rgba(24,41,28,.7)";
        context.fillText(text, x + 1.2, y + 2.4, maxWidth);
        context.restore();
        context.lineWidth = 1.2; context.strokeStyle = "rgba(28,43,31,.65)";
        context.strokeText(text, x, y, maxWidth);
        context.fillStyle = style.color;
        context.fillText(text, x, y, maxWidth);
      });
      gl!.bindTexture(gl!.TEXTURE_2D, titleTexture);
      gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, titleCanvas);
      draw(lastElapsed);
    }

    function draw(elapsed: number) {
      if (disposed) return;
      if (gl!.isContextLost()) throw new Error("Mountain context lost");
      lastElapsed = elapsed;
      gl!.viewport(0, 0, canvas.width, canvas.height);
      gl!.clearColor(1, 1, 1, 1);
      gl!.depthMask(true);
      gl!.clear(gl!.COLOR_BUFFER_BIT | gl!.DEPTH_BUFFER_BIT);
      gl!.uniform2f(uniforms.viewport, width, height);
      const paint = (item: { buffer: WebGLBuffer; count: number }, bounds: number[], depth: number, lift: number, turn: number, opacity: number, skirt = false) => {
        gl!.bindBuffer(gl!.ARRAY_BUFFER, item.buffer);
        gl!.enableVertexAttribArray(point);
        gl!.vertexAttribPointer(point, 2, gl!.FLOAT, false, 16, 0);
        gl!.enableVertexAttribArray(texturePoint);
        gl!.vertexAttribPointer(texturePoint, 2, gl!.FLOAT, false, 16, 8);
        gl!.uniform4fv(uniforms.fit, bounds);
        gl!.uniform1f(uniforms.depth, depth);
        gl!.uniform1f(uniforms.lift, lift);
        gl!.uniform1f(uniforms.turn, turn);
        gl!.uniform1f(uniforms.opacity, opacity);
        gl!.uniform1f(uniforms.skirt, skirt ? 1 : 0);
        gl!.drawArrays(gl!.TRIANGLES, 0, item.count);
      };
      gl!.bindTexture(gl!.TEXTURE_2D, photoTexture);
      // White is the opening frame; the original sky fades in behind the
      // mountains after their first rise, using the same photo and crop.
      const skyProgress = Math.max(0, Math.min(1, (elapsed - 650) / 1600));
      if (skyProgress) paint(skyMesh, fit, -1.15, 0, 0, skyProgress);
      const materials = [[0.43,0.43,0.38],[0.52,0.47,0.37],[0.2,0.26,0.19],[0.14,0.22,0.17]];
      terrainLayers.forEach((layer, index) => {
        const progress = Math.max(0, Math.min(1, (elapsed - layer.delay) / layer.duration));
        if (!progress) return;
        const remaining = Math.pow(1 - progress, 3);
        gl!.uniform3fv(uniforms.materialColor, materials[index]);
        paint(skirts[index], fit, layer.depth, remaining * 1.15, remaining * 0.075, 1, true);
        paint(terrain[index], fit, layer.depth, remaining * 1.15, remaining * 0.075, 1);
      });
      const titleProgress = Math.max(0, Math.min(1, (elapsed - 1250) / 1400));
      if (titleProgress) {
        gl!.depthMask(false);
        gl!.bindTexture(gl!.TEXTURE_2D, titleTexture);
        paint(titleMesh, titleFit, 0.05, Math.pow(1 - titleProgress, 3) * 0.12,
          (1 - titleProgress) * 0.035, Math.min(1, titleProgress * 2));
      }
      if (gl!.getError() !== gl!.NO_ERROR) throw new Error("Mountain drawing failed");
      canvas.dataset.elapsed = String(Math.round(elapsed));
    }

    resize();
    return { draw, resize, dispose };
  } catch (error) {
    dispose();
    throw error;
  }
}
