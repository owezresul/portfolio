import { useAnimations } from './animations/useAnimations'
import Contact from './components/Contact'
import Hero from './components/Hero'
import Portfolio from './components/Portfolio'
import Skills from './components/Skills'
import WaveCanvas from './components/WaveCanvas'

export default function App() {
  useAnimations()

  return (
    <div className="page-bg relative isolate">
      <WaveCanvas />
      <main className="relative z-[1] mx-auto max-w-[120rem] px-[var(--page-pad)] pt-[var(--page-pad)]">
        <Hero />
        <Portfolio />
        <Skills />
      </main>
      <Contact />
    </div>
  )
}
