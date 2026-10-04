import { useState, useEffect, useRef } from 'react'
import { BVChildShell } from '../components/BVChildShell'
import { IMG } from '../assets/images'
import type { ExerciseResult, RoleData, SessionConfig, CueLevel } from '../types/session'
import { emptyRoleData } from '../types/session'
import {
  EX1_WHO, EX1_DOING, EX1_WHAT,
  EX2_WHO, EX2_DOING, EX2_WHAT,
  EX3_WHO, EX3_DOING, EX3_WHAT,
  validateCard, validateTyped,
  type StepConfig,
} from '../utils/validation'

export type ExerciseId = 1 | 2 | 3

// ── TTS ────────────────────────────────────────────────────────────────────

function speak(text: string): void {
  try {
    if (!('speechSynthesis' in window)) return
    window.speechSynthesis.cancel()
    const u = new SpeechSynthesisUtterance(text)
    u.rate = 0.85
    u.pitch = 1.05
    window.speechSynthesis.speak(u)
  } catch { /* silent fail */ }
}

function cancelSpeech(): void {
  try { if ('speechSynthesis' in window) window.speechSynthesis.cancel() } catch { /* */ }
}

// ── UX constants ───────────────────────────────────────────────────────────

const SUCCESS_PHRASES = ['Brilliant!', 'Great thinking!', 'You got it!', 'Nice work!', 'Well done!']
const MICRO_PRAISE = ['Nice!', 'Great!', 'Yes!', 'Correct!', 'Perfect!']

type RoleKey = 'WHO' | 'DOING' | 'WHAT'
const ROLE_KEYS: RoleKey[] = ['WHO', 'DOING', 'WHAT']

const QUESTION_SPEECH: Record<RoleKey, string> = {
  WHO:   'Who is it?',
  DOING: 'What are they doing?',
  WHAT:  'What are they doing it with?',
}

