import { EXERCISES } from './exercises'
import type { TopicPlan } from '../types/session'

const PIRATE_WORDS = ['pirate', 'pirates', 'treasure', 'adventure', 'ship']
const ACTION_WORDS = ['everyday', 'action', 'actions', 'school', 'food', 'snack', 'home']

function normaliseTopic(topic: string): string {
  return topic.toLowerCase().trim().replace(/\s+/g, ' ')
}

function hasWord(topic: string, words: string[]): boolean {
  return words.some(word => topic.includes(word))
}

/**
 * Maps therapist-authored topics to existing, SLT-approved exercise templates.
 * Unknown topics deliberately fall back to a safe template rather than
 * inventing a new clinical target or unsupported picture vocabulary.
 */
export function buildTopicPlan(topics: string[], exerciseCount: number): TopicPlan[] {
  const requested = topics.map(normaliseTopic).filter(Boolean)
  const safeTopics = requested.length ? requested : ['everyday actions']

  return Array.from({ length: Math.max(1, Math.min(3, exerciseCount)) }, (_, index) => {
    const requestedTopic = safeTopics[index % safeTopics.length]
    const pirateTopic = hasWord(requestedTopic, PIRATE_WORDS)
    const actionTopic = hasWord(requestedTopic, ACTION_WORDS)
    const exerciseTemplate: 1 | 2 | 3 = pirateTopic
      ? index % 2 === 0 ? 1 : 2
      : actionTopic ? 3 : ([1, 3, 2] as const)[index % 3]

    // Keep this guard close to the generator so future templates cannot be
    // referenced here without being added to the approved exercise registry.
    if (!EXERCISES[exerciseTemplate]) throw new Error(`Missing approved template ${exerciseTemplate}`)

    return {
      requestedTopic,
      matchedTopic: pirateTopic ? 'Pirates and treasure' : actionTopic ? 'Everyday actions' : 'Approved starter activity',
      exerciseTemplate,
      isFallback: !pirateTopic && !actionTopic,
    }
  })
}

