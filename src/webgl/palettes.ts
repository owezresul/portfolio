const hex = (h: string): [number, number, number] => {
  const n = parseInt(h.replace('#', ''), 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]
}

/** 4 colors each: deep base, mid, bright, highlight */
const make = (...colors: string[]) => new Float32Array(colors.flatMap(hex))

export const palettes = {
  pageRed: make('#5a0a26', '#a3002a', '#ff003d', '#ff8fab'),
  pageTop: make('#1f1519', '#2b2226', '#3b2a31', '#5a3b48'),
  pageBottom: make('#2a0712', '#5a0a26', '#c4002f', '#ff4d7a'),
  wine: make('#3a0517', '#500b28', '#9a1446', '#e888d1'),
  red: make('#7d0022', '#c4002f', '#ff003d', '#ff8fab'),
  frame: make('#ff003d', '#b0123f', '#6b1336', '#e888d1'),
  night: make('#1c0208', '#2a0611', '#4a0a1f', '#ff003d'),
  contact: make('#8a0a30', '#c4003a', '#ff003d', '#ff9ab4'),
} as const

export type SurfacePalette = 'wine' | 'red' | 'contact' | 'frame' | 'night'
