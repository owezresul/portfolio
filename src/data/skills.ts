import type { TechIconName } from '../components/TechIcon'

export interface SkillTag {
  label: string
  icon: TechIconName
}

export interface SkillGroup {
  title: string
  tags: SkillTag[]
}

export interface SkillCard {
  id: string
  heading: string
  groups: SkillGroup[]
}

const t = (label: string, icon: TechIconName): SkillTag => ({ label, icon })

// Only list what you'd be happy to be asked about in an interview.
export const skillCards: SkillCard[] = [
  {
    id: 'software',
    heading: 'Software development',
    groups: [
      {
        title: 'Web development',
        tags: [
          t('HTML', 'html'),
          t('CSS', 'css'),
          t('JavaScript', 'javascript'),
          t('React', 'react'),
          t('TypeScript', 'typescript'),
          t('Next.js', 'nextjs'),
          t('Git', 'git'),
          t('Vercel', 'vercel'),
        ],
      },
      {
        title: 'Backend & infrastructure',
        tags: [
          t('Go', 'go'),
          t('GraphQL', 'graphql'),
          t('PostgreSQL', 'postgresql'),
          t('REST API', 'api'),
          t('Next.js API routes', 'nextjs'),
          t('Firebase', 'firebase'),
          t('CI/CD', 'githubactions'),
          t('Domains & servers', 'server'),
        ],
      },
      {
        title: 'UX/UI design',
        tags: [t('Figma', 'figma'), t('Responsive design', 'devices')],
      },
    ],
  },
  {
    id: 'mobile',
    heading: 'Mobile development',
    groups: [
      {
        title: 'Cross-platform apps',
        tags: [t('Flutter', 'flutter'), t('Dart', 'dart'), t('FlutterFlow', 'flow')],
      },
      {
        title: 'App backend',
        tags: [t('Firebase Auth', 'firebase'), t('Firestore', 'firebase')],
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
          t('Veo 3', 'video'),
          t('Higgsfield', 'video'),
          t('ElevenLabs', 'elevenlabs'),
          t('Google AI Studio', 'gemini'),
          t('Midjourney', 'image'),
          t('Prompt engineering', 'prompt'),
          t('Nano Banana', 'gemini'),
        ],
      },
      {
        title: 'AI integration',
        tags: [t('LLM APIs', 'chip')],
      },
    ],
  },
]
