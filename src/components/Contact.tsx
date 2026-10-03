import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { animations } from '../animations/config'
import { contact } from '../data/contact'
import { GitHubIcon, MailIcon, TelegramIcon, WhatsAppIcon } from './Icons'

const LINKS = [
  { label: contact.email, href: `mailto:${contact.email}`, Icon: MailIcon, isEmail: true },
  { label: `@${contact.telegram}`, href: `https://t.me/${contact.telegram}`, Icon: TelegramIcon, isEmail: false },
  { label: contact.whatsappLabel, href: `https://wa.me/${contact.whatsapp}`, Icon: WhatsAppIcon, isEmail: false },
  { label: `@${contact.github}`, href: `https://github.com/${contact.github}`, Icon: GitHubIcon, isEmail: false },
]

export default function Contact() {
  const [toast, setToast] = useState(false)
  const timer = useRef<number | undefined>(undefined)
  useEffect(() => () => window.clearTimeout(timer.current), [])

  // Clicking the email copies it (lots of people have no mail app set up).
  // If copying isn't allowed, the normal mailto link still works.
  const onEmailClick = async (e: MouseEvent<HTMLAnchorElement>) => {
    if (!animations.copyEmailToast || !navigator.clipboard) return
    e.preventDefault()
    try {
      await navigator.clipboard.writeText(contact.email)
      setToast(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setToast(false), 2200)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  return (
    <section
      id="contact"
      data-wave="contact"
      data-fade-top="8"
      aria-labelledby="contact-title"
      className="wave-contact relative z-[1] px-[var(--page-pad)] pt-14 pb-12 desk:pt-28 desk:pb-20"
    >
      <div
        data-wave="night"
        className="contact-card mx-auto max-w-[calc(120rem-2*var(--page-pad))] rounded-[2rem] px-6 py-14 text-center desk:px-12 desk:py-32"
      >
        <h2
          id="contact-title"
          className="mx-auto max-w-[12ch] text-[clamp(1.9rem,5.4vw,7rem)] leading-[1.02] font-extrabold uppercase desk:max-w-none"
        >
          Have a{' '}
          <span className={animations.ctaShimmer ? 'cta-shimmer' : 'text-red'}>
            project
            <br className="hidden desk:block" /> in mind?
          </span>
          <br />
          Let’s build it
        </h2>

        <ul className="mt-10 flex flex-col items-center gap-3 desk:mt-16 desk:flex-row desk:flex-wrap desk:justify-center desk:gap-x-10 desk:gap-y-4">
          {LINKS.map(({ label, href, Icon, isEmail }) => (
            <li key={href}>
              <a
                href={href}
                target={isEmail ? undefined : '_blank'}
                rel="noopener noreferrer"
                onClick={isEmail ? onEmailClick : undefined}
                title={isEmail && animations.copyEmailToast ? 'Copy email' : undefined}
                data-magnetic
                className="flex items-center gap-2.5 py-1 text-sm font-light text-white/80 hover:text-white desk:text-[clamp(1rem,1vw,1.35rem)]"
              >
                <span className="grid size-7 place-items-center rounded-full bg-white text-wine">
                  <Icon className="size-4" />
                </span>
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <p
        role="status"
        aria-live="polite"
        className={`pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-wine shadow-lg transition-all duration-300 motion-reduce:transition-none ${
          toast ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        {toast ? 'Email copied' : ''}
      </p>
    </section>
  )
}