const ROLE_STYLE = {
  WHO:   { word: 'WHO',   textColor: 'text-orange-500', bg: 'bg-orange-50',  border: 'border-orange-300', chipOn: 'bg-orange-100 text-orange-800', chipOff: 'border-2 border-dashed border-orange-200 text-orange-300' },
  DOING: { word: 'DOING', textColor: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-300', chipOn: 'bg-yellow-100 text-yellow-800', chipOff: 'border-2 border-dashed border-yellow-200 text-yellow-400' },
  WHAT:  { word: 'WHAT',  textColor: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-400',  chipOn: 'bg-green-100 text-green-800',   chipOff: 'border-2 border-dashed border-green-200 text-green-400' },
}

const COMPLETION_BORDERS = ['border-orange-300', 'border-yellow-300', 'border-green-400']
const COMPLETION_LABELS  = ['text-orange-600', 'text-yellow-600', 'text-green-700']
const COMPLETION_BG      = ['bg-orange-50', 'bg-yellow-50', 'bg-green-50']

function getIncorrectFeedback(incorrectAttempts: number, hintsUsed: number): string {
  if (hintsUsed > 0) return 'Good thinking. Look at the clue and try once more.'
  if (incorrectAttempts <= 1) return 'Good try! Have another look.'
  if (incorrectAttempts === 2) return 'Nice trying! Would you like some help?'
  return "You're working hard — try the Hint for a clue."
}

// ── Props / fallback ───────────────────────────────────────────────────────

interface Props {
  exerciseId: ExerciseId
  sessionConfig?: SessionConfig
  onComplete: (result: ExerciseResult) => void
}

const FALLBACK_CONFIG: SessionConfig = {
  launchContext: 'clinic',
  typedAnswerEnabled: true,
  supportLevel: 'standard',
  exerciseCount: 3,
}

// ── Card data ──────────────────────────────────────────────────────────────

interface CardDatum { id: string; label: string; img: string }

const WHO_CARDS: CardDatum[] = [
  { id: 'pirate', label: 'Pirate', img: IMG.pirate },
  { id: 'girl',   label: 'Girl',   img: IMG.girl },
  { id: 'monkey', label: 'Monkey', img: IMG.monkey },
  { id: 'pig',    label: 'Pig',    img: IMG.pig },
]
const DOING_CARDS: CardDatum[] = [
  { id: 'blowing',  label: 'Blowing',  img: IMG.blowing },
  { id: 'eating',   label: 'Eating',   img: IMG.eating },
  { id: 'reading',  label: 'Reading',  img: IMG.reading },
  { id: 'drinking', label: 'Drinking', img: IMG.drinking },
]
const WHAT_EX12: CardDatum[] = [
  { id: 'flower', label: 'Flower', img: IMG.flower },
  { id: 'sun',    label: 'Sun',    img: IMG.sun },
  { id: 'map',    label: 'Map',    img: IMG.map },
  { id: 'ball',   label: 'Ball',   img: IMG.ball },
]
const WHAT_EX3: CardDatum[] = [
  { id: 'flower', label: 'Flower', img: IMG.flower },
  { id: 'sun',    label: 'Sun',    img: IMG.sun },
  { id: 'cookie', label: 'Cookie', img: IMG.cookie },
  { id: 'ball',   label: 'Ball',   img: IMG.ball },
]

// ── Exercise definitions ───────────────────────────────────────────────────

interface ExerciseDef {
  steps: [StepConfig, StepConfig, StepConfig]
  cardSets: [CardDatum[], CardDatum[], CardDatum[]]
  contextImage: string
  contextAlt: string
  whoPromptNote?: string
}

const DEFS: Record<ExerciseId, ExerciseDef> = {
  1: { steps: [EX1_WHO, EX1_DOING, EX1_WHAT], cardSets: [WHO_CARDS, DOING_CARDS, WHAT_EX12], contextImage: IMG.pirate, contextAlt: 'Pirate reading a treasure map' },
  2: { steps: [EX2_WHO, EX2_DOING, EX2_WHAT], cardSets: [WHO_CARDS, DOING_CARDS, WHAT_EX12], contextImage: IMG.pirate, contextAlt: 'Pirate reading a treasure map', whoPromptNote: 'Can you think of another name?' },
  3: { steps: [EX3_WHO, EX3_DOING, EX3_WHAT], cardSets: [WHO_CARDS, DOING_CARDS, WHAT_EX3],  contextImage: IMG.eating, contextAlt: 'Girl eating a cookie' },
}

// ── Step state ────────────────────────────────────────────────────────────

interface StepState {
  status: 'pending' | 'active' | 'accepted'
  displayValue: string | null
  acceptedRaw: string | null
  responseMode: 'card' | 'typed' | null
  isSemanticAlt: boolean
  totalAttempts: number
  incorrectAttempts: number
  hintsUsed: number
  cueLevel: CueLevel
  typedInput: string
  feedback: string | null
  feedbackType: 'error' | 'hint' | null
  rejectedCardId: string | null
}

function initStep(roleIdx: number): StepState {
  return {
    status: roleIdx === 0 ? 'active' : 'pending',
    displayValue: null, acceptedRaw: null, responseMode: null,
    isSemanticAlt: false, totalAttempts: 0, incorrectAttempts: 0, hintsUsed: 0,
    cueLevel: 0, typedInput: '', feedback: null, feedbackType: null, rejectedCardId: null,
  }
}

function toRoleData(step: StepState, role: RoleKey, concept: string): RoleData {
  return {
    ...emptyRoleData(role, concept),
    acceptedResponse: step.acceptedRaw,
    displayValue: step.displayValue,
    responseMode: step.responseMode,
    isExact: step.status === 'accepted' && !step.isSemanticAlt,
    isSemanticAlt: step.isSemanticAlt,
    totalAttempts: step.totalAttempts,
    incorrectAttempts: step.incorrectAttempts,
    hintsUsed: step.hintsUsed,
    highestCueLevel: step.cueLevel,
    wasIndependent: step.status === 'accepted' && step.incorrectAttempts === 0 && step.hintsUsed === 0,
    retrySucceeded: step.status === 'accepted' && step.incorrectAttempts > 0,
  }
}

function buildResult(num: ExerciseId, steps: StepState[], def: ExerciseDef): ExerciseResult {
  const who   = toRoleData(steps[0], 'WHO',   def.steps[0].correctCardId)
  const doing = toRoleData(steps[1], 'DOING', def.steps[1].correctCardId)
  const what  = toRoleData(steps[2], 'WHAT',  def.steps[2].correctCardId)
  const sentence = [who.displayValue, doing.displayValue, what.displayValue].filter(Boolean).join(' ') + '.'
  return { exerciseNumber: num, completed: true, sentenceProduced: sentence, who, doing, what }
}

function getCompletionImg(step: StepState, cards: CardDatum[], correctId: string, fallback: string): string {
  if (step.responseMode === 'card' && step.acceptedRaw) {
    return cards.find(c => c.id === step.acceptedRaw)?.img ?? fallback
  }
  return cards.find(c => c.id === correctId)?.img ?? fallback
}

// ── Sub-components ────────────────────────────────────────────────────────

function SentenceStrip({ steps }: { steps: StepState[] }) {
  const allDone = steps.every(s => s.status === 'accepted')
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100 flex-shrink-0">
      <span className="text-base text-gray-400 font-medium flex-shrink-0">Building:</span>
      {ROLE_KEYS.map(role => {
        const step = steps[ROLE_KEYS.indexOf(role)]
        const s = ROLE_STYLE[role]
        return (
          <span key={role}
            className={`px-5 py-2 rounded-xl text-xl font-bold transition-all ${step.status === 'accepted' ? s.chipOn : s.chipOff}`}
          >
            {step.status === 'accepted' ? step.displayValue : `${role}?`}
          </span>
        )
      })}
      {allDone && <span className="text-gray-600 text-2xl font-bold">.</span>}
    </div>
  )
}

function QuestionBar({ role, promptNote, onSpeak }: {
  role: RoleKey; promptNote?: string; onSpeak: () => void
}) {
  const s = ROLE_STYLE[role]
  const parts = {
    WHO:   { before: '', word: 'WHO',   after: ' is it?' },
    DOING: { before: 'What are they ', word: 'DOING', after: '?' },
    WHAT:  { before: '', word: 'WHAT',  after: ' is it?' },
  }[role]

  return (
    <div className={`flex items-center gap-3 rounded-2xl border-l-4 px-5 py-4 ${s.bg} ${s.border} flex-shrink-0`}>
      <div className="flex-1 flex items-center gap-2 flex-wrap">
        {parts.before && <span className="text-2xl font-semibold text-gray-700">{parts.before}</span>}
        <span className={`text-4xl font-black ${s.textColor}`}>{parts.word}</span>
        <span className="text-2xl font-semibold text-gray-700">{parts.after}</span>
        {promptNote && <span className="text-base text-gray-400 ml-1">{promptNote}</span>}
      </div>
      <button
        onClick={onSpeak}
        title="Hear the question again"
        className="w-12 h-12 rounded-full bg-white shadow-sm hover:shadow-md border border-gray-200 flex items-center justify-center text-2xl flex-shrink-0 transition-all hover:scale-110"
      >
        🔊
      </button>
    </div>
  )
}

function CardGrid({ cards, rejectedId, onSelect, roleColor }: {
  cards: CardDatum[]
  rejectedId: string | null
  onSelect: (id: string) => void
  roleColor: string
}) {
  const hoverBorder: Record<string, string> = {
    'text-orange-500': 'hover:border-orange-400',
    'text-yellow-600': 'hover:border-yellow-400',
    'text-green-600':  'hover:border-green-500',
  }
  const hover = hoverBorder[roleColor] ?? 'hover:border-gray-400'

  return (
    <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
      {cards.map(card => {
        const isRejected = rejectedId === card.id
        return (
          <button
            key={card.id}
            onClick={() => onSelect(card.id)}
            className={`rounded-2xl border-3 flex flex-col items-center justify-center gap-3 p-4 transition-all duration-150 ${
              isRejected
                ? 'bg-amber-50 border-amber-400 shadow-inner scale-[0.98]'
                : `bg-[#f5ede0] border-2 border-transparent ${hover} hover:bg-white hover:shadow-lg hover:scale-[1.02]`
            }`}
          >
            <div className="flex-1 w-full flex items-center justify-center min-h-0">
              <img
                src={card.img}
                alt={card.label}
                className="max-h-full max-w-full object-contain"
                style={{ maxHeight: '160px' }}
              />
            </div>
            <span className={`text-xl font-bold flex-shrink-0 ${isRejected ? 'text-amber-700' : 'text-gray-800'}`}>
              {card.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function FeedbackBanner({ type, message }: { type: 'error' | 'hint'; message: string }) {
  const styles = {
    error: 'bg-amber-50 border-amber-300 text-amber-900',
    hint:  'bg-blue-50 border-blue-300 text-blue-900',
  }
  const icons = { error: '💭', hint: '💡' }
  return (
    <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${styles[type]} flex-shrink-0`}>
      <span className="text-xl flex-shrink-0">{icons[type]}</span>
      <span className="text-lg font-medium leading-snug">{message}</span>
    </div>
  )
}

function HintCallout() {
  return (
    <div className="flex items-center gap-2 bg-amber-50 border-2 border-amber-300 rounded-xl px-4 py-2.5 flex-shrink-0">
      <span className="text-xl">💡</span>
      <span className="text-base font-semibold text-amber-800">Need some help? Tap Hint!</span>
    </div>
  )
}

function TypedInput({ value, onChange, onSubmit, placeholder }: {
  value: string; onChange: (v: string) => void; onSubmit: () => void; placeholder: string
}) {
  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <p className="text-base text-gray-500 font-medium flex-shrink-0">Or type your own:</p>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSubmit()}
        placeholder={placeholder}
        className="flex-1 border-2 border-gray-200 focus:border-[#7c3aed] rounded-xl px-4 py-2.5 text-lg outline-none transition-colors"
      />
      <button
        onClick={onSubmit}
        disabled={!value.trim()}
        className="bg-[#7c3aed] disabled:bg-gray-200 text-white disabled:text-gray-400 px-5 py-2.5 rounded-xl text-base font-bold transition-colors flex-shrink-0"
      >
        Submit
      </button>
      <button title="Voice input (coming soon)" tabIndex={-1}
        className="w-11 h-11 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 cursor-default flex-shrink-0 text-xl">
        🎙️
      </button>
    </div>
  )
}

function RightPanel({ exerciseNum, totalExercises, currentIdx, isComplete, supportLevel, shouldPromoteHint, onHint, onNext }: {
  exerciseNum: ExerciseId; totalExercises: number; currentIdx: number
  isComplete: boolean; supportLevel: string; shouldPromoteHint: boolean
  onHint: () => void; onNext: () => void
}) {
  return (
    <div className="w-72 flex-shrink-0 bg-white border-l border-gray-200 flex flex-col p-5 gap-5 overflow-y-auto">
      {/* Exercise counter */}
      <div className="text-center">
        <div className="text-sm text-gray-500 font-medium uppercase tracking-wide mb-1">Exercise</div>
        <div className="text-4xl font-black text-gray-800">{exerciseNum} <span className="text-2xl font-medium text-gray-400">/ {totalExercises}</span></div>
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-3 mt-3">
          {Array.from({ length: totalExercises }, (_, i) => i + 1).map(n => (
            <div key={n} className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              n < exerciseNum  ? 'bg-green-500 border-green-500 text-white' :
              n === exerciseNum ? 'bg-[#7c3aed] border-[#7c3aed] text-white scale-110' :
              'bg-white border-gray-300 text-gray-400'
            }`}>
              {n < exerciseNum ? '✓' : n}
            </div>
          ))}
        </div>
        {/* Step pills */}
        <div className="flex gap-1.5 justify-center mt-3">
          {ROLE_KEYS.map((s, i) => (
            <span key={s} className={`text-xs font-bold px-2.5 py-1 rounded-full ${
              i < currentIdx  ? 'bg-gray-200 text-gray-500' :
              i === currentIdx && !isComplete ? 'bg-[#7c3aed] text-white' :
              isComplete       ? 'bg-green-200 text-green-700' :
              'bg-gray-100 text-gray-300'
            }`}>{s}</span>
          ))}
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!isComplete}
        className={`w-full py-4 rounded-2xl font-black text-xl flex items-center justify-center gap-2 transition-all ${
          isComplete
            ? 'bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg hover:shadow-xl hover:scale-[1.02]'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Next ›
      </button>

      {/* Encouragement */}
      <div className="bg-[#f0f7f0] rounded-2xl border border-green-100 p-4 flex items-start gap-3">
        <span className="text-3xl">🐥</span>
        <div>
          <div className="font-bold text-green-800 text-base">{isComplete ? 'Great sentence!' : 'You can do it!'}</div>
          <div className="text-sm text-green-700 mt-0.5">{isComplete ? 'Press Next to continue.' : 'Take your time.'}</div>
        </div>
      </div>

      {/* Hint area — hidden for minimal support or when complete */}
      {supportLevel !== 'minimal' && !isComplete && (
        <div className="flex flex-col gap-2">
          {shouldPromoteHint && <HintCallout />}
          <button
            onClick={onHint}
            className={`w-full py-3.5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
              shouldPromoteHint
                ? 'bg-amber-400 hover:bg-amber-500 text-white shadow-md animate-hint-glow'
                : 'bg-white border-2 border-[#7c3aed]/30 hover:border-[#7c3aed] text-[#7c3aed]'
            }`}
          >
            💡 Hint
          </button>
        </div>
      )}
    </div>
  )
}

// ── Exercise Core ─────────────────────────────────────────────────────────

function ExerciseCore({
  exerciseNum, def, sessionConfig = FALLBACK_CONFIG, onComplete,
}: {
  exerciseNum: ExerciseId
  def: ExerciseDef
  sessionConfig?: SessionConfig
  onComplete: (r: ExerciseResult) => void
}) {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [steps, setSteps] = useState<StepState[]>(() => [0, 1, 2].map(initStep))
  const { supportLevel, typedAnswerEnabled, exerciseCount } = sessionConfig ?? FALLBACK_CONFIG
  const isComplete = currentIdx === 3

  // ── TTS: auto-read question on step change ──
  useEffect(() => {
    if (isComplete) return
    const role = ROLE_KEYS[currentIdx] as RoleKey
    const t = setTimeout(() => speak(QUESTION_SPEECH[role]), 450)
    return () => clearTimeout(t)
  }, [currentIdx, isComplete])

  // ── TTS: read sentence on completion ──
  useEffect(() => {
    if (!isComplete) return
    const sentence = [steps[0].displayValue, steps[1].displayValue, steps[2].displayValue].filter(Boolean).join(' ') + '.'
    const phrase = SUCCESS_PHRASES[(exerciseNum - 1) % SUCCESS_PHRASES.length]
    const t1 = setTimeout(() => speak(phrase), 400)
    const t2 = setTimeout(() => speak(sentence), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [isComplete]) // eslint-disable-line

  // ── TTS: cleanup on unmount ──
  useEffect(() => () => cancelSpeech(), [])

  const mutStep = (idx: number, fn: (s: StepState) => StepState) =>
    setSteps(prev => prev.map((s, i) => i === idx ? fn(s) : s))

  const acceptCurrentStep = (displayValue: string, acceptedRaw: string, mode: 'card' | 'typed', isSemanticAlt: boolean) => {
    const step = steps[currentIdx]
    mutStep(currentIdx, s => ({
      ...s, status: 'accepted', displayValue, acceptedRaw, responseMode: mode, isSemanticAlt,
      totalAttempts: s.totalAttempts + 1, feedback: null, feedbackType: null, rejectedCardId: null,
    }))
    const nextIdx = currentIdx + 1
    setCurrentIdx(nextIdx)
    if (nextIdx < 3) setSteps(prev => prev.map((s, i) => i === nextIdx ? { ...s, status: 'active' } : s))
    // micro-praise TTS
    speak(MICRO_PRAISE[(step.totalAttempts + exerciseNum) % MICRO_PRAISE.length])
  }

  const rejectCurrentStep = (rejectedCardId: string | null) => {
    mutStep(currentIdx, s => {
      const newIncorrect = s.incorrectAttempts + 1
      const newTotal = s.totalAttempts + 1
      let cue = s.cueLevel
      let hints = s.hintsUsed
      let feedback = getIncorrectFeedback(newIncorrect, s.hintsUsed)
      let feedbackType: 'error' | 'hint' = 'error'

      // Higher support: auto-show L1 hint on first incorrect
      if (supportLevel === 'higher' && newIncorrect === 1 && s.cueLevel === 0) {
        cue = 1 as CueLevel
        hints++
        feedback = def.steps[currentIdx].hintL1
        feedbackType = 'hint'
        setTimeout(() => speak(def.steps[currentIdx].hintL1), 600)
      }

      return { ...s, totalAttempts: newTotal, incorrectAttempts: newIncorrect, hintsUsed: hints, cueLevel: cue, feedback, feedbackType, rejectedCardId }
    })
  }

  const handleCardSelect = (cardId: string) => {
    const cfg = def.steps[currentIdx]
    const r = validateCard(cardId, cfg)
    r.accepted ? acceptCurrentStep(r.displayValue, cardId, 'card', r.isSemanticAlt) : rejectCurrentStep(cardId)
  }

  const handleTypedSubmit = () => {
    const step = steps[currentIdx]
    if (!step.typedInput.trim()) return
    const r = validateTyped(step.typedInput, def.steps[currentIdx])
    r.accepted ? acceptCurrentStep(r.displayValue, step.typedInput, 'typed', r.isSemanticAlt) : rejectCurrentStep(null)
  }

  const handleHint = () => {
    mutStep(currentIdx, s => {
      const cfg = def.steps[currentIdx]
      const nextCue = Math.min(2, s.cueLevel + 1) as CueLevel
      const hintText = nextCue === 2 ? (cfg.hintL2 ?? cfg.hintL1) : cfg.hintL1
      setTimeout(() => speak(hintText), 200)
      return { ...s, cueLevel: nextCue, hintsUsed: s.hintsUsed + 1, feedback: hintText, feedbackType: 'hint', rejectedCardId: null }
    })
  }

  const handleNext = () => {
    if (isComplete) onComplete(buildResult(exerciseNum, steps, def))
  }

  const shouldPromoteHint = !isComplete &&
    supportLevel !== 'minimal' &&
    steps[currentIdx]?.incorrectAttempts >= 2 &&
    steps[currentIdx]?.hintsUsed === 0

  const currentRole = ROLE_KEYS[Math.min(currentIdx, 2)] as RoleKey
  const currentStep = steps[Math.min(currentIdx, 2)]
  const currentCards = def.cardSets[Math.min(currentIdx, 2)]
  const currentStyle = ROLE_STYLE[currentRole]

  // Completion images
  const completionImgs = [0, 1, 2].map(i => getCompletionImg(steps[i], def.cardSets[i], def.steps[i].correctCardId, def.contextImage))

  const sentence = [steps[0].displayValue, steps[1].displayValue, steps[2].displayValue].filter(Boolean).join(' ') + '.'
  const successPhrase = SUCCESS_PHRASES[(exerciseNum - 1) % SUCCESS_PHRASES.length]

  return (
    <div className="flex h-full overflow-hidden">
      {/* ── MAIN CONTENT ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-4 gap-3 min-w-0 overflow-hidden">

        {!isComplete ? (
          <>
            {/* Sentence strip */}
            <SentenceStrip steps={steps} />

            {/* Question */}
            <QuestionBar
              role={currentRole}
              promptNote={currentIdx === 0 ? def.whoPromptNote : undefined}
              onSpeak={() => speak(QUESTION_SPEECH[currentRole])}
            />

            {/* Image + cards area */}
            <div className="flex-1 flex gap-4 min-h-0 overflow-hidden">
              {/* Context image */}
              <div className={`w-64 xl:w-72 flex-shrink-0 rounded-3xl ${currentStyle.bg} border ${currentStyle.border} flex items-center justify-center p-4`}>
                <img src={def.contextImage} alt={def.contextAlt} className="w-full h-full object-contain" />
              </div>

              {/* Cards + feedback + typed */}
              <div className="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden">
                <CardGrid
                  cards={currentCards}
                  rejectedId={currentStep.rejectedCardId}
                  onSelect={handleCardSelect}
                  roleColor={currentStyle.textColor}
                />

                {/* Feedback banner */}
                {currentStep.feedback && (
                  <FeedbackBanner type={currentStep.feedbackType ?? 'error'} message={currentStep.feedback} />
                )}

                {/* Typed input */}
                {typedAnswerEnabled && (
                  <TypedInput
                    value={currentStep.typedInput}
                    onChange={v => mutStep(currentIdx, s => ({ ...s, typedInput: v }))}
                    onSubmit={handleTypedSubmit}
                    placeholder={currentRole === 'WHO' ? 'Type a person…' : currentRole === 'DOING' ? 'Type a doing word…' : 'Type a thing…'}
                  />
                )}
              </div>
            </div>
          </>
        ) : (
          /* ── COMPLETION STATE ─────────────────────────────── */
          <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
            <div className="text-8xl animate-star-pop leading-none">⭐</div>
            <h2 className="text-5xl font-black text-gray-800 text-center">{successPhrase}</h2>

            {/* Sentence box */}
            <div className="bg-white border-2 border-purple-200 rounded-3xl px-8 py-5 text-center shadow-md w-full max-w-2xl">
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-2 font-semibold">Your sentence</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <p className="text-3xl font-bold text-gray-800">"{sentence}"</p>
                <button
                  onClick={() => speak(sentence)}
                  title="Hear the sentence"
                  className="w-11 h-11 rounded-full bg-purple-50 border border-purple-200 flex items-center justify-center text-xl hover:bg-purple-100 transition-colors flex-shrink-0"
                >
                  🔊
                </button>
              </div>
            </div>

            {/* Role images */}
            <div className="flex gap-6 justify-center">
              {[0, 1, 2].map(i => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div className={`w-32 h-32 rounded-2xl border-4 overflow-hidden ${COMPLETION_BORDERS[i]} ${COMPLETION_BG[i]} flex items-center justify-center p-2`}>
                    <img src={completionImgs[i]} alt={ROLE_KEYS[i]} className="w-full h-full object-contain" />
                  </div>
                  <span className={`text-sm font-black uppercase ${COMPLETION_LABELS[i]}`}>{ROLE_KEYS[i]}</span>
                </div>
              ))}
            </div>

            {/* Large Next button in content area too */}
            <button
              onClick={handleNext}
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-2xl px-16 py-4 rounded-2xl shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02]"
            >
              Next ›
            </button>
          </div>
        )}
      </div>

      {/* ── RIGHT SIDEBAR ─────────────────────────────────── */}
      <RightPanel
        exerciseNum={exerciseNum}
        totalExercises={exerciseCount}
        currentIdx={currentIdx}
        isComplete={isComplete}
        supportLevel={supportLevel}
        shouldPromoteHint={shouldPromoteHint}
        onHint={handleHint}
        onNext={handleNext}
      />
    </div>
  )
}

// ── Export ────────────────────────────────────────────────────────────────

export function ExerciseScreen({ exerciseId, sessionConfig = FALLBACK_CONFIG, onComplete }: Props) {
  return (
    <BVChildShell>
      <ExerciseCore
        key={exerciseId}
        exerciseNum={exerciseId}
        def={DEFS[exerciseId]}
        sessionConfig={sessionConfig}
        onComplete={onComplete}
      />
    </BVChildShell>
  )
}
