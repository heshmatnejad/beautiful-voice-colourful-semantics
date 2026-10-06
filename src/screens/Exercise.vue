<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue'
import BVChildShell from '../components/BVChildShell.vue'
import { EXERCISES, ROLE_KEYS, ROLE_STYLE, type RoleKey } from '../data/exercises'
import { useSpeech } from '../composables/useSpeech'
import { useVoiceInput } from '../composables/useVoiceInput'
import { emptyRoleData, type CueLevel, type ExerciseResult, type RoleData, type SessionConfig } from '../types/session'
import { validateCard, validateTyped, type StepConfig } from '../utils/validation'

const props = defineProps<{ exerciseNumber: 1 | 2 | 3; templateNumber: 1 | 2 | 3; config: SessionConfig }>()
const emit = defineEmits<{ complete: [result: ExerciseResult] }>()
const def = computed(() => EXERCISES[props.templateNumber])
const currentIndex = ref(0)
const coins = ref(0)
const { speak } = useSpeech()
const voice = useVoiceInput()

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
const steps = reactive<StepState[]>([0, 1, 2].map(i => ({ status: i === 0 ? 'active' : 'pending', displayValue: null, acceptedRaw: null, responseMode: null, isSemanticAlt: false, totalAttempts: 0, incorrectAttempts: 0, hintsUsed: 0, cueLevel: 0, typedInput: '', feedback: null, feedbackType: null, rejectedCardId: null })))
const isComplete = computed(() => currentIndex.value === 3)
const role = computed<RoleKey>(() => ROLE_KEYS[Math.min(currentIndex.value, 2)])
const step = computed(() => steps[Math.min(currentIndex.value, 2)])
const roleStyle = computed(() => ROLE_STYLE[role.value])
const sentence = computed(() => `${steps.map(s => s.displayValue).filter(Boolean).join(' ')}.`)
const questionText = computed(() => ({ WHO: 'Who is it?', DOING: 'What are they doing?', WHAT: 'What are they doing it with?' }[role.value]))

onMounted(() => setTimeout(() => speak(questionText.value), 300))
watch(currentIndex, () => { if (!isComplete.value) setTimeout(() => speak(questionText.value), 250) })

function accept(display: string, raw: string, mode: 'card' | 'typed', semantic: boolean) {
  const current = steps[currentIndex.value]
  current.status = 'accepted'; current.displayValue = display; current.acceptedRaw = raw; current.responseMode = mode; current.isSemanticAlt = semantic; current.totalAttempts += 1; current.feedback = null; current.feedbackType = null; current.rejectedCardId = null
  coins.value += 1
  const next = currentIndex.value + 1
  currentIndex.value = next
  if (next < 3) steps[next].status = 'active'
  speak(['Nice!', 'Great!', 'Yes!', 'Correct!'][current.totalAttempts % 4])
}

function reject(cardId: string | null) {
  const current = steps[currentIndex.value]
  current.totalAttempts += 1; current.incorrectAttempts += 1; current.rejectedCardId = cardId; current.feedbackType = 'error'
  current.feedback = current.incorrectAttempts > 2 ? 'You are working hard — try the Hint for a clue.' : 'Good try! Have another look.'
  if (props.config.supportLevel === 'higher' && current.incorrectAttempts === 1) {
    current.hintsUsed += 1; current.cueLevel = 1; current.feedbackType = 'hint'; current.feedback = def.value.steps[currentIndex.value].hintL1; speak(current.feedback)
  }
}

function chooseCard(id: string) {
  const result = validateCard(id, def.value.steps[currentIndex.value])
  result.accepted ? accept(result.displayValue, id, 'card', result.isSemanticAlt) : reject(id)
}
function submitTyped() {
  if (!step.value.typedInput.trim()) return
  const result = validateTyped(step.value.typedInput, def.value.steps[currentIndex.value])
  result.accepted ? accept(result.displayValue, step.value.typedInput, 'typed', result.isSemanticAlt) : reject(null)
}
function useHint() {
  const current = steps[currentIndex.value]
  const config = def.value.steps[currentIndex.value]
  current.cueLevel = Math.min(2, current.cueLevel + 1) as CueLevel
  current.hintsUsed += 1; current.feedbackType = 'hint'; current.feedback = current.cueLevel === 2 ? (config.hintL2 ?? config.hintL1) : config.hintL1; current.rejectedCardId = null
  speak(current.feedback)
}
function startVoice() { voice.start(transcript => { step.value.typedInput = transcript }) }

