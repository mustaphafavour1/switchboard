// Deterministic PRNG (mulberry32) so a given seed always renders the same demo.
export function mulberry32(seed: number) {
  let a = seed
  return function rng() {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export type Rng = () => number

export function randRange(rng: Rng, min: number, max: number) {
  return min + rng() * (max - min)
}

export function randInt(rng: Rng, min: number, max: number) {
  return Math.floor(randRange(rng, min, max + 1))
}

export function pick<T>(rng: Rng, arr: T[]): T {
  return arr[Math.floor(rng() * arr.length)]
}

export function weightedStatus(rng: Rng): 'operational' | 'degraded' | 'outage' {
  const r = rng()
  if (r < 0.84) return 'operational'
  if (r < 0.96) return 'degraded'
  return 'outage'
}
