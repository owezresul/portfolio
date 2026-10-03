import { projects } from '../data/projects'
import DotDivider from './DotDivider'
import ProjectCard from './ProjectCard'
import SectionTitle from './SectionTitle'

export default function Portfolio() {
  return (
    <section aria-labelledby="portfolio-title" className="mt-14 desk:mt-20">
      <SectionTitle id="portfolio-title" text="Portfolio" />
      <DotDivider groups={9} className="mt-3 text-[0.75rem] desk:text-base" />

      <div data-portfolio-grid className="mt-6 grid gap-4 desk:mt-8 desk:grid-cols-2">
        {projects.map((p) => (
          <ProjectCard key={p.id} project={p} />
        ))}
      </div>
    </section>
  )
}