function toRoleData(state: StepState, roleName: RoleKey, concept: string): RoleData {
  return { ...emptyRoleData(roleName, concept), acceptedResponse: state.acceptedRaw, displayValue: state.displayValue, responseMode: state.responseMode, isExact: state.status === 'accepted' && !state.isSemanticAlt, isSemanticAlt: state.isSemanticAlt, totalAttempts: state.totalAttempts, incorrectAttempts: state.incorrectAttempts, hintsUsed: state.hintsUsed, highestCueLevel: state.cueLevel, wasIndependent: state.incorrectAttempts === 0 && state.hintsUsed === 0, retrySucceeded: state.incorrectAttempts > 0 }
}
function finish() {
  const result: ExerciseResult = { exerciseNumber: props.exerciseNumber, completed: true, sentenceProduced: sentence.value, who: toRoleData(steps[0], 'WHO', def.value.steps[0].correctCardId), doing: toRoleData(steps[1], 'DOING', def.value.steps[1].correctCardId), what: toRoleData(steps[2], 'WHAT', def.value.steps[2].correctCardId) }
  emit('complete', result)
}
</script>

<template>
  <BVChildShell>
    <div class="flex h-[calc(100vh-58px)] overflow-hidden">
      <div class="flex-1 flex flex-col p-4 gap-3 min-w-0 overflow-hidden">
        <template v-if="!isComplete">
          <div class="flex items-center justify-between gap-3 bg-white rounded-2xl px-5 py-3 shadow-sm border border-gray-100"><div class="flex items-center gap-3"><span class="text-gray-400 font-medium">Building:</span><span v-for="(name, i) in ROLE_KEYS" :key="name" :class="['px-4 py-2 rounded-xl text-lg font-bold', steps[i].status === 'accepted' ? ROLE_STYLE[name].chip : 'border-2 border-dashed border-gray-200 text-gray-300']">{{ steps[i].status === 'accepted' ? steps[i].displayValue : `${name}?` }}</span><span v-if="isComplete">.</span></div><span class="text-xs rounded-full bg-purple-50 text-purple-700 px-3 py-1 font-semibold">{{ config.topicPlan[exerciseNumber - 1]?.requestedTopic }}</span></div>
          <div :class="['flex items-center gap-3 rounded-2xl border-l-4 px-5 py-4 flex-shrink-0', roleStyle.bg, roleStyle.border]"><div class="flex-1 text-2xl font-semibold text-gray-700">{{ questionText }}</div><button @click="speak(questionText)" aria-label="Hear the question again" class="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 text-2xl">🔊</button></div>
          <div class="flex-1 flex gap-4 min-h-0 overflow-hidden"><div :class="['w-64 flex-shrink-0 rounded-3xl border flex items-center justify-center p-4', roleStyle.bg, roleStyle.border]"><img :src="def.contextImage" :alt="def.contextAlt" class="w-full h-full object-contain" /></div><div class="flex-1 flex flex-col gap-3 min-h-0 overflow-hidden"><div class="flex-1 grid grid-cols-2 gap-4 min-h-0"> <button v-for="card in def.cardSets[currentIndex]" :key="card.id" @click="chooseCard(card.id)" :class="['rounded-2xl border-2 flex flex-col items-center justify-center gap-2 p-3 transition-all', step.rejectedCardId === card.id ? 'bg-amber-50 border-amber-400' : 'bg-[#f5ede0] border-transparent hover:border-purple-300 hover:bg-white']"><img :src="card.img" :alt="card.label" class="max-h-[130px] max-w-full object-contain" /><span class="text-lg font-bold text-gray-800">{{ card.label }}</span></button></div><div v-if="step.feedback" :class="['rounded-xl border px-4 py-3 text-base font-medium', step.feedbackType === 'hint' ? 'bg-blue-50 border-blue-300 text-blue-900' : 'bg-amber-50 border-amber-300 text-amber-900']">{{ step.feedback }}</div><div v-if="voice.error" class="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-800">{{ voice.error }}</div><div v-if="config.typedAnswerEnabled" class="flex items-center gap-2"><span class="text-sm text-gray-500 whitespace-nowrap">Or type your own:</span><input v-model="step.typedInput" @keyup.enter="submitTyped" class="flex-1 border-2 border-gray-200 focus:border-purple-500 rounded-xl px-4 py-2.5 text-lg outline-none" :placeholder="role === 'WHO' ? 'Type a person…' : role === 'DOING' ? 'Type a doing word…' : 'Type a thing…'" /><button @click="submitTyped" :disabled="!step.typedInput.trim()" class="bg-purple-600 disabled:bg-gray-200 text-white px-4 py-2.5 rounded-xl font-bold">Submit</button><button @click="startVoice" :disabled="!voice.supported || voice.listening" :class="['w-11 h-11 rounded-xl border text-xl', voice.listening ? 'bg-red-100 border-red-300 animate-pulse' : 'bg-purple-50 border-purple-200 text-purple-600']" :title="voice.supported ? 'Use voice input' : 'Voice input is not supported in this browser'">{{ voice.listening ? '⏺' : '🎙️' }}</button></div></div></div>
        </template>
        <template v-else><div class="flex-1 flex flex-col items-center justify-center gap-6"><div class="text-8xl">⭐</div><h2 class="text-5xl font-black text-gray-800">Well done!</h2><div class="bg-white border-2 border-purple-200 rounded-3xl px-8 py-5 text-center shadow-md w-full max-w-2xl"><p class="text-sm text-gray-500 uppercase tracking-widest mb-2">Your sentence</p><p class="text-3xl font-bold text-gray-800">“{{ sentence }}” <button @click="speak(sentence)">🔊</button></p></div><div class="flex gap-4"><span v-for="(name, i) in ROLE_KEYS" :key="name" class="px-4 py-2 rounded-xl font-bold" :class="ROLE_STYLE[name].chip">{{ name }} ✓</span></div><button @click="finish" class="bg-purple-600 hover:bg-purple-700 text-white font-black text-xl px-12 py-4 rounded-2xl">Next →</button></div></template>
      </div>
      <aside class="w-64 flex-shrink-0 bg-white border-l border-gray-200 p-5 flex flex-col gap-5"><div class="text-center"><div class="text-sm text-gray-500 uppercase tracking-wide">Exercise</div><div class="text-4xl font-black text-gray-800">{{ exerciseNumber }} <span class="text-xl text-gray-400">/ {{ config.exerciseCount }}</span></div><div class="flex justify-center gap-2 mt-3"><span v-for="n in config.exerciseCount" :key="n" :class="['w-8 h-8 rounded-full grid place-items-center font-bold', n < exerciseNumber ? 'bg-green-500 text-white' : n === exerciseNumber ? 'bg-purple-600 text-white' : 'border text-gray-400']">{{ n < exerciseNumber ? '✓' : n }}</span></div></div><div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center"><div class="text-3xl">🪙 {{ coins }}</div><div class="text-xs text-amber-800 font-semibold">Coins earned</div></div><button v-if="!isComplete && config.supportLevel !== 'minimal'" @click="useHint" class="w-full py-3 rounded-2xl border-2 border-purple-200 text-purple-700 font-bold">💡 Hint</button><div class="mt-auto bg-[#f0f7f0] rounded-2xl p-4 text-center"><b class="text-green-800">{{ isComplete ? 'Great sentence!' : 'You can do it!' }}</b><p class="text-sm text-green-700 mt-1">{{ isComplete ? 'Press Next to continue.' : 'Take your time.' }}</p></div></aside>
    </div>
  </BVChildShell>
</template>
