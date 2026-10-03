import resul from '../assets/resul.webp'
import { SplitWords } from './Split'

const ROLES = ['Web Developer', 'Mobile Developer', 'UX/UI designer', 'AI Specialist']

export default function Hero() {
  return (
    <header className="grid gap-3 desk:grid-cols-[1.45fr_1fr] desk:gap-4">
      {/* Text card */}
      <div
        data-wave="wine"
        data-hero-card
        className="wave-wine flex flex-col justify-between gap-8 rounded-[1.75rem] p-6 desk:min-h-[clamp(36rem,36vw,52rem)] desk:p-10"
      >
        <div>
          <p data-hero-label className="text-xs font-bold tracking-wide uppercase desk:text-[clamp(0.875rem,0.8vw,1.05rem)]">
            Resul Ovezmyradov
          </p>

          <h1
            data-hero-title
            className="mt-6 max-w-[14ch] text-[clamp(1.75rem,3.6vw,4.75rem)] leading-[1.05] font-semibold desk:mt-10"
          >
            <SplitWords text="Architecting Next-Gen Digital Products" />
          </h1>

          <p
            data-hero-text
            className="mt-4 max-w-[34ch] text-[clamp(0.95rem,1.8vw,2.3rem)] leading-snug font-light text-white/50"
          >
            Combining human-centered design, robust web engineering, and cutting-edge AI capabilities to turn
            complex ideas into refined software.
          </p>

          <a
            href="#contact"
            data-hero-cta
            className="mt-7 inline-block rounded-full bg-red-strong px-6 py-2.5 text-sm font-semibold desk:px-8 desk:py-3 desk:text-[clamp(1rem,1vw,1.25rem)]"
          >
            Let’s work together!
          </a>
        </div>

        <ul className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {ROLES.map((role, i) => (
            <li key={role} data-hero-pill className="flex items-center gap-1.5">
              {i > 0 && <span className="hidden size-1 rounded-full bg-white desk:block" aria-hidden="true" />}
              <span className="rounded-full border border-white/80 px-3 py-0.5 text-[0.7rem] desk:px-4 desk:py-1 desk:text-[clamp(0.875rem,0.8vw,1.05rem)]">
                {role}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Photo card. On phones it comes first so your face is the first thing
          people see. The card stays still; the photo tilts toward the cursor. */}
      <div
        data-wave="wine"
        data-hero-card
        data-tilt-area
        className="wave-wine relative order-first h-[22rem] overflow-hidden rounded-[1.75rem] desk:order-none desk:h-auto"
      >
        {/* Soft pink backlight so dark hair separates from the dark card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-[2%] left-1/2 aspect-square w-[85%] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(232_136_209/0.38),rgb(255_0_61/0.12)_45%,transparent_68%)]"
        />
        {/* Sits slightly below the card edge so tilting never reveals the cut */}
        <div data-tilt-inner className="absolute inset-x-0 top-[6%] bottom-[-4%] flex items-end justify-center">
          <img
            src={resul}
            alt="Resul Ovezmyradov"
            width={1100}
            height={1299}
            decoding="async"
            fetchPriority="high"
            className="h-full w-auto max-w-none object-contain object-bottom drop-shadow-[0_20px_40px_rgb(0_0_0/0.45)]"
          />
        </div>
      </div>
    </header>
  )
}
