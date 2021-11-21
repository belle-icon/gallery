import { useState } from 'react'

export function SelectionStore() {
  const [viewing, setViewing] = useState<string | null>(null)
  return {
    viewing,
    setViewing,
  }
}
