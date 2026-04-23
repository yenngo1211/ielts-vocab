import { useState } from 'react'
import { ChevronRight, Trash2, Tag, Filter } from 'lucide-react'
import { IELTS_TOPICS, WORD_LIST } from '../data/wordList'

export default function Sidebar({ saved, savedMap, topics, onSearch, onClearSaved }) {
  const [tab, setTab] = useState('topics')
  const [filterTopic, setFilterTopic] = useState(null)

  const TAB_BTN = (id, label) => (
    <button key={id} onClick={() => setTab(id)} style={{
      flex: 1, padding: '9px 0', border: 'none', background: 'none', cursor: 'pointer',
      fontFamily: 'var(--font-body)', fontSize: '13px',
      fontWeight: tab === id ? 600 : 400,
      color: tab === id ? '#1A1A2E' : '#8A8AA8',
      borderBottom: `2px solid ${tab === id ? '#C9973A' : 'transparent'}`,
      transition: 'all 0.15s',
    }}>{label}</button>
  )

  const filteredSaved = filterTopic
    ? saved.filter(e => (e.topics || []).includes(filterTopic))
    : saved

  return (
    <aside style={{ background: '#fff', borderRadius: '20px', border: '1px solid rgba(26,26,46,0.10)', overflow: 'hidden', height: 'fit-content', boxShadow: '0 2px 20px rgba(26,26,46,0.08)' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(26,26,46,0.10)' }}>
        {TAB_BTN('topics', '📚 Topics')}
        {TAB_BTN('saved', `🔖 Saved (${saved.length})`)}
      </div>

      <div style={{ padding: '16px', maxHeight: '560px', overflowY: 'auto' }}>
        {tab === 'topics' && (
          <div>
            {IELTS_TOPICS.map(topic => (
              <div key={topic.id} style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#8A8AA8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                  {topic.icon} {topic.label}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {WORD_LIST
                    .filter((_, i) => { const idx = IELTS_TOPICS.findIndex(t => t.id === topic.id); return i >= idx * 10 && i < (idx + 1) * 10 })
                    .map(word => (
                      <button key={word} onClick={() => onSearch(word)} style={{
                        background: '#F7F4EF', border: '1px solid rgba(26,26,46,0.10)',
                        borderRadius: '8px', padding: '5px 10px', fontSize: '13px',
                        cursor: 'pointer', color: '#4A4A6A', fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#F5E6C8'; e.currentTarget.style.color = '#1A1A2E' }}
                        onMouseLeave={e => { e.currentTarget.style.background = '#F7F4EF'; e.currentTarget.style.color = '#4A4A6A' }}
                      >{word}</button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {tab === 'saved' && (
          <div>
            {saved.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 0', color: '#8A8AA8' }}>
                <p style={{ fontSize: '14px' }}>Chưa có từ nào được lưu</p>
                <p style={{ fontSize: '13px', marginTop: '4px' }}>Bấm bookmark khi tra từ</p>
              </div>
            ) : (
              <>
                {/* Topic filters */}
                {topics.length > 0 && (
                  <div style={{ marginBottom: '12px' }}>
                    <p style={{ fontSize: '11px', color: '#8A8AA8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '6px' }}>Lọc theo topic</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      <button onClick={() => setFilterTopic(null)} style={{
                        fontSize: '11px', padding: '3px 10px', borderRadius: '20px', cursor: 'pointer',
                        border: `1.5px solid ${!filterTopic ? '#1A1A2E' : 'rgba(26,26,46,0.15)'}`,
                        background: !filterTopic ? '#1A1A2E' : 'transparent',
                        color: !filterTopic ? '#fff' : '#4A4A6A', fontFamily: 'var(--font-body)',
                      }}>Tất cả</button>
                      {topics.map(t => (
                        <button key={t.id} onClick={() => setFilterTopic(filterTopic === t.id ? null : t.id)} style={{
                          fontSize: '11px', padding: '3px 10px', borderRadius: '20px', cursor: 'pointer',
                          border: `1.5px solid ${filterTopic === t.id ? t.color : 'rgba(26,26,46,0.15)'}`,
                          background: filterTopic === t.id ? t.color + '18' : 'transparent',
                          color: filterTopic === t.id ? t.color : '#4A4A6A', fontFamily: 'var(--font-body)',
                        }}>{t.label}</button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '12px', color: '#8A8AA8' }}>{filteredSaved.length} từ</span>
                  <button onClick={onClearSaved} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#993C1D', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Trash2 size={13} /> Xoá tất cả
                  </button>
                </div>

                {filteredSaved.map(entry => {
                  const wordTopics = (entry.topics || []).map(tid => topics.find(t => t.id === tid)).filter(Boolean)
                  return (
                    <div key={entry.word} onClick={() => onSearch(entry.word)} style={{
                      padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                      marginBottom: '4px', transition: 'background 0.12s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#F7F4EF'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '15px', fontWeight: 500, color: '#1A1A2E' }}>{entry.word}</span>
                        <ChevronRight size={15} style={{ color: '#8A8AA8' }} />
                      </div>
                      {entry.noteVN && (
                        <p style={{ fontSize: '12px', color: '#0F6E56', marginTop: '2px' }}>{entry.noteVN}</p>
                      )}
                      {wordTopics.length > 0 && (
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px', flexWrap: 'wrap' }}>
                          {wordTopics.map(t => (
                            <span key={t.id} style={{ fontSize: '10px', padding: '1px 7px', borderRadius: '20px', background: t.color + '18', color: t.color, fontWeight: 500 }}>
                              {t.label}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  )
}
