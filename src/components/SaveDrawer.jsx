import { useState } from 'react'
import { X, Plus, Check, Tag, FileText, BookOpen, Lightbulb } from 'lucide-react'

const COLORS = ['#534AB7','#0F6E56','#185FA5','#993C1D','#BA7517','#993556','#444441']

export default function SaveDrawer({ word, entry, topics, onClose, onUpdate, onToggleTopic, onAddTopic, onDeleteTopic }) {
  const [newTopicLabel, setNewTopicLabel] = useState('')
  const [newTopicColor, setNewTopicColor] = useState(COLORS[0])
  const [showAddTopic, setShowAddTopic] = useState(false)
  const [activeTab, setActiveTab] = useState('topics')

  const wordTopics = entry?.topics || []

  const handleAddTopic = () => {
    if (!newTopicLabel.trim()) return
    onAddTopic(newTopicLabel.trim(), newTopicColor)
    setNewTopicLabel('')
    setShowAddTopic(false)
  }

  const TAB = (id, icon, label) => (
    <button
      onClick={() => setActiveTab(id)}
      style={{
        flex: 1, padding: '8px 0', border: 'none', background: 'none',
        cursor: 'pointer', fontSize: '13px', fontFamily: 'var(--font-body)',
        fontWeight: activeTab === id ? 500 : 400,
        color: activeTab === id ? '#1A1A2E' : '#8A8AA8',
        borderBottom: `2px solid ${activeTab === id ? '#C9973A' : 'transparent'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
        transition: 'all .15s',
      }}
    >
      {icon} {label}
    </button>
  )

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      background: 'rgba(0,0,0,0.4)',
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: '#fff', borderRadius: '24px 24px 0 0',
        width: '100%', maxWidth: '640px',
        padding: '0 0 32px',
        maxHeight: '85vh', overflowY: 'auto',
        animation: 'slideUp .25s ease',
      }}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>

        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px 0 0' }}>
          <div style={{ width: '40px', height: '4px', borderRadius: '2px', background: '#D3D1C7' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 24px 0' }}>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 500, color: '#1A1A2E', fontFamily: "'DM Serif Display', serif" }}>{word}</p>
            <p style={{ fontSize: '12px', color: '#8A8AA8' }}>Saved word settings</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A8AA8', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(26,26,46,0.10)', margin: '12px 0 0' }}>
          {TAB('topics', <Tag size={13} />, 'Topics')}
          {TAB('notes', <FileText size={13} />, 'Ghi chú')}
          {TAB('synonyms', <BookOpen size={13} />, 'Synonyms')}
        </div>

        <div style={{ padding: '20px 24px 0' }}>

          {/* TOPICS TAB */}
          {activeTab === 'topics' && (
            <div>
              <p style={{ fontSize: '13px', color: '#8A8AA8', marginBottom: '12px' }}>
                Phân loại từ vào topics — một từ có thể thuộc nhiều topic
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                {topics.map(t => {
                  const active = wordTopics.includes(t.id)
                  return (
                    <button
                      key={t.id}
                      onClick={() => onToggleTopic(word, t.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                        border: `1.5px solid ${active ? t.color : 'rgba(26,26,46,0.15)'}`,
                        background: active ? t.color + '18' : '#F7F4EF',
                        color: active ? t.color : '#4A4A6A',
                        fontSize: '13px', fontWeight: active ? 500 : 400,
                        fontFamily: 'var(--font-body)', transition: 'all .15s',
                      }}
                    >
                      {active && <Check size={12} />}
                      {t.label}
                    </button>
                  )
                })}
              </div>

              {!showAddTopic ? (
                <button
                  onClick={() => setShowAddTopic(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '6px 14px', borderRadius: '20px', cursor: 'pointer',
                    border: '1.5px dashed rgba(26,26,46,0.25)', background: 'transparent',
                    color: '#8A8AA8', fontSize: '13px', fontFamily: 'var(--font-body)',
                  }}
                >
                  <Plus size={13} /> Tạo topic mới
                </button>
              ) : (
                <div style={{ background: '#F7F4EF', borderRadius: '12px', padding: '14px', marginTop: '8px' }}>
                  <input
                    autoFocus
                    value={newTopicLabel}
                    onChange={e => setNewTopicLabel(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddTopic()}
                    placeholder="Tên topic..."
                    style={{
                      width: '100%', border: '1px solid rgba(26,26,46,0.2)',
                      borderRadius: '8px', padding: '8px 12px', fontSize: '14px',
                      fontFamily: 'var(--font-body)', background: '#fff', outline: 'none',
                      marginBottom: '10px',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                    {COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setNewTopicColor(c)}
                        style={{
                          width: '24px', height: '24px', borderRadius: '50%',
                          background: c, border: newTopicColor === c ? '2.5px solid #1A1A2E' : '2px solid transparent',
                          cursor: 'pointer', padding: 0,
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleAddTopic} style={{
                      background: '#1A1A2E', color: '#fff', border: 'none',
                      borderRadius: '8px', padding: '7px 16px', fontSize: '13px',
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                    }}>Tạo</button>
                    <button onClick={() => setShowAddTopic(false)} style={{
                      background: 'none', border: '1px solid rgba(26,26,46,0.2)',
                      borderRadius: '8px', padding: '7px 16px', fontSize: '13px',
                      cursor: 'pointer', fontFamily: 'var(--font-body)', color: '#4A4A6A',
                    }}>Huỷ</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* NOTES TAB */}
          {activeTab === 'notes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Nghĩa tiếng Việt
                </label>
                <textarea
                  rows={2}
                  value={entry?.noteVN || ''}
                  onChange={e => onUpdate(word, { noteVN: e.target.value })}
                  placeholder="VD: bền vững, có thể duy trì lâu dài..."
                  style={{
                    width: '100%', border: '1px solid rgba(26,26,46,0.2)',
                    borderRadius: '10px', padding: '10px 12px', fontSize: '14px',
                    fontFamily: 'var(--font-body)', resize: 'none', outline: 'none',
                    lineHeight: 1.6, background: '#F7F4EF',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Mẹo nhớ (Mnemonic)
                </label>
                <textarea
                  rows={2}
                  value={entry?.noteMnemonic || ''}
                  onChange={e => onUpdate(word, { noteMnemonic: e.target.value })}
                  placeholder="VD: sus + tain = nghi ngờ nhưng vẫn duy trì được..."
                  style={{
                    width: '100%', border: '1px solid rgba(26,26,46,0.2)',
                    borderRadius: '10px', padding: '10px 12px', fontSize: '14px',
                    fontFamily: 'var(--font-body)', resize: 'none', outline: 'none',
                    lineHeight: 1.6, background: '#FFF7ED',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 500, color: '#4A4A6A', display: 'block', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Gặp từ này ở đâu
                </label>
                <textarea
                  rows={2}
                  value={entry?.noteContext || ''}
                  onChange={e => onUpdate(word, { noteContext: e.target.value })}
                  placeholder="VD: Bài báo BBC về climate change, 20/4/2025..."
                  style={{
                    width: '100%', border: '1px solid rgba(26,26,46,0.2)',
                    borderRadius: '10px', padding: '10px 12px', fontSize: '14px',
                    fontFamily: 'var(--font-body)', resize: 'none', outline: 'none',
                    lineHeight: 1.6, background: '#E1F5EE',
                  }}
                />
              </div>
            </div>
          )}

          {/* SYNONYMS TAB */}
          {activeTab === 'synonyms' && (
            <SynonymTab word={word} />
          )}
        </div>
      </div>
    </div>
  )
}

const BAND_COLORS = {
  '5': { bg: '#EAF3DE', color: '#27500A', label: 'Band 5' },
  '7': { bg: '#E6F1FB', color: '#0C447C', label: 'Band 7' },
  '9': { bg: '#EEEDFE', color: '#3C3489', label: 'Band 9' },
}

const SYNONYM_DATA = {
  default: {
    '5': ['increase','show','important','use','big'],
    '7': ['enhance','demonstrate','significant','utilize','substantial'],
    '9': ['augment','exemplify','paramount','leverage','considerable'],
    collocations: ['commonly used with nouns','often paired with verbs','typical academic context'],
    sentences: [
      'This word is frequently used in academic writing.',
      'Consider using it in IELTS Writing Task 2.',
    ]
  }
}

function SynonymTab({ word }) {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [fetched, setFetched] = useState(false)

  const fetchSynonyms = async () => {
    setLoading(true)
    try {
      const res = await fetch(`https://api.datamuse.com/words?rel_syn=${encodeURIComponent(word)}&max=20`)
      const json = await res.json()
      const words = json.map(w => w.word)

      const colRes = await fetch(`https://api.datamuse.com/words?rel_trg=${encodeURIComponent(word)}&max=8`)
      const colJson = await colRes.json()
      const collocations = colJson.map(w => w.word)

      setData({ synonyms: words, collocations })
    } catch {
      setData({ synonyms: [], collocations: [] })
    }
    setLoading(false)
    setFetched(true)
  }

  if (!fetched) {
    return (
      <div style={{ textAlign: 'center', padding: '24px 0' }}>
        <p style={{ fontSize: '14px', color: '#8A8AA8', marginBottom: '16px' }}>
          Tải synonyms và collocations cho <strong style={{ color: '#1A1A2E' }}>{word}</strong>
        </p>
        <button
          onClick={fetchSynonyms}
          style={{
            background: '#1A1A2E', color: '#fff', border: 'none',
            borderRadius: '50px', padding: '10px 24px', fontSize: '14px',
            cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}
        >
          {loading ? 'Đang tải...' : 'Tải synonyms'}
        </button>
      </div>
    )
  }

  const syns = data?.synonyms || []
  const cols = data?.collocations || []
  const band5 = syns.slice(0, 4)
  const band7 = syns.slice(4, 9)
  const band9 = syns.slice(9, 14)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {[['5', band5], ['7', band7], ['9', band9]].map(([band, words]) => (
        words.length > 0 && (
          <div key={band}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                fontSize: '11px', fontWeight: 600, padding: '2px 10px',
                borderRadius: '20px', background: BAND_COLORS[band].bg,
                color: BAND_COLORS[band].color, letterSpacing: '.06em',
              }}>
                {BAND_COLORS[band].label}
              </span>
              <span style={{ fontSize: '12px', color: '#8A8AA8' }}>
                {band === '5' ? 'phổ thông' : band === '7' ? 'học thuật' : 'nâng cao'}
              </span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {words.map(w => (
                <span key={w} style={{
                  background: BAND_COLORS[band].bg, color: BAND_COLORS[band].color,
                  fontSize: '13px', padding: '4px 12px', borderRadius: '20px', fontWeight: 500,
                }}>{w}</span>
              ))}
            </div>
          </div>
        )
      ))}

      {cols.length > 0 && (
        <div>
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#4A4A6A', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '.06em' }}>
            Từ thường đi cùng
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {cols.map(w => (
              <span key={w} style={{
                background: '#FAEEDA', color: '#633806',
                fontSize: '13px', padding: '4px 12px', borderRadius: '20px',
              }}>{word} {w}</span>
            ))}
          </div>
        </div>
      )}

      {syns.length === 0 && cols.length === 0 && (
        <p style={{ fontSize: '14px', color: '#8A8AA8', textAlign: 'center', padding: '16px 0' }}>
          Không tìm thấy dữ liệu cho từ này.
        </p>
      )}
    </div>
  )
}
