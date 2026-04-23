import { useState, useEffect } from 'react'

const KEY = 'ielts_saved_words_v2'
const TOPICS_KEY = 'ielts_topics_v2'

const DEFAULT_TOPICS = [
  { id: 'environment', label: 'Environment', color: '#0F6E56' },
  { id: 'society', label: 'Society', color: '#534AB7' },
  { id: 'technology', label: 'Technology', color: '#185FA5' },
  { id: 'health', label: 'Health', color: '#993556' },
  { id: 'ielts-writing', label: 'IELTS Writing', color: '#BA7517' },
  { id: 'hard-words', label: 'Từ hay quên', color: '#993C1D' },
]

export function useSavedWords() {
  const [savedMap, setSavedMap] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
  })
  const [topics, setTopics] = useState(() => {
    try { return JSON.parse(localStorage.getItem(TOPICS_KEY)) || DEFAULT_TOPICS } catch { return DEFAULT_TOPICS }
  })

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(savedMap)) }, [savedMap])
  useEffect(() => { localStorage.setItem(TOPICS_KEY, JSON.stringify(topics)) }, [topics])

  const saveWord = (word, extra = {}) => {
    setSavedMap(prev => ({
      ...prev,
      [word]: {
        word,
        savedAt: Date.now(),
        topics: [],
        noteVN: '',
        noteMnemonic: '',
        noteContext: '',
        ...prev[word],
        ...extra,
      }
    }))
  }

  const removeWord = (word) => {
    setSavedMap(prev => { const n = { ...prev }; delete n[word]; return n })
  }

  const toggleWord = (word) => {
    if (savedMap[word]) removeWord(word)
    else saveWord(word)
  }

  const updateWord = (word, fields) => {
    setSavedMap(prev => ({
      ...prev,
      [word]: { ...prev[word], ...fields }
    }))
  }

  const isSaved = (word) => !!savedMap[word]
  const getEntry = (word) => savedMap[word] || null
  const saved = Object.values(savedMap).sort((a, b) => b.savedAt - a.savedAt)

  const addTopic = (label, color = '#534AB7') => {
    const id = label.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
    setTopics(prev => [...prev, { id, label, color }])
    return id
  }

  const deleteTopic = (id) => {
    setTopics(prev => prev.filter(t => t.id !== id))
    setSavedMap(prev => {
      const n = { ...prev }
      Object.keys(n).forEach(w => {
        n[w] = { ...n[w], topics: (n[w].topics || []).filter(t => t !== id) }
      })
      return n
    })
  }

  const toggleTopicOnWord = (word, topicId) => {
    const entry = savedMap[word]
    if (!entry) return
    const cur = entry.topics || []
    const next = cur.includes(topicId) ? cur.filter(t => t !== topicId) : [...cur, topicId]
    updateWord(word, { topics: next })
  }

  return {
    saved, savedMap, topics,
    isSaved, getEntry,
    toggleWord, saveWord, removeWord, updateWord,
    toggleTopicOnWord, addTopic, deleteTopic,
  }
}
