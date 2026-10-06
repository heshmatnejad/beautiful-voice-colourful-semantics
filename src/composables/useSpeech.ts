import { onBeforeUnmount } from 'vue'

export function useSpeech() {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window

  const speak = (text: string) => {
    if (!supported) return false
    try {
      const synthesis = window.speechSynthesis
      synthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-GB'
      utterance.rate = 0.85
      utterance.pitch = 1.05
      synthesis.resume()
      synthesis.speak(utterance)
      return true
    } catch {
      return false
    }
  }

  const cancel = () => {
    if (supported) window.speechSynthesis.cancel()
  }

  onBeforeUnmount(cancel)
  return { supported, speak, cancel }
}
