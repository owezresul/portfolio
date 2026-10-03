const PATTERN = ['bg-white', 'bg-pink', 'bg-red', 'bg-wine'] as const

interface DotDividerProps {
  groups?: number
  className?: string
}

/** The signature dotted divider: repeating white / pink / red / wine dots. */
export default function DotDivider({ groups = 6, className = '' }: DotDividerProps) {
  return (
    <div data-dots className={`flex max-w-full items-center gap-[0.45em] overflow-hidden ${className}`} aria-hidden="true">
      {Array.from({ length: groups }).flatMap((_, g) =>
        PATTERN.map((color, i) => (
          <span
            key={`${g}-${i}`}
            data-dot
            className={`block size-[0.6em] shrink-0 rounded-full ${color}`}
          />
        )),
      )}
    </div>
  )
}
