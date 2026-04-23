import { Volume2 } from 'lucide-react'
import { playAudio } from '../utils/audio'
import { WORD_LIST } from '../data/wordList'

function getTodayWord() {
  const idx = new Date().getDate() % WORD_LIST.length
  return WORD_LIST[idx]
}

export default function WordOfDay({ onSearch }) {
  const word = getTodayWord()
  return (
    <div
      onClick={() => onSearch(word)}
      style={{
        background: 'linear-gradient(135deg, var(--bg-accent) 0%, #2D2D5E 100%)',
        borderRadius: '20px',
        padding: '24px 28px',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '120px', height: '120px', borderRadius: '50%', background: 'rgba(201,151,58,0.15)' }} />
      <div style={{ position: 'absolute', top: '20px', right: '30px', width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201,151,58,0.1)' }} />
      <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
        Word of the Day
      </p>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: '#fff', fontWeight: 400, letterSpacing: '-0.01em', marginBottom: '4px' }}>
        {word}
      </p>
      <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>
        Click to explore →
      </p>
    </div>
  )
}
