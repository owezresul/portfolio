import {
  siCss,
  siDart,
  siElevenlabs,
  siFigma,
  siFirebase,
  siFlutter,
  siGit,
  siGithubactions,
  siGooglegemini,
  siHtml5,
  siNextdotjs,
  siReact,
  siTypescript,
  siVercel,
} from 'simple-icons'

/** Brand logos (from Simple Icons, CC0), drawn in one colour */
const BRAND = {
  html: siHtml5,
  css: siCss,
  react: siReact,
  typescript: siTypescript,
  nextjs: siNextdotjs,
  git: siGit,
  vercel: siVercel,
  firebase: siFirebase,
  githubactions: siGithubactions,
  figma: siFigma,
  flutter: siFlutter,
  dart: siDart,
  gemini: siGooglegemini,
  elevenlabs: siElevenlabs,
} as const

/** Simple line icons for things that don't have a logo */
const LINE = {
  api: <path d="M8 4c-2 0-3 1-3 3v2c0 1.5-1 2-2 2v2c1 0 2 .5 2 2v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1.5 1 2 2 2v2c-1 0-2 .5-2 2v2c0 2-1 3-3 3" />,
  server: (
    <>
      <rect x="3" y="4" width="18" height="7" rx="2" />
      <rect x="3" y="13" width="18" height="7" rx="2" />
      <path d="M7 7.5h.01M7 16.5h.01" />
    </>
  ),
  devices: (
    <>
      <rect x="2" y="4" width="14" height="11" rx="1.5" />
      <path d="M6 19h6" />
      <rect x="17" y="8" width="5" height="11" rx="1.2" />
    </>
  ),
  flow: (
    <>
      <circle cx="5" cy="6" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M7.5 6H14a4 4 0 0 1 4 4v5.5M5 8.5V14a4 4 0 0 0 4 4h7.5" />
    </>
  ),
  video: (
    <>
      <rect x="2" y="6" width="14" height="12" rx="2" />
      <path d="m16 10 6-3v10l-6-3" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
  prompt: <path d="m4 17 6-5-6-5M12 19h8" />,
  chip: (
    <>
      <rect x="6" y="6" width="12" height="12" rx="2" />
      <path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4" />
    </>
  ),
} as const

export type TechIconName = keyof typeof BRAND | keyof typeof LINE

export default function TechIcon({ name, className = '' }: { name: TechIconName; className?: string }) {
  if (name in BRAND) {
    return (
      <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
        <path d={BRAND[name as keyof typeof BRAND].path} />
      </svg>
    )
  }
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {LINE[name as keyof typeof LINE]}
    </svg>
  )
}
