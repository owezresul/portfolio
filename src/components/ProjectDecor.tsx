import type { CSSProperties } from 'react'
import { animations } from '../animations/config'
import ball from '../assets/projects/ball.webp'
import tea from '../assets/projects/tea.webp'
import trophy from '../assets/projects/trophy.webp'

/** Same hover zoom the PlantMama image has, applied to each scene's main object */
const HOVER = animations.projectCards
  ? 'origin-bottom transition-[scale] duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none'
  : ''

export type DecorKind = 'pitch' | 'petals' | 'tea'

/**
 * Small decorative objects that live inside a project card and move on
 * their own (no hover needed, so they work on phones too).
 * Frozen automatically when the visitor prefers reduced motion.
 */
export default function ProjectDecor({ kind }: { kind: DecorKind }) {
  const on = animations.idleObjects
  if (kind === 'pitch') return <PitchScene animate={on} />
  if (kind === 'tea') return <TeaScene animate={on} />
  return <Petals animate={on} />
}

/* ───────── Football pitch: grass, lines, trophy + ball ───────── */

function PitchLines({ vertical }: { vertical: boolean }) {
  // Real pitch proportions (105 × 68 m), drawn once and rotated for mobile
  const L = 105
  const W = 68
  const lines = (
    <>
      <line x1={L / 2} y1="3" x2={L / 2} y2={W - 3} />
      <circle cx={L / 2} cy={W / 2} r="9.15" />
      <circle cx={L / 2} cy={W / 2} r="0.6" className="fill-white/60" />
      {[0, 1].map((side) => {
        const x = side ? L - 3 : 3
        const dir = side ? -1 : 1
        return (
          <g key={side}>
            <rect x={side ? x - 16.5 : x} y={W / 2 - 20.15} width="16.5" height="40.3" />
            <rect x={side ? x - 5.5 : x} y={W / 2 - 9.15} width="5.5" height="18.3" />
            <circle cx={x + dir * 11} cy={W / 2} r="0.6" className="fill-white/60" />
            <path d={`M ${x + dir * 16.5} ${W / 2 - 7.3} A 9.15 9.15 0 0 ${side ? 0 : 1} ${x + dir * 16.5} ${W / 2 + 7.3}`} />
          </g>
        )
      })}
    </>
  )
  return (
    <svg
      viewBox={vertical ? `3 3 ${W - 6} ${L - 6}` : `3 3 ${L - 6} ${W - 6}`}
      preserveAspectRatio="xMidYMid slice"
      className="pitch-lines absolute inset-0 size-full"
      aria-hidden="true"
    >
      <g
        fill="none"
        stroke="rgb(255 255 255 / 0.55)"
        strokeWidth="2"
        transform={vertical ? `translate(${W} 0) rotate(90)` : undefined}
      >
        {lines}
      </g>
    </svg>
  )
}

