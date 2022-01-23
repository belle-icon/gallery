import { useState } from 'react'

export function GlobalIconConfigStore() {
  const [size, setSize] = useState(24)
  return {
    size,
    setSize,
  }
}
