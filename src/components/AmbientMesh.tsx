/**
 * AmbientMesh — animated pastel mesh gradient background.
 *
 * Hand-rolled WebGL1 fullscreen shader (no deps). 4 drifting blob centers
 * mixed against a pastel palette, distorted by 4-octave fbm noise for
 * organic flow, plus per-pixel film grain.
 *
 * Cost: GPU-only, ~0% CPU. Pauses when offscreen via IntersectionObserver.
 * Falls back to a static CSS gradient when prefers-reduced-motion is set
 * or WebGL is unavailable.
 *
 * Source palette: matches Figma Topic Board New / node 9379:38996.
 */

import { useEffect, useRef } from 'react';

const VERT = `
attribute vec2 aPos;
void main() {
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const FRAG = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.02;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  float aspect = uResolution.x / uResolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);

  float t = uTime * 0.05;

  // Slow-drifting blob centers (in aspect-corrected space)
  vec2 c1 = vec2(0.20 * aspect + 0.18 * sin(t * 0.71), 0.30 + 0.12 * cos(t * 0.93));
  vec2 c2 = vec2(0.88 * aspect + 0.14 * cos(t * 0.53), 0.22 + 0.16 * sin(t * 1.13));
  vec2 c3 = vec2(0.28 * aspect + 0.15 * sin(t * 1.27), 0.82 + 0.10 * cos(t * 0.61));
  vec2 c4 = vec2(0.78 * aspect + 0.12 * cos(t * 0.83), 0.78 + 0.13 * sin(t * 0.74));

  // Domain warp via fbm — gives the mesh its liquid feel
  float w1 = fbm(p * 1.6 + vec2(t, -t * 0.5));
  float w2 = fbm(p * 1.6 + vec2(-t * 0.7, t * 0.3) + 5.2);
  vec2 wp = p + vec2(w1, w2) * 0.32;

  float d1 = 1.0 - smoothstep(0.0, 0.85, length(wp - c1));
  float d2 = 1.0 - smoothstep(0.0, 0.85, length(wp - c2));
  float d3 = 1.0 - smoothstep(0.0, 0.85, length(wp - c3));
  float d4 = 1.0 - smoothstep(0.0, 0.85, length(wp - c4));

  // Pastel palette (sampled from the Figma reference)
  vec3 base     = vec3(0.960, 0.960, 0.935);
  vec3 sage     = vec3(0.780, 0.870, 0.770);
  vec3 lavender = vec3(0.825, 0.860, 0.910);
  vec3 cream    = vec3(0.925, 0.905, 0.775);
  vec3 mint     = vec3(0.840, 0.920, 0.850);

  vec3 col = base;
  col = mix(col, sage,     d1 * 0.85);
  col = mix(col, lavender, d2 * 0.85);
  col = mix(col, cream,    d3 * 0.85);
  col = mix(col, mint,     d4 * 0.85);

  // Subtle film grain — hashed per pixel, jittered each frame
  float grain = (hash(gl_FragCoord.xy + fract(uTime) * 100.0) - 0.5) * 0.045;
  col += grain;

  // Soft vignette to anchor the frame
  vec2 vd = uv - 0.5;
  float vignette = 1.0 - dot(vd, vd) * 0.35;
  col *= vignette;

  gl_FragColor = vec4(col, 1.0);
}
`;

interface AmbientMeshProps {
  className?: string;
}

const STATIC_FALLBACK =
  'radial-gradient(at 20% 30%, #c7decc 0%, transparent 55%),' +
  'radial-gradient(at 85% 25%, #d3dde9 0%, transparent 55%),' +
  'radial-gradient(at 30% 85%, #ece8c8 0%, transparent 55%),' +
  'radial-gradient(at 80% 80%, #d6ecd9 0%, transparent 55%),' +
  'linear-gradient(#f5f4ee, #f5f4ee)';

function compileShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function AmbientMesh({ className }: AmbientMeshProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      wrap.style.background = STATIC_FALLBACK;
      return;
    }

    const gl = canvas.getContext('webgl', { antialias: false, alpha: false });
    if (!gl) {
      wrap.style.background = STATIC_FALLBACK;
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) {
      wrap.style.background = STATIC_FALLBACK;
      return;
    }

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      wrap.style.background = STATIC_FALLBACK;
      return;
    }
    gl.useProgram(program);

    // Fullscreen triangle
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW
    );
    const aPos = gl.getAttribLocation(program, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'uResolution');
    const uTime = gl.getUniformLocation(program, 'uTime');

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    let running = true;
    let raf = 0;
    const start = performance.now();
    const tick = () => {
      if (!running) return;
      const t = (performance.now() - start) / 1000;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(tick);
    };
    tick();

    // Pause when offscreen to save battery
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          tick();
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 }
    );
    io.observe(wrap);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div ref={wrapRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
