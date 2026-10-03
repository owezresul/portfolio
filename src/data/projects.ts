import type { DecorKind } from '../components/ProjectDecor'
import plantmama from '../assets/projects/plantmama.webp'

export type ProjectTheme = 'light' | 'dark' | 'navy' | 'pitch'

export interface Project {
  id: string
  /** Title split so part of it can use the accent color (e.g. "Чайный" + "Барыга") */
  title: string
  titleAccent?: string
  titleStyle: 'spaced' | 'logo' | 'bold' | 'scoreboard'
  description: string
  href: string
  /** Optional until final images are ready */
  image?: string
  theme: ProjectTheme
  /** 'half' = one column on desktop, 'full' = spans both */
  size: 'half' | 'full'
  /** Optional animated objects inside the card */
  decor?: DecorKind
  /** Taller card on phones when the decor needs room above the text */
  mobileMinH?: string
  /** Gently sway the card image (good for cut-out objects like the bouquet) */
  swayImage?: boolean
}

// To add a project: add an entry here. Nothing else needs to change.
export const projects: Project[] = [
  {
    id: 'pitchside',
    title: 'Pitch',
    titleAccent: 'side',
    titleStyle: 'scoreboard',
    description:
      'A free, open-source tournament app for pickup football. Set up teams, run matches on a live score-and-timer screen, and let it generate the next fixture and the standings automatically. Supports league, knockout and group-stage formats for up to 64 teams, with shareable results. Built with React and TypeScript.',
    href: 'https://pitchside-12.web.app',
    theme: 'pitch',
    size: 'full',
    decor: 'pitch',
    mobileMinH: 'min-h-[28rem]',
  },
  {
    id: 'chainy-baryga',
    title: 'Tea',
    titleAccent: 'dealer',
    titleStyle: 'bold',
    description:
      'Online store for rare Chinese tea, with Pu-erh and white teas sourced from Yunnan. Built with React and Firebase, with a sleek dark design that matches the product.',
    href: 'https://chainybaryga.com',
    theme: 'navy',
    size: 'half',
    decor: 'tea',
    mobileMinH: 'min-h-[30rem]',
  },
  {
    id: 'plantmama',
    title: 'PlantMama',
    titleStyle: 'spaced',
    description:
      "A Figma concept redesign of PlantMama's flower store website. Focused on refreshing the visual style while keeping the brand's original charm intact.",
    href: 'https://www.figma.com/design/Kutmuk4aDrFlfc34Fg2ZMb/Untitled?node-id=415-40',
    image: plantmama,
    theme: 'light',
    size: 'half',
    decor: 'petals',
    swayImage: true,
  },
]
