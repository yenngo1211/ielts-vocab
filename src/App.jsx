import { useState } from 'react'
import SearchBar from './components/SearchBar'
import WordCard from './components/WordCard'
import Sidebar from './components/Sidebar'
import QuizPanel from './components/QuizPanel'
import WordOfDay from './components/WordOfDay'
import { useWordData } from './hooks/useWordData'
import { useSavedWords } from './hooks/useSavedWords'
import { BookOpen } from 'lucide-react'

function Spinner() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-3)' }}>
      <div style={{
        width: '36px', height: '36px', margin: '0 auto 16px',
        border: '3px solid var(--border)', borderTopColor: 'var(--gold)',
        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: '14px' }}>Looking up word…</p>
    </div>
  )
}

function ErrorBox({ msg }) {
  return (
    <div style={{
      background: 'var(--rose-light)', border: '1px solid var(--rose)',
      borderRadius: '16px', padding: '24px', textAlign: 'center',
    }}>
      <p style={{ color: 'var(--rose)', fontWeight: 500, fontSize: '15px', marginBottom: '6px' }}>Word not found</p>
      <p style={{ color: 'var(--ink-2)', fontSize: '14px' }}>Try another word or check your spelling.</p>
    </div>
  )
}

export default function App() {
  const { data, loading, error, fetchWord } = useWordData()
  const { saved, toggle, isSaved }          = useSavedWords()
  const [searched, setSearched]             = useState(false)

  const handleSearch = (word) => {
    setSearched(true)
    fetchWord(word)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      {/* Header */}
      <header style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(247,244,239,0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
        padding: '0 24px',
      }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'flex', alignItems: 'center', gap: '20px',
          height: '64px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div style={{
              width: '34px', height: '34px', background: 'var(--bg-accent)',
              borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={17} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '20px', color: 'var(--ink)', fontWeight: 400 }}>
              LexiIELTS
            </span>
          </div>
          <div style={{ flex: 1, maxWidth: '540px', margin: '0 auto' }}>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </header>

      {/* Body */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
          alignItems: 'start',
        }}>
          {/* Left col */}
          <div>
            {!searched && (
              <div style={{ animation: 'fadeUp 0.4s ease' }}>
                <WordOfDay onSearch={handleSearch} />
                <div style={{ marginTop: '28px' }}>
                  <p style={{ fontFamily: 'var(--font-display)', fontSize: '28px', color: 'var(--ink)', marginBottom: '8px' }}>
                    Master IELTS Vocabulary
                  </p>
                  <p style={{ fontSize: '15px', color: 'var(--ink-2)', maxWidth: '420px', lineHeight: 1.7 }}>
                    Look up any word to see its definition, pronunciation, example sentences, synonyms — everything you need to ace IELTS.
                  </p>
                </div>
              </div>
            )}

            {loading && <Spinner />}
            {error && <ErrorBox msg={error} />}
            {data && !loading && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <WordCard
                  data={data}
                  isSaved={isSaved(data.word)}
                  onToggleSave={toggle}
                />
                <QuizPanel wordData={data} />
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <Sidebar
            saved={saved}
            onSearch={handleSearch}
            onClearSaved={() => saved.forEach(w => toggle(w))}
          />
        </div>
      </main>
    </div>
  )
}
