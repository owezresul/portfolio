import { animations } from '../animations/config'
import type { Project } from '../data/projects'
import ProjectDecor from './ProjectDecor'

const THEME = {
  light: { card: 'bg-white', text: 'text-black/55', title: 'text-moss', fade: 'from-white via-white/70' },
  dark: { card: 'bg-black', text: 'text-white/85', title: 'text-white', fade: 'from-black via-black/60' },
  navy: { card: 'bg-navy', text: 'text-white/85', title: 'text-white', fade: 'from-navy via-navy/60' },
  pitch: { card: 'bg-[#1d6a33]', text: 'text-white/90', title: 'text-white', fade: '' },
} as const

const ACCENT = { light: 'text-gold', dark: 'text-gold', navy: 'text-gold', pitch: 'text-lime' } as const

const TITLE_STYLE = {
  spaced: 'font-bold uppercase tracking-[0.18em] text-[clamp(1.4rem,2.4vw,3.2rem)]',
  logo: 'font-light uppercase tracking-[0.14em] text-[clamp(2rem,3.6vw,4.8rem)]',
  bold: 'font-bold text-[clamp(1.6rem,3vw,4rem)]',
  scoreboard: 'font-condensed uppercase tracking-wide text-[clamp(2.2rem,4.2vw,5.5rem)]',
} as const

export default function ProjectCard({ project }: { project: Project }) {
  const t = THEME[project.theme]
  const full = project.size === 'full'

  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      data-project-card
      className={`group relative isolate flex flex-col justify-end overflow-hidden rounded-[1.25rem] p-5 desk:p-8 ${t.card} ${
        full
          ? `${project.mobileMinH ?? 'min-h-[20rem]'} desk:col-span-2 desk:min-h-[clamp(26rem,24vw,36rem)]`
          : `${project.mobileMinH ?? 'min-h-[20rem]'} desk:min-h-[clamp(28rem,27vw,40rem)]`
      }`}
    >
      {project.image && (
        <img
          src={project.image}
          alt=""
          loading="lazy"
          decoding="async"
          data-project-image
          className={`absolute inset-0 -z-10 size-full object-cover object-[30%_30%] opacity-60 ${
            animations.projectCards ? 'transition-[scale] duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none' : ''
          } ${project.swayImage && animations.idleObjects ? 'decor-sway' : ''}`}
        />
      )}
      {project.decor && <ProjectDecor kind={project.decor} />}
      {/* Keeps text readable over the image */}
      {t.fade && <div className={`absolute inset-x-0 bottom-0 -z-10 h-3/4 bg-gradient-to-t ${t.fade} to-transparent`} />}

      <h3 className={`${TITLE_STYLE[project.titleStyle]} ${t.title} leading-none`}>
        {project.title}
        {project.titleAccent && (
          <span className={ACCENT[project.theme]}>
            {project.titleStyle === 'scoreboard' ? '' : ' '}
            {project.titleAccent}
          </span>
        )}
      </h3>
      <p className={`mt-3 text-[clamp(0.8rem,1vw,1.3rem)] leading-snug ${t.text} ${full ? 'max-w-[62ch]' : 'max-w-[44ch]'}`}>
        {project.description}
      </p>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
