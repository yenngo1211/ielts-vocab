import { useState } from 'react'
import { BookOpen, Bookmark, ChevronRight, Trash2 } from 'lucide-react'
import { IELTS_TOPICS, WORD_LIST } from '../data/wordList'

export default function Sidebar({ saved, onSearch, onClearSaved }) {
  const [tab, setTab] = useState('topics')

  const TAB_BTN = (id, label, icon) => (
    <button
      key={id}
      onClick={() => setTab(id)}
      style={{
        flex: 1, padding: '9px 0', border: 'none', background: 'none',
        cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '13px',
        fontWeight: tab === id ? 600 : 400,
        color: tab === id ? 'var(--ink)' : 'var(--ink-3)',
        borderBottom: `2px solid ${tab === id ? 'var(--gold)' : 'transparent'}`,
        transition: 'all 0.15s',
      }}
    >
      {icon} {label}
    </button>
  )

  const topicWords = WORD_LIST

  return (
    <aside style={{
      background: '#fff',
      borderRadius: '20px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      height: 'fit-content',
      boxShadow: 'var(--shadow)',
    }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {TAB_BTN('topics', 'Topics', '📚')}
        {TAB_BTN('saved', `Saved (${saved.length})`, '🔖')}
      </div>

      <div style={{ padding: '16px', maxHeight: '520px', overflowY: 'auto' }}>
        {tab === 'topics' && (
          <div>
            {IELTS_TOPICS.map(topic => (
              <div key={topic.id} style={{ marginBottom: '16px' }}>
                <p style={{
                  fontSize: '12px', fontWeight: 600, color: 'var(--ink-3)',
                  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px',
                }}>
                  {topic.icon} {topic.label}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {WORD_LIST
                    .filter((_, i) => {
                      const idx = IELTS_TOPICS.findIndex(t => t.id === topic.id)
                      return i >= idx * 10 && i < (idx + 1) * 10
                    })
                    .map(word => (
                      <button
                        key={word}
                        onClick={() => onSearch(word)}
                        style={{
                          background: 'var(--bg)', border: '1px solid var(--border)',
                          borderRadius: '8px', padding: '5px 10px',
                          fontSize: '13px', cursor: 'pointer', color: 'var(--ink-2)',
                          fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-light)'; e.currentTarget.style.color = 'var(--ink)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg)'; e.currentTarget.style.color = 'var(--ink-2)' }}
                      >
                        {word}
                      </button>
                    ))
                  }
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'saved' && (
          <div>
            {saved.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--ink-3)' }}>
                <Bookmark size={28} style={{ marginBottom: '8px', opacity: 0.4 }} />
                <p style={{ fontSize: '14px' }}>No saved words yet</p>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>Tap the bookmark icon on any word</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
                  <button
                    onClick={onClearSaved}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--rose)', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                  >
                    <Trash2 size={13} /> Clear all
                  </button>
                </div>
                {saved.map(word => (
                  <div
                    key={word}
                    onClick={() => onSearch(word)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                      marginBottom: '4px', transition: 'background 0.12s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--ink)' }}>{word}</span>
                    <ChevronRight size={15} style={{ color: 'var(--ink-3)' }} />
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
