import { animations } from '../animations/config'
import { skillCards, type TagColor } from '../data/skills'
import DotDivider from './DotDivider'
import SectionTitle from './SectionTitle'

const TAG: Record<TagColor, string> = {
  wine: 'bg-wine text-white',
  pink: 'bg-pink text-white',
  white: 'bg-white text-black',
  amber: 'bg-amber text-white',
}


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
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {group.tags.map((tag) => (
                        <li
                          key={tag.label}
                          data-skill-tag
                          className={`font-condensed px-2 pt-[0.3em] pb-[0.05em] text-[clamp(1rem,1.6vw,2.1rem)] leading-none uppercase ${TAG[tag.color]} ${
                            animations.skillTags ? 'transition-[filter,translate] duration-200 hover:-translate-y-0.5 hover:brightness-125 motion-reduce:transition-none' : ''
                          }`}
                        >
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
