import { useState, useCallback } from 'react'

const CACHE = {}

export function useWordData() {
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchWord = useCallback(async (word) => {
    if (!word) return
    const key = word.toLowerCase().trim()

    if (CACHE[key]) {
      setData(CACHE[key])
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    setData(null)

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(key)}`
      )
      if (!res.ok) throw new Error('Word not found')
      const json = await res.json()
      const parsed = parseEntry(json[0], key)
      CACHE[key] = parsed
      setData(parsed)
    } catch (e) {
      setError(e.message || 'Could not load word')
    } finally {
      setLoading(false)
    }
  }, [])

  return { data, loading, error, fetchWord }
}

function parseEntry(entry, word) {
  const phonetic = entry.phonetics?.find(p => p.text)?.text
    || entry.phonetic || ''
  const audioUrl = entry.phonetics?.find(p => p.audio && p.audio.length > 0)?.audio || ''

  const meanings = (entry.meanings || []).map(m => ({
    partOfSpeech: m.partOfSpeech,
    definitions: (m.definitions || []).slice(0, 3).map(d => ({
      definition: d.definition,
      example: d.example || '',
    })),
    synonyms: [...new Set([
      ...(m.synonyms || []),
      ...(m.definitions || []).flatMap(d => d.synonyms || [])
    ])].slice(0, 6),
    antonyms: [...new Set([
      ...(m.antonyms || []),
      ...(m.definitions || []).flatMap(d => d.antonyms || [])
    ])].slice(0, 4),
  }))

  return { word, phonetic, audioUrl, meanings }
}
