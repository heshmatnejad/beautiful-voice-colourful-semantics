export type ResponseMode = 'card' | 'typed' | null
export type SupportLevel = 'minimal' | 'standard' | 'higher'
export type LaunchContext = 'clinic' | 'home'
export type CueLevel = 0 | 1 | 2  // 0=none, 1=general feedback, 2=semantic hint

export interface RoleData {
  role: 'WHO' | 'DOING' | 'WHAT'
  expectedConcept: string
  acceptedResponse: string | null          // raw input
  displayValue: string | null              // formatted for sentence ("The pirate", "is reading", "a map")
  responseMode: ResponseMode
  isExact: boolean                         // card match or exact typed
  isSemanticAlt: boolean                   // typed semantic alternative
  totalAttempts: number
  incorrectAttempts: number
  hintsUsed: number
  highestCueLevel: CueLevel
  wasIndependent: boolean                  // no hint/cue used AND first attempt correct
  retrySucceeded: boolean                  // succeeded after ≥1 incorrect attempt
}

export interface ExerciseResult {
  exerciseNumber: 1 | 2 | 3
  completed: boolean
  sentenceProduced: string
  who: RoleData
  doing: RoleData
  what: RoleData
}

export interface SessionConfig {
  launchContext: LaunchContext
  typedAnswerEnabled: boolean
  supportLevel: SupportLevel
  exerciseCount: number
  /** Optional therapist-authored topics used to seed exercise generation. */
  topics: string[]
  /** Controls whether the child-facing completion screen exposes results. */
  showResultsToChild: boolean
}

export interface SessionResults {
  config: SessionConfig
  exercises: (ExerciseResult | null)[]
  sessionStart: Date
  sessionEnd?: Date
}

export function emptyRoleData(role: 'WHO' | 'DOING' | 'WHAT', expectedConcept: string): RoleData {
  return {
    role,
    expectedConcept,
    acceptedResponse: null,
    displayValue: null,
    responseMode: null,
    isExact: false,
    isSemanticAlt: false,
    totalAttempts: 0,
    incorrectAttempts: 0,
    hintsUsed: 0,
    highestCueLevel: 0,
    wasIndependent: false,
    retrySucceeded: false,
  }
}
