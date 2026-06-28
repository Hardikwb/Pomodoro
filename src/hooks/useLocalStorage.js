import { useEffect, useState } from 'react'

// Small useState wrapper that mirrors its value into localStorage.
// Falls back gracefully when localStorage is unavailable (SSR, private mode).
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initial
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initial : JSON.parse(raw)
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [key, value])

  return [value, setValue]
}