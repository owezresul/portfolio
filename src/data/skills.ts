export type TagColor = 'wine' | 'pink' | 'white' | 'amber'

export interface SkillGroup {
  title: string
  tags: { label: string; color: TagColor }[]
}

export interface SkillCard {
  id: string
  heading: string
  groups: SkillGroup[]
}

const wine = (label: string) => ({ label, color: 'wine' as const })
const pink = (label: string) => ({ label, color: 'pink' as const })
const white = (label: string) => ({ label, color: 'white' as const })

// Only list what you'd be happy to be asked about in an interview.
export const skillCards: SkillCard[] = [
  {
    id: 'software',
    heading: 'Software development',
    groups: [
      {
        title: 'Web development',
        tags: ['HTML', 'CSS', 'React', 'TypeScript', 'Next.js', 'Git', 'Vercel'].map(wine),
      },
      {
        title: 'Backend & infrastructure',
        tags: ['REST API', 'Next.js API routes', 'Firebase', 'CI/CD', 'Domains & servers'].map(wine),
      },
      {
        title: 'UX/UI design',
        tags: ['Figma', 'Responsive design'].map(pink),
      },
    ],
  },
  {
    id: 'mobile',
    heading: 'Mobile development',
    groups: [
      {
        title: 'Cross-platform apps',
        tags: ['Flutter', 'Dart', 'FlutterFlow'].map(white),
      },
      {
        title: 'App backend',
        tags: ['Firebase Auth', 'Firestore'].map(wine),
      },
    ],
  },
  {
    id: 'ai',
    heading: 'AI skills',
    groups: [
      {
        title: 'AI advertisements & AI features',
        tags: [
          white('Veo 3'),
          wine('Higgsfield'),
          pink('ElevenLabs'),
          wine('Google AI Studio'),
          pink('Midjourney'),
          pink('Prompt engineering'),
          { label: 'Nano Banana', color: 'amber' },
        ],
      },
      {
        title: 'AI integration',
        tags: [wine('LLM APIs')],
      },
    ],
  },
]
