import { animations } from '../animations/config'
import { skillCards } from '../data/skills'
import DotDivider from './DotDivider'
import SectionTitle from './SectionTitle'
import TechIcon from './TechIcon'

/** Dark glass pill: a deep wine tint behind white text keeps it readable on the bright red */
const PILL =
  'flex items-center gap-[0.5em] rounded-full border border-white/20 bg-[rgb(40_2_14/0.45)] px-[1em] py-[0.5em] font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] text-[clamp(0.9rem,1.15vw,1.35rem)] leading-none'
const PILL_HOVER =
  'transition-[background-color,border-color,translate] duration-200 hover:-translate-y-0.5 hover:border-white/50 hover:bg-[rgb(40_2_14/0.65)] motion-reduce:transition-none'


export default function Skills() {
  return (
    <section aria-labelledby="skills-title" className="mt-16 desk:mt-24">
      <DotDivider groups={6} className="mb-3 text-[0.75rem] desk:text-base" />
      <SectionTitle id="skills-title" text="Skills" />

      {/* Bento: the first (biggest) card is tall on the left, the others stack
          on the right. Cards stretch so both columns end at the same line. */}
      <div className="mt-6 grid gap-4 desk:mt-8 desk:grid-cols-[1fr_1.15fr]">
        {skillCards.map((card, i) => (
          <div key={card.id} className={`flex flex-col ${i === 0 ? 'desk:row-span-2' : ''}`}>
            <article data-wave="red" data-skill-card className="wave-red flex flex-1 flex-col overflow-hidden rounded-xl pb-8">
              <h3 className="border-b border-white/80 bg-red/60 px-5 py-3 text-[clamp(1.05rem,1.8vw,2.4rem)] font-bold uppercase desk:px-6">
                {card.heading}
              </h3>

              <div className="flex flex-1 flex-col justify-evenly gap-6 px-5 pt-5 desk:px-6">
                {card.groups.map((group) => (
                  <div key={group.title}>
                    <h4 className="font-condensed text-[clamp(1.6rem,2.7vw,3.6rem)] leading-none uppercase">
                      {group.title}
                    </h4>
                    <ul className="mt-3 flex flex-wrap gap-2">
                      {group.tags.map((tag) => (
                        <li
                          key={tag.label}
                          data-skill-tag
                          className={`${PILL} ${animations.skillTags ? PILL_HOVER : ''}`}
                        >
                          <TechIcon name={tag.icon} className="size-[1.15em] shrink-0" />
                          {tag.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  )
}
