// Benchmark-only geometry. Never imported by a production route; no geographic claim.
export function mountTerrainSpike(host) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "Địa hình 3D minh họa — prototype kỹ thuật");
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;pointer-events:none";
  host.append(canvas);
  const gl = canvas.getContext("webgl", { antialias: true, alpha: false });
  if (!gl) { canvas.remove(); return { supported: false, stop() {} }; }
  function shader(type, source) {
    const shader = gl.createShader(type); gl.shaderSource(shader, source); gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw Error("Spike shader compilation failed");
    return shader;
  }
  const vertex = shader(gl.VERTEX_SHADER, `attribute vec3 position;attribute vec3 color;uniform float angle;uniform float aspect;varying vec3 tint;void main(){float c=cos(angle),s=sin(angle);vec3 p=vec3(position.x*c-position.z*s,position.y,position.x*s+position.z*c);float y=p.y*.80-p.z*.60;float z=p.y*.60+p.z*.80;float d=3.2+z;gl_Position=vec4(p.x*2.4/aspect,y*2.4,d-1.0,d);tint=color;}`);
  const fragment = shader(gl.FRAGMENT_SHADER, "precision mediump float;varying vec3 tint;void main(){gl_FragColor=vec4(tint,1.0);}");
  const program = gl.createProgram(); gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw Error("Spike program link failed");
  gl.useProgram(program);
  const vertices = []; const cells = 64;
  function point(x, z) {
    const height = Math.sin(x * 5) * Math.cos(z * 4) * .17 + Math.sin(x * 9 + z * 6) * .08;
    vertices.push(x, height - .18, z, .17 + height * .3, .31 + height * .4, .23 + height * .2);
  }
  for (let x = 0; x < cells; x++) for (let z = 0; z < cells; z++) {
    const a = x * 2 / cells - 1, b = z * 2 / cells - 1, d = 2 / cells;
    point(a,b); point(a+d,b); point(a,b+d); point(a+d,b); point(a+d,b+d); point(a,b+d);
  }
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  const data = new Float32Array(vertices); gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  for (const [attribute, offset] of [["position",0],["color",12]]) {
    const location = gl.getAttribLocation(program, attribute); gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 24, offset);
  }
  const angle = gl.getUniformLocation(program, "angle"), aspect = gl.getUniformLocation(program, "aspect");
  gl.enable(gl.DEPTH_TEST);
  let raf = 0; let stopped = false; let last = 0; const intervals = [];
  function draw(time) {
    if (stopped) return;
    const box = host.getBoundingClientRect(), ratio = Math.min(devicePixelRatio, 2);
    if (canvas.width !== Math.round(box.width * ratio) || canvas.height !== Math.round(box.height * ratio)) {
      canvas.width = Math.round(box.width * ratio); canvas.height = Math.round(box.height * ratio);
    }
    gl.viewport(0,0,canvas.width,canvas.height); gl.clearColor(.07,.12,.09,1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.uniform1f(angle, Math.sin(time * .00015) * .4); gl.uniform1f(aspect, box.width / box.height);
    gl.drawArrays(gl.TRIANGLES, 0, data.length / 6);
    if (last) intervals.push(time - last); last = time; raf = requestAnimationFrame(draw);
  }
  raf = requestAnimationFrame(draw);
  return { supported: true, canvas, vertices: data.length / 6, geometryBytes: data.byteLength, intervals,
    stop() { stopped = true; cancelAnimationFrame(raf); gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.deleteShader(vertex); gl.deleteShader(fragment); gl.getExtension("WEBGL_lose_context")?.loseContext(); canvas.remove(); } };
}
