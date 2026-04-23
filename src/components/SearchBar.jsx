import { useState, useRef } from 'react'
import { Search, X } from 'lucide-react'
import { WORD_LIST } from '../data/wordList'

const styles = {
  wrap: {
    position: 'relative',
    width: '100%',
  },
  inputWrap: {
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    border: '1.5px solid var(--border-strong)',
    borderRadius: '50px',
    padding: '0 20px',
    gap: '10px',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  },
  input: {
    flex: 1,
    border: 'none',
    outline: 'none',
    background: 'transparent',
    fontSize: '16px',
    color: 'var(--ink)',
    padding: '14px 0',
    fontFamily: 'var(--font-body)',
  },
  icon: { color: 'var(--ink-3)', flexShrink: 0 },
  clear: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--ink-3)', display: 'flex', padding: '2px',
  },
  dropdown: {
    position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0,
    background: '#fff', borderRadius: '16px',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-lg)',
    maxHeight: '260px', overflowY: 'auto',
    zIndex: 100,
    animation: 'fadeUp 0.15s ease',
  },
  item: {
    padding: '11px 20px',
    cursor: 'pointer',
    fontSize: '15px',
    color: 'var(--ink)',
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.12s',
  },
}

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const handleChange = (e) => {
    const val = e.target.value
    setQuery(val)
    if (val.length > 0) {
      setSuggestions(
        WORD_LIST.filter(w => w.startsWith(val.toLowerCase())).slice(0, 8)
      )
    } else {
      setSuggestions([])
    }
  }

  const handleSubmit = (word) => {
    const w = word || query.trim()
    if (!w) return
    setQuery(w)
    setSuggestions([])
    onSearch(w)
    inputRef.current?.blur()
  }

  return (
    <div style={styles.wrap}>
      <div
        style={{
          ...styles.inputWrap,
          borderColor: focused ? 'var(--gold)' : 'var(--border-strong)',
          boxShadow: focused ? '0 0 0 3px var(--gold-light)' : 'none',
        }}
      >
        <Search size={18} style={styles.icon} />
        <input
          ref={inputRef}
          style={styles.input}
          placeholder="Search any English word…"
          value={query}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => { setFocused(false); setSuggestions([]) }, 150)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {query && (
          <button style={styles.clear} onClick={() => { setQuery(''); setSuggestions([]) }}>
            <X size={16} />
          </button>
        )}
      </div>

      {suggestions.length > 0 && (
        <div style={styles.dropdown}>
          {suggestions.map((w, i) => (
            <div
              key={w}
              style={{
                ...styles.item,
                borderBottom: i === suggestions.length - 1 ? 'none' : undefined,
              }}
              onMouseDown={() => handleSubmit(w)}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              {w}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
