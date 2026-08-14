import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { generateSeedData } from '../data/seed'
import type { SeedData } from '../types'

interface SeedContextValue {
  seed: number
  reseed: () => void
  data: SeedData
}

const SeedContext = createContext<SeedContextValue | null>(null)

const DEFAULT_SEED = 8821

export function SeedProvider({ children }: { children: ReactNode }) {
  const [seed, setSeed] = useState(DEFAULT_SEED)
  const data = useMemo(() => generateSeedData(seed), [seed])

  const value = useMemo<SeedContextValue>(
    () => ({
      seed,
      reseed: () => setSeed(Math.floor(Math.random() * 1_000_000)),
      data,
    }),
    [seed, data],
  )

  return <SeedContext.Provider value={value}>{children}</SeedContext.Provider>
}

export function useSeed() {
  const ctx = useContext(SeedContext)
  if (!ctx) throw new Error('useSeed must be used within SeedProvider')
  return ctx
}
