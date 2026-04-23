import { useState } from 'react'
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react'
import { speakText } from '../utils/audio'
import { WORD_LIST } from '../data/wordList'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function QuizPanel({ wordData }) {
  const [step, setStep]     = useState('idle')
  const [opts, setOpts]     = useState([])
  const [chosen, setChosen] = useState(null)
  const [score, setScore]   = useState({ correct: 0, total: 0 })

  if (!wordData) return null

  const correctDef = wordData.meanings[0]?.definitions[0]?.definition

  const startQuiz = () => {
    const decoys = shuffle(WORD_LIST)
      .filter(w => w !== wordData.word)
      .slice(0, 3)
    const fakeOptions = [
      { text: 'Related to financial planning and budgeting' },
      { text: 'A form of artistic expression using movement' },
      { text: 'The process of scientific measurement' },
    ]
    const allOpts = shuffle([
      { text: correctDef, correct: true },
      ...fakeOptions.slice(0, 3).map(o => ({ ...o, correct: false }))
    ])
    setOpts(allOpts)
    setChosen(null)
    setStep('question')
    speakText(wordData.word)
  }

  const pick = (opt) => {
    if (chosen !== null) return
    setChosen(opt)
    setScore(s => ({ correct: s.correct + (opt.correct ? 1 : 0), total: s.total + 1 }))
    setStep('result')
  }

  const isCorrect = chosen?.correct

  return (
    <div style={{
      background: '#fff',
      borderRadius: '20px',
      border: '1px solid var(--border)',
      padding: '24px',
      boxShadow: 'var(--shadow)',
      animation: 'fadeUp 0.3s ease',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', fontWeight: 400 }}>
          Quick Quiz
        </h3>
        {score.total > 0 && (
          <span style={{ fontSize: '13px', color: 'var(--ink-3)', fontWeight: 500 }}>
            {score.correct}/{score.total} correct
          </span>
        )}
      </div>

      {step === 'idle' && (
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <p style={{ fontSize: '14px', color: 'var(--ink-3)', marginBottom: '16px' }}>
            Test your understanding of <strong style={{ color: 'var(--ink)' }}>{wordData.word}</strong>
          </p>
          <button
            onClick={startQuiz}
            style={{
              background: 'var(--bg-accent)', color: '#fff', border: 'none',
              borderRadius: '50px', padding: '12px 28px', fontSize: '14px',
              fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
              letterSpacing: '0.02em', transition: 'opacity 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Start Quiz ↗
          </button>
        </div>
      )}

      {(step === 'question' || step === 'result') && (
        <div>
          <p style={{ fontSize: '13px', color: 'var(--ink-3)', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Which definition matches?
          </p>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '26px', color: 'var(--ink)', marginBottom: '18px' }}>
            {wordData.word}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {opts.map((opt, i) => {
              let bg = 'var(--bg)', border = '1px solid var(--border)', color = 'var(--ink)'
              if (step === 'result') {
                if (opt.correct) { bg = 'var(--teal-light)'; border = '1px solid var(--teal)'; color = 'var(--teal)' }
                else if (opt === chosen) { bg = 'var(--rose-light)'; border = '1px solid var(--rose)'; color = 'var(--rose)' }
              }
              return (
                <button
                  key={i}
                  onClick={() => pick(opt)}
                  style={{
                    background: bg, border, color,
                    borderRadius: '12px', padding: '12px 14px',
                    textAlign: 'left', cursor: step === 'result' ? 'default' : 'pointer',
                    fontSize: '13px', lineHeight: 1.5,
                    fontFamily: 'var(--font-body)', transition: 'all 0.15s',
                    display: 'flex', alignItems: 'flex-start', gap: '8px',
                  }}
                >
                  {step === 'result' && opt.correct && <CheckCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />}
                  {step === 'result' && opt === chosen && !opt.correct && <XCircle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />}
                  {opt.text}
                </button>
              )
            })}
          </div>

          {step === 'result' && (
            <button
              onClick={startQuiz}
              style={{
                marginTop: '16px', width: '100%', background: 'none',
                border: '1px solid var(--border)', borderRadius: '50px', padding: '10px',
                cursor: 'pointer', fontSize: '13px', color: 'var(--ink-2)',
                fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', gap: '6px', transition: 'background 0.15s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}
            >
              <RotateCcw size={14} /> Try again
            </button>
          )}
        </div>
      )}
    </div>
  )
}
