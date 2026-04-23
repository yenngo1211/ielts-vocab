import { useState, useEffect } from 'react'

const KEY = 'ielts_saved_words'

export function useSavedWords() {
  const [saved, setSaved] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(saved))
  }, [saved])

  const toggle = (word) => {
    setSaved(prev =>
      prev.includes(word) ? prev.filter(w => w !== word) : [...prev, word]
    )
  }

  const isSaved = (word) => saved.includes(word)

  return { saved, toggle, isSaved }
}
