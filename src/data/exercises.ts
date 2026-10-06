import { IMG } from '../assets/images'
import { EX1_WHO, EX1_DOING, EX1_WHAT, EX2_WHO, EX2_DOING, EX2_WHAT, EX3_WHO, EX3_DOING, EX3_WHAT, type StepConfig } from '../utils/validation'

export interface CardDatum { id: string; label: string; img: string }
export interface ExerciseDef {
  steps: [StepConfig, StepConfig, StepConfig]
  cardSets: [CardDatum[], CardDatum[], CardDatum[]]
  contextImage: string
  contextAlt: string
  whoPromptNote?: string
}

export const WHO_CARDS: CardDatum[] = [
  { id: 'pirate', label: 'Pirate', img: IMG.pirate }, { id: 'girl', label: 'Girl', img: IMG.girl },
  { id: 'monkey', label: 'Monkey', img: IMG.monkey }, { id: 'pig', label: 'Pig', img: IMG.pig },
]
export const DOING_CARDS: CardDatum[] = [
  { id: 'blowing', label: 'Blowing', img: IMG.blowing }, { id: 'eating', label: 'Eating', img: IMG.eating },
  { id: 'reading', label: 'Reading', img: IMG.reading }, { id: 'drinking', label: 'Drinking', img: IMG.drinking },
]
export const WHAT_EX12: CardDatum[] = [
  { id: 'flower', label: 'Flower', img: IMG.flower }, { id: 'sun', label: 'Sun', img: IMG.sun },
  { id: 'map', label: 'Map', img: IMG.map }, { id: 'ball', label: 'Ball', img: IMG.ball },
]
export const WHAT_EX3: CardDatum[] = [
  { id: 'flower', label: 'Flower', img: IMG.flower }, { id: 'sun', label: 'Sun', img: IMG.sun },
  { id: 'cookie', label: 'Cookie', img: IMG.cookie }, { id: 'ball', label: 'Ball', img: IMG.ball },
]

export const EXERCISES: Record<1 | 2 | 3, ExerciseDef> = {
  1: { steps: [EX1_WHO, EX1_DOING, EX1_WHAT], cardSets: [WHO_CARDS, DOING_CARDS, WHAT_EX12], contextImage: IMG.pirate, contextAlt: 'Pirate reading a treasure map' },
  2: { steps: [EX2_WHO, EX2_DOING, EX2_WHAT], cardSets: [WHO_CARDS, DOING_CARDS, WHAT_EX12], contextImage: IMG.pirate, contextAlt: 'Pirate reading a treasure map', whoPromptNote: 'Can you think of another name?' },
  3: { steps: [EX3_WHO, EX3_DOING, EX3_WHAT], cardSets: [WHO_CARDS, DOING_CARDS, WHAT_EX3], contextImage: IMG.eating, contextAlt: 'Girl eating a cookie' },
}

export const ROLE_KEYS = ['WHO', 'DOING', 'WHAT'] as const
export type RoleKey = typeof ROLE_KEYS[number]
export const ROLE_STYLE: Record<RoleKey, { text: string; bg: string; border: string; chip: string }> = {
  WHO: { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-300', chip: 'bg-orange-100 text-orange-800' },
  DOING: { text: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-300', chip: 'bg-yellow-100 text-yellow-800' },
  WHAT: { text: 'text-green-700', bg: 'bg-green-50', border: 'border-green-400', chip: 'bg-green-100 text-green-800' },
}
