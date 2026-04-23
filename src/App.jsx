import { useState } from 'react'
import SearchBar from './components/SearchBar'
import WordCard from './components/WordCard'
import Sidebar from './components/Sidebar'
import QuizPanel from './components/QuizPanel'
import WordOfDay from './components/WordOfDay'
import SaveDrawer from './components/SaveDrawer'
import { useWordData } from './hooks/useWordData'
import { useSavedWords } from './hooks/useSavedWords'
import { BookOpen } from 'lucide-react'

function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: '#8A8AA8' }}>
      <div style={{ width: '36px', height: '36px', margin: '0 auto 16px', border: '3px solid rgba(26,26,46,0.10)', borderTopColor: '#C9973A', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <p style={{ fontSize: '14px' }}>Looking up word…</p>
    </div>
  )
}

function ErrorBox() {
  return (
    <div style={{ background: '#FAECE7', border: '1px solid #993C1D', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
      <p style={{ color: '#993C1D', fontWeight: 500, fontSize: '15px', marginBottom: '6px' }}>Word not found</p>
      <p style={{ color: '#4A4A6A', fontSize: '14px' }}>Try another word or check spelling.</p>
    </div>
  )
}

export default function App() {
  const { data, loading, error, fetchWord } = useWordData()
  const {
    saved, savedMap, topics,
    isSaved, getEntry,
    toggleWord, updateWord,
    toggleTopicOnWord, addTopic, deleteTopic,
  } = useSavedWords()

  const [searched, setSearched] = useState(false)
  const [drawerWord, setDrawerWord] = useState(null)

  const handleSearch = (word) => { setSearched(true); fetchWord(word) }

  const handleToggleSave = (word) => { toggleWord(word) }

  const handleOpenDrawer = (word) => {
    if (!isSaved(word)) toggleWord(word)
    setDrawerWord(word)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F7F4EF' }}>
      {/* Header */}
      <header style={{ borderBottom: '1px solid rgba(26,26,46,0.10)', background: 'rgba(247,244,239,0.9)', backdropFilter: 'blur(12px)', position: 'sticky', top: 0, zIndex: 50, padding: '0 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '20px', height: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{ width: '34px', height: '34px', background: '#1A1A2E', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={17} color="#fff" />
            </div>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: '20px', color: '#1A1A2E' }}>LexiIELTS</span>
          </div>
          <div style={{ flex: 1, maxWidth: '540px', margin: '0 auto' }}>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '24px', alignItems: 'start' }}>
          {/* Left */}
          <div>
            {!searched && (
              <div style={{ animation: 'fadeUp 0.4s ease' }}>
                <WordOfDay onSearch={handleSearch} />
                <div style={{ marginTop: '28px' }}>
                  <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: '28px', color: '#1A1A2E', marginBottom: '8px' }}>Master IELTS Vocabulary</p>
                  <p style={{ fontSize: '15px', color: '#4A4A6A', maxWidth: '420px', lineHeight: 1.7 }}>
                    Tra từ, lưu vào topics, ghi chú tiếng Việt, học synonyms theo band — tất cả trong một app.
                  </p>
                </div>
              </div>
            )}
            {loading && <Spinner />}
            {error && <ErrorBox />}
            {data && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <WordCard
                  data={data}
                  isSaved={isSaved(data.word)}
                  entry={getEntry(data.word)}
                  topics={topics}
                  onToggleSave={handleToggleSave}
                  onOpenDrawer={handleOpenDrawer}
                />
                <QuizPanel wordData={data} />
              </div>
            )}
          </div>

          {/* Right */}
          <Sidebar
            saved={saved}
            savedMap={savedMap}
            topics={topics}
            onSearch={handleSearch}
            onClearSaved={() => saved.forEach(e => toggleWord(e.word))}
          />
        </div>
      </main>

      {/* Save Drawer */}
      {drawerWord && isSaved(drawerWord) && (
        <SaveDrawer
          word={drawerWord}
          entry={getEntry(drawerWord)}
          topics={topics}
          onClose={() => setDrawerWord(null)}
          onUpdate={updateWord}
          onToggleTopic={toggleTopicOnWord}
          onAddTopic={addTopic}
          onDeleteTopic={deleteTopic}
        />
      )}
    </div>
  )
}