function PitchScene({ animate }: { animate: boolean }) {
  return (
    <>
      {/* Grass with mowing stripes (vertical stripes on desktop, horizontal on phones) */}
      <div aria-hidden="true" className="pitch-grass absolute inset-0 -z-20">
        <div className="desk:hidden">
          <PitchLines vertical />
        </div>
        <div className="hidden desk:block">
          <PitchLines vertical={false} />
        </div>
      </div>

      {/* Darkens the left/bottom so the text stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-[15] bg-gradient-to-t from-[#04120a] via-[#04120a]/75 via-45% to-transparent to-80% desk:bg-gradient-to-r desk:via-[#04120a]/55 desk:to-65%"
      />

      {/* Trophy + ball */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-4 right-4 -z-[5] aspect-[0.92] h-[46%] desk:top-[8%] desk:right-[6%] desk:h-[84%] ${HOVER}`}
      >
        <div className={`absolute top-0 right-0 h-[92%] ${animate ? 'decor-float-slow' : ''}`}>
          <img src={trophy} alt="" loading="lazy" decoding="async" className="h-full w-auto drop-shadow-[0_18px_24px_rgb(0_0_0/0.55)]" />
        </div>
        <div className={`absolute bottom-[6%] left-0 aspect-square w-[46%] ${animate ? 'decor-float' : ''}`}>
          <img
            src={ball}
            alt=""
            loading="lazy"
            decoding="async"
            className={`size-full drop-shadow-[0_14px_18px_rgb(0_0_0/0.55)] ${animate ? 'decor-spin' : ''}`}
          />
        </div>
        {/* Ground shadows */}
        <div className={`absolute -bottom-[1%] left-[4%] h-[6%] w-[38%] rounded-[50%] bg-black/50 blur-md ${animate ? 'decor-shadow' : ''}`} />
        <div className="absolute right-[6%] bottom-[5%] h-[5%] w-[42%] rounded-[50%] bg-black/45 blur-md" />
      </div>
    </>
  )
}

/* ───────── Drifting petals ───────── */

const PETALS = [
  { left: '10%', size: 20, delay: 0, dur: 9, color: '#f48fb1' },
  { left: '28%', size: 14, delay: 2.5, dur: 11, color: '#f8bbd0' },
  { left: '46%', size: 22, delay: 5, dur: 10, color: '#ec8fc8' },
  { left: '62%', size: 15, delay: 1.2, dur: 12, color: '#ffcc80' },
  { left: '78%', size: 18, delay: 6.5, dur: 9.5, color: '#f48fb1' },
  { left: '90%', size: 13, delay: 3.8, dur: 11.5, color: '#ce93d8' },
]

function Petals({ animate }: { animate: boolean }) {
  if (!animate) return null
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 -z-[5] h-[65%] overflow-hidden">
      {PETALS.map((p, i) => (
        <span
          key={i}
          className="decor-petal absolute -top-6 block rounded-[60%_0_60%_0]"
          style={
            {
              left: p.left,
              width: p.size,
              height: p.size * 0.75,
              background: p.color,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  )
}

/* ───────── Tea dealer: floating tea box, incense smoke, drifting leaves ───────── */

const LEAVES = [
  { top: '18%', left: '8%', size: 22, delay: 0, dur: 14 },
  { top: '55%', left: '2%', size: 16, delay: 4, dur: 17 },
  { top: '30%', left: '70%', size: 18, delay: 8, dur: 15 },
  { top: '70%', left: '40%', size: 14, delay: 2, dur: 19 },
]

function TeaLeaf({ size }: { size: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true">
      <path d="M3 21C3 11 9 3 21 3c0 12-8 18-18 18Z" fill="#6f7a2e" />
      <path d="M3 21 15 9" stroke="#3d4418" strokeWidth="1.2" fill="none" />
    </svg>
  )
}

function TeaScene({ animate }: { animate: boolean }) {
  return (
    <>
      {/* Warm lamp glow behind the box */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute top-[5%] right-[5%] -z-[8] aspect-square w-[75%] rounded-full bg-[radial-gradient(circle,rgb(246_179_62/0.32),transparent_65%)] ${
          animate ? 'decor-glow' : ''
        }`}
      />

      <div
        aria-hidden="true"
        className={`tea-image pointer-events-none absolute right-0 bottom-0 -z-[5] aspect-square h-[78%] desk:h-[96%] ${HOVER}`}
      >
        <div className={`size-full ${animate ? 'decor-float-gentle' : ''}`}>
          <img src={tea} alt="" loading="lazy" decoding="async" className="size-full object-contain" />
        </div>

        {/* Incense smoke curling up from the brass holder */}
        {animate && (
          <div className="absolute top-[22%] left-[84%] h-[52%] w-[16%]">
            {[0, 1, 2].map((i) => (
              <svg
                key={i}
                viewBox="0 0 40 160"
                preserveAspectRatio="none"
                className="decor-smoke absolute bottom-0 left-0 size-full"
                style={{ animationDelay: `${i * 2.3}s` }}
              >
                <path
                  d="M20 160 C 6 130, 34 110, 20 80 S 6 30, 22 0"
                  fill="none"
                  stroke="rgb(255 255 255 / 0.35)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            ))}
          </div>
        )}
      </div>

      {/* Keeps the text readable where it overlaps the photo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-[4] bg-gradient-to-t from-navy via-navy/85 via-30% to-transparent to-60% desk:bg-[linear-gradient(to_top,var(--color-navy)_0%,rgb(18_24_39/0.85)_28%,transparent_55%),linear-gradient(to_right,var(--color-navy)_0%,rgb(18_24_39/0.6)_35%,transparent_60%)]"
      />

      {/* A few tea leaves drifting through */}
      {animate &&
        LEAVES.map((l, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="decor-leaf pointer-events-none absolute -z-[4] block opacity-0"
            style={{ top: l.top, left: l.left, animationDelay: `${l.delay}s`, animationDuration: `${l.dur}s` }}
          >
            <TeaLeaf size={l.size} />
          </span>
        ))}
    </>
  )
}
