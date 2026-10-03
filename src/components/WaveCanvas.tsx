import { useEffect, useRef } from 'react'
import { animations } from '../animations/config'
import { palettes, type SurfacePalette } from '../webgl/palettes'
import { fragmentShader, vertexShader } from '../webgl/waveShader'

interface Surface {
  el: HTMLElement
  palette: Float32Array
  mode: number
  fadeTop: number // css px
  radii: [number, number, number, number] // tr, br, tl, bl
  seed: [number, number]
}

const SEEDS: [number, number][] = [
  [3.1, 7.4],
  [11.2, 2.6],
  [5.7, 13.9],
  [19.3, 4.1],
  [8.8, 21.5],
  [2.2, 16.4],
]

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? 'shader error')
  return s
}

/**
 * Living wave background. One fixed, full-screen canvas sits behind the page
 * and paints every element marked with data-wave="wine|red|contact|night|frame", plus the
 * page background itself. If WebGL is unavailable the CSS gradients remain.
 */
export default function WaveCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    // Start after the first paint so the page shows up fast; the CSS
    // gradients cover the gap (and the hero intro hides the swap).
    let stop: (() => void) | undefined
    let cancelled = false
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1))
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout
    const handle = idle(
      () => {
        if (!cancelled) stop = start()
      },
      { timeout: 400 },
    )
    return () => {
      cancelled = true
      cancelIdle(handle)
      stop?.()
    }

    function start(): (() => void) | undefined {
      const canvas = ref.current
      if (!canvas) return
      const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false })
      if (!gl) return

      let program: WebGLProgram
      try {
        program = gl.createProgram()!
        gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, vertexShader))
        gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, fragmentShader))
        gl.linkProgram(program)
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) ?? '')
      } catch (e) {
        console.warn('Wave shader failed, using CSS fallback', e)
        return
      }
      gl.useProgram(program)

      // One big triangle covering the screen
      const buf = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, buf)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
      const pos = gl.getAttribLocation(program, 'position')
      gl.enableVertexAttribArray(pos)
      gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)

      gl.enable(gl.BLEND)
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

      const names = [
        'uRes',
        'uDpr',
        'uTime',
        'uScroll',
        'uDocH',
        'uMode',
        'uRect',
        'uRadii',
        'uMouse',
        'uMouseOn',
        'uSeed',
        'uFadeTop',
        'uOpacity',
        'uA',
        'uB',
        'uC',
      ] as const
      const u = Object.fromEntries(names.map((n) => [n, gl.getUniformLocation(program, n)])) as Record<
        (typeof names)[number],
        WebGLUniformLocation | null
      >

      const root = document.documentElement
      root.classList.add('webgl-on')

      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      // Phones and weak machines: lower resolution and 30fps (the waves are slow anyway)
      const coarse = window.matchMedia('(pointer: coarse)').matches
      const lowPower = (navigator.hardwareConcurrency ?? 8) <= 4
      const halfRate = coarse || lowPower
      const moving = () => animations.waveBackground && !reduceMotion.matches

      let dpr = 1
      let surfaces: Surface[] = []
      let dirty = true

      const px = (v: string) => parseFloat(v) || 0

      const collect = () => {
        surfaces = Array.from(document.querySelectorAll<HTMLElement>('[data-wave]')).map((el, i) => {
          const cs = getComputedStyle(el)
          return {
            el,
            mode: el.dataset.wave === 'frame' ? 2 : 0,
            // data-fade-top is in rem so it scales with the layout
            fadeTop: (parseFloat(el.dataset.fadeTop ?? '0') || 0) * px(getComputedStyle(root).fontSize),
            palette: palettes[(el.dataset.wave as SurfacePalette) ?? 'wine'] ?? palettes.wine,
            radii: [
              px(cs.borderTopRightRadius),
              px(cs.borderBottomRightRadius),
              px(cs.borderTopLeftRadius),
              px(cs.borderBottomLeftRadius),
            ],
            seed: SEEDS[i % SEEDS.length],
          }
        })
      }

      const resize = () => {
        // Soft waves don't need full retina resolution; keeps cheap phones smooth
        dpr = Math.min(window.devicePixelRatio || 1, lowPower ? 1 : window.innerWidth < 900 ? 1.25 : 1.5)
        canvas.width = Math.round(canvas.clientWidth * dpr)
        canvas.height = Math.round(canvas.clientHeight * dpr)
        collect()
        dirty = true
      }

      // Cursor, eased so the waves trail behind it
      const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999, on: 0, targetOn: 0 }
      const onPointer = (e: PointerEvent) => {
        mouse.tx = e.clientX
        mouse.ty = e.clientY
        if (mouse.targetOn === 0) {
          mouse.x = e.clientX
          mouse.y = e.clientY
        }
        mouse.targetOn = 1
      }
      const onLeave = () => (mouse.targetOn = 0)
      const onScroll = () => (dirty = true)

      const draw = (time: number) => {
        const W = canvas.width
        const H = canvas.height
        const cssH = canvas.clientHeight

        gl.viewport(0, 0, W, H)
        gl.disable(gl.SCISSOR_TEST)
        gl.clearColor(0, 0, 0, 0)
        gl.clear(gl.COLOR_BUFFER_BIT)

        gl.uniform2f(u.uRes, W, H)
        gl.uniform1f(u.uDpr, dpr)
        gl.uniform1f(u.uTime, time)
        gl.uniform1f(u.uScroll, window.scrollY)
        gl.uniform1f(u.uDocH, root.scrollHeight)
        gl.uniform2f(u.uMouse, mouse.x * dpr, (cssH - mouse.y) * dpr)
        gl.uniform1f(u.uMouseOn, mouse.on)

        // 1. Page background
        gl.uniform1f(u.uMode, 1)
        gl.uniform4f(u.uRect, 0, 0, W, H)
        gl.uniform4f(u.uRadii, 0, 0, 0, 0)
        gl.uniform2f(u.uSeed, 0, 0)
        gl.uniform1f(u.uFadeTop, 0)
        gl.uniform1f(u.uOpacity, 1)
        gl.uniform3fv(u.uA, palettes.pageTop)
        gl.uniform3fv(u.uB, palettes.pageBottom)
        gl.uniform3fv(u.uC, palettes.pageRed)
        gl.drawArrays(gl.TRIANGLES, 0, 3)

        // 2. Each surface, clipped to its own rectangle (DOM order, parents first)
        gl.enable(gl.SCISSOR_TEST)
        for (const s of surfaces) {
          const r = s.el.getBoundingClientRect()
          if (r.bottom < 0 || r.top > cssH || r.width === 0) continue
          // Animations fade surfaces with inline opacity; mirror it here
          const op = s.el.style.opacity === '' ? 1 : parseFloat(s.el.style.opacity)
          if (op <= 0) continue
          const x = r.left * dpr
          const y = (cssH - r.bottom) * dpr
          const w = r.width * dpr
          const h = r.height * dpr
          const sx = Math.max(0, Math.floor(x))
          const sy = Math.max(0, Math.floor(y))
          gl.scissor(sx, sy, Math.min(W, Math.ceil(x + w)) - sx, Math.min(H, Math.ceil(y + h)) - sy)
          gl.uniform1f(u.uMode, s.mode)
          gl.uniform1f(u.uFadeTop, s.fadeTop)
          gl.uniform1f(u.uOpacity, op)
          gl.uniform4f(u.uRect, x, y, w, h)
          gl.uniform4f(u.uRadii, ...s.radii)
          gl.uniform2f(u.uSeed, ...s.seed)
          gl.uniform3fv(u.uA, s.palette)
          gl.drawArrays(gl.TRIANGLES, 0, 3)
        }
      }

      let raf = 0
      const start = performance.now()
      const STILL_TIME = 12 // a nice-looking frame for reduced motion

      // When the waves are frozen, still redraw if a surface moved or faded
      // (e.g. during the intro animation)
      let lastSig = ''
      const signature = () =>
        surfaces
          .map((s) => {
            const r = s.el.getBoundingClientRect()
            return `${r.left | 0},${r.top | 0},${r.width | 0},${r.height | 0},${s.el.style.opacity}`
          })
          .join('|')

      let frame = 0
      const loop = (now: number) => {
        raf = requestAnimationFrame(loop)
        if (halfRate && frame++ % 2) return
        if (!moving()) {
          const sig = signature()
          if (sig !== lastSig) {
            lastSig = sig
            dirty = true
          }
        }
        if (moving()) {
          mouse.x += (mouse.tx - mouse.x) * 0.06
          mouse.y += (mouse.ty - mouse.y) * 0.06
          mouse.on += (mouse.targetOn - mouse.on) * 0.04
          draw((now - start) / 1000)
        } else if (dirty) {
          mouse.on = 0
          draw(STILL_TIME)
        }
        dirty = false
      }

      const onLost = (e: Event) => {
        e.preventDefault()
        cancelAnimationFrame(raf)
        root.classList.remove('webgl-on') // fall back to CSS gradients
      }

      resize()
      // Layout changes (fonts loading, images, breakpoints) move the surfaces
      const ro = new ResizeObserver(resize)
      ro.observe(document.body)
      window.addEventListener('resize', resize)
      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('pointermove', onPointer, { passive: true })
      document.addEventListener('pointerleave', onLeave)
      reduceMotion.addEventListener('change', onScroll)
      canvas.addEventListener('webglcontextlost', onLost)
      raf = requestAnimationFrame(loop)

      return () => {
        cancelAnimationFrame(raf)
        ro.disconnect()
        window.removeEventListener('resize', resize)
        window.removeEventListener('scroll', onScroll)
        window.removeEventListener('pointermove', onPointer)
        document.removeEventListener('pointerleave', onLeave)
        reduceMotion.removeEventListener('change', onScroll)
        canvas.removeEventListener('webglcontextlost', onLost)
        root.classList.remove('webgl-on')
      }
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 h-full w-full" />
}
