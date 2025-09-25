'use client'

import { RetroHeader } from './retro-header'

export function AppWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      <RetroHeader />
      {children}
    </>
  )
}