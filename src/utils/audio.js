let currentAudio = null

export function playAudio(url, word) {
  if (currentAudio) { currentAudio.pause(); currentAudio = null }

  if (url) {
    const audio = new Audio(url)
    currentAudio = audio
    audio.play().catch(() => speakWord(word))
    return
  }
  speakWord(word)
}

function speakWord(word) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(word)
  utter.lang = 'en-US'
  utter.rate = 0.85
  window.speechSynthesis.speak(utter)
}

export function speakText(text, slow = false) {
  if (!window.speechSynthesis) return
  window.speechSynthesis.cancel()
  const utter = new SpeechSynthesisUtterance(text)
  utter.lang = 'en-US'
  utter.rate = slow ? 0.65 : 0.9
  window.speechSynthesis.speak(utter)
}
