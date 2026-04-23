import { useState } from 'react'
import { Volume2, Bookmark, BookmarkCheck, ChevronDown, ChevronUp, Settings2 } from 'lucide-react'
import { playAudio, speakText } from '../utils/audio'

const POS_COLORS = {
  noun:      { bg: '#EEF2FF', color: '#3730A3' },
  verb:      { bg: '#ECFDF5', color: '#065F46' },
  adjective: { bg: '#FFF7ED', color: '#9A3412' },
  adverb:    { bg: '#FFF1F2', color: '#9F1239' },
  default:   { bg: '#F3F4F6', color: '#374151' },
}

function PosBadge({ pos }) {
  const c = POS_COLORS[pos] || POS_COLORS.default
  return (
    <span style={{
      background: c.bg, color: c.color, fontSize: '11px', fontWeight: 600,
      padding: '3px 10px', borderRadius: '20px',
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>{pos}</span>
  )
}

function Tag({ children, color = '#0F6E56', bg = '#E1F5EE' }) {
  return (
    <span
      style={{ background: bg, color, fontSize: '13px', fontWeight: 500, padding: '4px 12px', borderRadius: '20px', cursor: 'pointer' }}
      onClick={() => speakText(children)}
      title="Click to hear"
    >{children}</span>
  )
}

function MeaningBlock({ meaning, idx }) {
  const [expanded, setExpanded] = useState(idx === 0)
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <PosBadge pos={meaning.partOfSpeech} />
        <button onClick={() => setExpanded(e => !e)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A8AA8', display: 'flex' }}>
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      {expanded && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          {meaning.definitions.map((def, i) => (
            <div key={i} style={{ marginBottom: '14px', paddingLeft: '16px', borderLeft: '2px solid rgba(26,26,46,0.10)' }}>
              <p style={{ fontSize: '15px', color: '#1A1A2E', lineHeight: 1.65, marginBottom: def.example ? '6px' : 0 }}>{def.definition}</p>
              {def.example && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '6px' }}>
                  <button onClick={() => speakText(def.example)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#C9973A', marginTop: '2px', flexShrink: 0 }} title="Listen">
                    <Volume2 size={14} />
                  </button>
                  <p style={{ fontSize: '14px', color: '#4A4A6A', fontStyle: 'italic', lineHeight: 1.6 }}>"{def.example}"</p>
                </div>
              )}
            </div>
          ))}
          {meaning.synonyms.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '12px', color: '#8A8AA8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Synonyms</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {meaning.synonyms.map(s => <Tag key={s}>{s}</Tag>)}
              </div>
            </div>
          )}
          {meaning.antonyms.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '12px', color: '#8A8AA8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Antonyms</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {meaning.antonyms.map(a => <Tag key={a} color="#993C1D" bg="#FAECE7">{a}</Tag>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function WordCard({ data, isSaved, entry, topics, onToggleSave, onOpenDrawer }) {
  const [playing, setPlaying] = useState(false)

  const handleAudio = () => {
    setPlaying(true)
    playAudio(data.audioUrl, data.word)
    setTimeout(() => setPlaying(false), 1500)
  }

  const wordTopics = entry?.topics || []
  const topicObjs = topics.filter(t => wordTopics.includes(t.id))

  return (
    <div style={{ background: '#fff', borderRadius: '24px', border: '1px solid rgba(26,26,46,0.10)', overflow: 'hidden', boxShadow: '0 2px 20px rgba(26,26,46,0.08)', animation: 'fadeUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ background: '#1A1A2E', padding: '32px 32px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px,5vw,48px)', fontWeight: 400, color: '#fff', lineHeight: 1.1, marginBottom: '8px', letterSpacing: '-0.02em' }}>
              {data.word}
            </h1>
            {data.phonetic && (
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '18px', fontStyle: 'italic', letterSpacing: '0.02em' }}>{data.phonetic}</p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button onClick={handleAudio} title="Play pronunciation" style={{ width: '44px', height: '44px', borderRadius: '50%', background: playing ? '#C9973A' : 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.2s' }}>
              <Volume2 size={18} />
            </button>
            <button onClick={() => onToggleSave(data.word)} title={isSaved ? 'Remove' : 'Save'} style={{ width: '44px', height: '44px', borderRadius: '50%', background: isSaved ? '#C9973A' : 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.2s' }}>
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
            {isSaved && (
              <button onClick={() => onOpenDrawer(data.word)} title="Edit topics & notes" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1.5px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', transition: 'all 0.2s' }}>
                <Settings2 size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Badges */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ background: '#C9973A', color: '#fff', fontSize: '11px', fontWeight: 600, padding: '4px 12px', borderRadius: '20px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>IELTS Academic</span>
          {topicObjs.map(t => (
            <span key={t.id} style={{ background: t.color + '30', color: '#fff', fontSize: '11px', fontWeight: 500, padding: '4px 12px', borderRadius: '20px', border: `1px solid ${t.color}` }}>
              {t.label}
            </span>
          ))}
        </div>

        {/* Vietnamese note preview */}
        {entry?.noteVN && (
          <div style={{ marginTop: '12px', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '8px 14px' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.75)', fontStyle: 'italic' }}>
              {entry.noteVN}
            </p>
          </div>
        )}
      </div>

      {/* Meanings */}
      <div style={{ padding: '28px 32px 32px' }}>
        {/* Notes preview */}
        {(entry?.noteMnemonic || entry?.noteContext) && (
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {entry.noteMnemonic && (
              <div style={{ background: '#FFF7ED', borderRadius: '10px', padding: '10px 14px', borderLeft: '3px solid #C9973A' }}>
                <p style={{ fontSize: '12px', color: '#BA7517', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Mẹo nhớ</p>
                <p style={{ fontSize: '13px', color: '#633806' }}>{entry.noteMnemonic}</p>
              </div>
            )}
            {entry.noteContext && (
              <div style={{ background: '#E1F5EE', borderRadius: '10px', padding: '10px 14px', borderLeft: '3px solid #0F6E56' }}>
                <p style={{ fontSize: '12px', color: '#085041', fontWeight: 600, marginBottom: '2px', textTransform: 'uppercase', letterSpacing: '.05em' }}>Nguồn</p>
                <p style={{ fontSize: '13px', color: '#085041' }}>{entry.noteContext}</p>
              </div>
            )}
          </div>
        )}

        {data.meanings.map((m, i) => <MeaningBlock key={i} meaning={m} idx={i} />)}

        {isSaved && (
          <button
            onClick={() => onOpenDrawer(data.word)}
            style={{
              marginTop: '8px', width: '100%', background: 'none',
              border: '1px dashed rgba(26,26,46,0.2)', borderRadius: '12px',
              padding: '10px', cursor: 'pointer', fontSize: '13px',
              color: '#8A8AA8', fontFamily: 'var(--font-body)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
              transition: 'all .15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#F7F4EF'; e.currentTarget.style.color = '#1A1A2E' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = '#8A8AA8' }}
          >
            <Settings2 size={14} /> Thêm topics, ghi chú, synonyms
          </button>
        )}
      </div>
    </div>
  )
}
