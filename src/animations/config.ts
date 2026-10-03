/**
 * Every animation gets a switch here (wired up in phase 4).
 * To drop one after seeing it live, set it to false.
 * All of them are skipped automatically when the visitor has
 * "reduce motion" turned on.
 */
export const animations = {
  waveBackground: true, // living WebGL wave, reacts to cursor
  heroIntro: true, // frame draws in, headline line-by-line, pills stagger
  photoTilt: true, // 3D tilt on the photo card
  ledDots: true, // dot dividers light up one by one
  titleReveal: true, // PORTFOLIO / SKILLS letters rise from a mask
  projectCards: true, // staggered reveal + image zoom on hover
  skillTags: true, // tags pop in like they're being typed
  ctaShimmer: true, // gradient shimmer on "PROJECT IN MIND?"
  magneticIcons: true, // contact icons pull toward the cursor
  copyEmailToast: true, // click email → copied toast
  smoothScroll: true, // Lenis
  idleObjects: true, // floating football, swaying bouquet, drifting petals in project cards
} as const

export type AnimationKey = keyof typeof animations
