/**
 * Text splitters for the reveal animations. Each piece sits inside an
 * overflow-hidden mask so it can rise into view. Screen readers get the
 * plain text from the visually hidden copy; the split pieces are hidden.
 */

export function SplitWords({ text }: { text: string }) {
  const words = text.split(' ')
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {words.map((word, i) => (
          <span key={i}>
            <span className="-mb-[0.12em] inline-block overflow-hidden pb-[0.12em] align-top">
              <span data-rise className="inline-block">
                {word}
              </span>
            </span>
            {i < words.length - 1 && ' '}
          </span>
        ))}
      </span>
    </>
  )
}

export function SplitChars({ text }: { text: string }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block overflow-hidden align-top">
        {Array.from(text).map((ch, i) => (
          <span key={i} data-char className="inline-block">
            {ch}
          </span>
        ))}
      </span>
    </>
  )
}
