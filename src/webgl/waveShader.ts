export const vertexShader = /* glsl */ `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`

/**
 * One shader draws every wave surface. Each surface is drawn into its own
 * on-screen rectangle (via scissor) with its own palette and rounded corners,
 * so a single WebGL context covers the whole page.
 */
export const fragmentShader = /* glsl */ `
precision highp float;

uniform vec2  uRes;      // canvas size, device px
uniform float uDpr;
uniform float uTime;
uniform float uScroll;   // window.scrollY, css px
uniform float uDocH;     // document height, css px
uniform float uMode;     // 0 = wave surface, 1 = page background, 2 = glossy frame
uniform vec4  uRect;     // x, y (bottom-left), w, h — device px
uniform vec4  uRadii;    // top-right, bottom-right, top-left, bottom-left — css px
uniform vec2  uMouse;    // device px, bottom-left origin
uniform float uMouseOn;  // 0..1
uniform vec2  uSeed;
uniform float uFadeTop;  // css px: top edge melts into whatever is behind
uniform float uOpacity;  // follows the element's own opacity (for fade-in animations)
uniform vec3  uA[4];     // palette (top of page for page mode)
uniform vec3  uB[4];     // bottom-of-page palette (page mode only)
uniform vec3  uC[4];     // top-of-page red palette (page mode only)

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

// Silky ribbons: diagonal sine bands bent by slow-moving noise
float field(vec2 p) {
  float t = uTime;
  // Smooth domain warping with sines gives folded-silk ribbons;
  // a little low-frequency noise keeps it from looking too regular.
  vec2 q = p;
  q += 0.55 * vec2(sin(p.y * 1.3 + t * 0.20), sin(p.x * 1.1 - t * 0.16));
  q += 0.28 * vec2(sin(q.y * 2.1 + 1.7 - t * 0.11), sin(q.x * 1.9 + t * 0.09));
  float n = noise(p * 0.4 + vec2(t * 0.02, 0.0));
  return sin(dot(q, vec2(5.0, 3.3)) + n * 1.5);
}

// Rounded box SDF with per-corner radii (Inigo Quilez)
float sdRoundBox(vec2 p, vec2 b, vec4 r) {
  r.xy = (p.x > 0.0) ? r.xy : r.zw;
  r.x  = (p.y > 0.0) ? r.x  : r.y;
  vec2 q = abs(p) - b + r.x;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r.x;
}

void main() {
  vec2 frag  = gl_FragCoord.xy;
  vec2 size  = uRect.zw;
  vec2 local = frag - uRect.xy;

  float d = sdRoundBox(local - size * 0.5, size * 0.5, uRadii * uDpr);
  // Anti-alias rounded corners only; square edges stay crisp so
  // neighbouring surfaces meet without a seam
  float alpha = dot(uRadii, vec4(1.0)) > 0.0 ? 1.0 - smoothstep(-0.75, 0.75, d) : 1.0;
  if (uFadeTop > 0.0) {
    float fromTop = (size.y - local.y) / (uFadeTop * uDpr);
    alpha *= smoothstep(0.0, 1.0, fromTop);
  }
  alpha *= uOpacity;
  if (alpha <= 0.0) discard;

  float unit = 380.0 * uDpr;
  vec2 p = local / unit + uSeed;
  // Page background drifts slower than the content (parallax)
  if (uMode > 0.5 && uMode < 1.5) p.y -= uScroll * 0.35 / 380.0;

  // Cursor gently pulls the ribbons toward it
  vec2 m = (uMouse - frag) / unit;
  float md = exp(-dot(m, m) * 5.0) * uMouseOn;
  p += m * md * 0.28;

  float f  = field(p);
  float fx = field(p + vec2(0.015, 0.0));
  float fy = field(p + vec2(0.0, 0.015));
  vec2 grad = vec2(fx - f, fy - f) / 0.015;
  float light = smoothstep(0.0, 1.0, clamp(0.5 + dot(grad, vec2(-0.7, 0.7)) * 0.075, 0.0, 1.0));
  float shade = f * 0.5 + 0.5;

  vec2 uv = local / size;

  // Glossy hero frame: red top-left, wine middle, white-pink glow bottom
  if (uMode > 1.5) {
    float t = clamp((uv.x + (1.0 - uv.y)) * 0.5, 0.0, 1.0);
    vec3 col = mix(uA[0], uA[1], smoothstep(0.0, 0.35, t));
    col = mix(col, uA[2], smoothstep(0.35, 0.6, t));
    col = mix(col, uA[3], smoothstep(0.6, 1.0, t));
    float br = length((uv - vec2(1.0, 0.0)) * vec2(1.0, 1.25));
    float bl = length((uv - vec2(0.0, 0.0)) * vec2(1.7, 1.25));
    col = mix(col, vec3(0.953, 0.714, 0.89), (1.0 - smoothstep(0.1, 0.75, br)) * 0.85);
    col = mix(col, vec3(1.0), 1.0 - smoothstep(0.0, 0.32, br));
    col = mix(col, vec3(1.0, 0.88, 0.95), (1.0 - smoothstep(0.0, 0.55, bl)) * 0.8);
    col *= 0.93 + 0.14 * light;
    gl_FragColor = vec4(col * alpha, alpha);
    return;
  }

  vec3 c0, c1, c2, c3;
  float g;

  if (uMode > 0.5) {
    float cssY = (uRes.y - frag.y) / uDpr;
    float docY = (cssY + uScroll) / uDocH;
    // Red at the very top, melting into dark over ~1.3 screens,
    // then warming back to red toward the contact section
    float vh = uRes.y / uDpr;
    float docPx = cssY + uScroll;
    float top = 1.0 - smoothstep(0.1 * vh, 1.4 * vh, docPx + (uv.x - 0.5) * 0.25 * vh);
    float t = smoothstep(0.45, 0.95, docY + (0.35 - uv.x) * 0.3);
    c0 = mix(mix(uA[0], uB[0], t), uC[0], top);
    c1 = mix(mix(uA[1], uB[1], t), uC[1], top);
    c2 = mix(mix(uA[2], uB[2], t), uC[2], top);
    c3 = mix(mix(uA[3], uB[3], t), uC[3], top);
    g = 0.35 + max(t, top) * 0.3;
  } else {
    c0 = uA[0]; c1 = uA[1]; c2 = uA[2]; c3 = uA[3];
    // brighter toward the bottom-left, like the Figma
    g = clamp(1.0 - uv.y * 0.85 + (0.5 - uv.x) * 0.2, 0.0, 1.0);
  }

  vec3 col = mix(c0, c1, smoothstep(0.0, 1.0, shade * 0.7 + g * 0.45));
  col = mix(col, c2, smoothstep(0.55, 1.0, shade * 0.5 + g * 0.6) * 0.7);
  col *= 0.62 + 0.62 * light;
  col += c3 * pow(light, 6.0) * 0.28;

  gl_FragColor = vec4(col * alpha, alpha); // premultiplied
}
`
