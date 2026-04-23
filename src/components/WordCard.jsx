import { useState } from 'react'
import { Volume2, VolumeX, Bookmark, BookmarkCheck, ChevronDown, ChevronUp } from 'lucide-react'
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
      background: c.bg, color: c.color,
      fontSize: '11px', fontWeight: 600,
      padding: '3px 10px', borderRadius: '20px',
      textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      {pos}
    </span>
  )
}

function Tag({ children, color = 'var(--teal)', bg = 'var(--teal-light)' }) {
  return (
    <span style={{
      background: bg, color, fontSize: '13px', fontWeight: 500,
      padding: '4px 12px', borderRadius: '20px', cursor: 'pointer',
      transition: 'opacity 0.15s',
    }}
      onClick={() => speakText(children)}
      title="Click to hear"
    >
      {children}
    </span>
  )
}

function MeaningBlock({ meaning, idx }) {
  const [expanded, setExpanded] = useState(idx === 0)
  return (
    <div style={{ marginBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <PosBadge pos={meaning.partOfSpeech} />
        <button
          onClick={() => setExpanded(e => !e)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-3)', display: 'flex' }}
        >
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {expanded && (
        <div style={{ animation: 'fadeIn 0.2s ease' }}>
          {meaning.definitions.map((def, i) => (
            <div key={i} style={{ marginBottom: '14px', paddingLeft: '16px', borderLeft: '2px solid var(--border)' }}>
              <p style={{ fontSize: '15px', color: 'var(--ink)', lineHeight: 1.65, marginBottom: def.example ? '6px' : 0 }}>
                {def.definition}
              </p>
              {def.example && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '6px' }}>
                  <button
                    onClick={() => speakText(def.example)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold)', marginTop: '2px', flexShrink: 0 }}
                    title="Listen to example"
                  >
                    <Volume2 size={14} />
                  </button>
                  <p style={{ fontSize: '14px', color: 'var(--ink-2)', fontStyle: 'italic', lineHeight: 1.6 }}>
                    "{def.example}"
                  </p>
                </div>
              )}
            </div>
          ))}

          {meaning.synonyms.length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <p style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Synonyms
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {meaning.synonyms.map(s => <Tag key={s}>{s}</Tag>)}
              </div>
            </div>
          )}

          {meaning.antonyms.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <p style={{ fontSize: '12px', color: 'var(--ink-3)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                Antonyms
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {meaning.antonyms.map(a => <Tag key={a} color="var(--rose)" bg="var(--rose-light)">{a}</Tag>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function WordCard({ data, isSaved, onToggleSave }) {
  const [playing, setPlaying] = useState(false)

  const handleAudio = () => {
    setPlaying(true)
    playAudio(data.audioUrl, data.word)
    setTimeout(() => setPlaying(false), 1500)
  }

  return (
    <div style={{
      background: '#fff',
      borderRadius: '24px',
      border: '1px solid var(--border)',
      overflow: 'hidden',
      boxShadow: 'var(--shadow)',
      animation: 'fadeUp 0.3s ease',
    }}>
      {/* Header */}
      <div style={{
        background: 'var(--bg-accent)',
        padding: '32px 32px 28px',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(32px, 5vw, 48px)',
              fontWeight: 400,
              color: '#fff',
              lineHeight: 1.1,
              marginBottom: '8px',
              letterSpacing: '-0.02em',
            }}>
              {data.word}
            </h1>
            {data.phonetic && (
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '18px', fontStyle: 'italic', letterSpacing: '0.02em' }}>
                {data.phonetic}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button
              onClick={handleAudio}
              title="Play pronunciation"
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: playing ? 'var(--gold)' : 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', transition: 'all 0.2s',
                animation: playing ? 'pulse 0.6s ease infinite' : 'none',
              }}
            >
              {playing ? <Volume2 size={18} /> : <Volume2 size={18} />}
            </button>
            <button
              onClick={() => onToggleSave(data.word)}
              title={isSaved ? 'Remove from saved' : 'Save word'}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: isSaved ? 'var(--gold)' : 'rgba(255,255,255,0.12)',
                border: '1.5px solid rgba(255,255,255,0.2)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', transition: 'all 0.2s',
              }}
            >
              {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
            </button>
          </div>
        </div>

        {/* IELTS badge */}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{
            background: 'var(--gold)', color: '#fff',
            fontSize: '11px', fontWeight: 600, padding: '4px 12px',
            borderRadius: '20px', letterSpacing: '0.08em', textTransform: 'uppercase',
          }}>
            IELTS Academic
          </span>
          <span style={{
            background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)',
            fontSize: '11px', fontWeight: 500, padding: '4px 12px', borderRadius: '20px',
          }}>
            {data.meanings.length} meaning{data.meanings.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Meanings */}
      <div style={{ padding: '28px 32px 32px' }}>
        {data.meanings.map((m, i) => (
          <MeaningBlock key={i} meaning={m} idx={i} />
        ))}
      </div>
    </div>
  )
}
