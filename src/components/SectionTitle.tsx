import { SplitChars } from './Split'

export default function SectionTitle({ text, id }: { text: string; id?: string }) {
  return (
    <h2
      id={id}
      data-title-reveal
      className="text-[clamp(3rem,10vw,12rem)] leading-[0.95] font-semibold tracking-tight uppercase"
    >
      <SplitChars text={text} />
    </h2>
  )
}
