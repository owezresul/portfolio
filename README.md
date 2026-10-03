# Resul Ovezmyradov — Portfolio

React + Vite + TypeScript + Tailwind v4, GSAP + Lenis, hosted on Firebase.

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # outputs to dist/
```

## Deploy (Firebase)
```bash
firebase login
firebase use --add      # pick your existing project
npm run build && firebase deploy --only hosting
```

## Where things live
- `src/data/projects.ts` — portfolio cards. Add a project = add an entry.
- `src/data/skills.ts` — skill cards and tags (tag colors: wine, pink, white, amber).
- `src/data/contact.ts` — email / Telegram / GitHub handles.
- `src/index.css` — color + font tokens and the background gradients.
- `src/animations/config.ts` — on/off switch for every animation.
- `src/animations/useAnimations.ts` — all GSAP / Lenis animations (timings, easing, distances).
- `src/components/WaveCanvas.tsx` + `src/webgl/` — the living wave background. Any element with `data-wave="wine|red|contact|night|frame"` gets painted by it. Colors live in `src/webgl/palettes.ts`.

## Placeholders still to swap
- BORK and Чайный Барыга card images (`image` field in `projects.ts`)
- Font: Montserrat (variable) is standing in for AA Stetica (`--font-display` in `index.css`)
