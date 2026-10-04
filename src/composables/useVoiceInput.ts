import { onBeforeUnmount, ref } from 'vue'

interface RecognitionLike {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null
  onerror: ((event: { error?: string }) => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}
type RecognitionConstructor = new () => RecognitionLike

function getConstructor(): RecognitionConstructor | null {
  const w = window as Window & { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor }
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null
}

export function useVoiceInput() {
  const supported = typeof window !== 'undefined' && Boolean(getConstructor())
  const listening = ref(false)
  const error = ref<string | null>(null)
  let recognition: RecognitionLike | null = null

  const start = (onTranscript: (value: string) => void) => {
    const Constructor = getConstructor()
    if (!Constructor) {
      error.value = 'Voice input is not supported in this browser. You can type the answer instead.'
      return
    }
    error.value = null
    recognition = new Constructor()
    recognition.lang = 'en-GB'
    recognition.interimResults = false
    recognition.maxAlternatives = 1
    recognition.onresult = event => {
      const transcript = event.results[0]?.[0]?.transcript?.trim()
      if (transcript) onTranscript(transcript)
      else error.value = 'I could not hear an answer. Please try again or type it instead.'
    }
    recognition.onerror = event => {
      error.value = event.error === 'not-allowed'
        ? 'Microphone permission was denied. Please allow microphone access or type the answer instead.'
        : 'Voice input could not be used. Please try again or type the answer instead.'
      listening.value = false
    }
    recognition.onend = () => { listening.value = false; recognition = null }
    listening.value = true
    try { recognition.start() } catch { listening.value = false; error.value = 'Voice input could not be started. Please type the answer instead.' }
  }

  const stop = () => { recognition?.stop(); listening.value = false }
  onBeforeUnmount(stop)
  return { supported, listening, error, start, stop }
}
