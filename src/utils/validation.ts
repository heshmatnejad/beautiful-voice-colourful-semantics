// Normalise text for comparison: lowercase, trim, strip punctuation, collapse spaces
export function normaliseText(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"]/g, '')
    .replace(/\s+/g, ' ')
}

export interface StepConfig {
  role: 'WHO' | 'DOING' | 'WHAT'
  correctCardId: string
  // All acceptable typed inputs (normalised). Includes both exact and semantic alternatives.
  acceptedTyped: Set<string>
  // Subset of acceptedTyped that are semantic alternatives (not the same as the card label)
  semanticAlts: Set<string>
  // Feedback shown after an incorrect attempt
  incorrectFeedback: string
  // Level-1 hint (general, on first Hint press)
  hintL1: string
  // Level-2 hint (stronger cue, on second Hint press — falls back to hintL1 if absent)
  hintL2?: string
}

export interface ValidationResult {
  accepted: boolean
  isSemanticAlt: boolean
  displayValue: string  // formatted for the live sentence strip
}

// --- Display formatters ---

/** "pirate" | "the pirate" | "captain" → "The pirate" / "The captain" */
export function fmtWHO(raw: string): string {
  const core = normaliseText(raw).replace(/^(a |an |the )/, '').trim()
  return 'The ' + core
}

/** "reading" | "is reading" | "looking at the map" → "is reading" / "is looking at the map" */
export function fmtDOING(raw: string): string {
  const core = normaliseText(raw).replace(/^(is |are |was |were )/, '').trim()
  return 'is ' + core
}

/** "map" | "a map" | "cookie" | "biscuit" → "a map" / "a cookie" / "a biscuit" */
export function fmtWHAT(raw: string): string {
  const core = normaliseText(raw).replace(/^(a |an |the )/, '').trim()
  const article = 'aeiou'.includes(core[0]) ? 'an ' : 'a '
  return article + core
}

function fmt(role: 'WHO' | 'DOING' | 'WHAT', value: string): string {
  if (role === 'WHO') return fmtWHO(value)
  if (role === 'DOING') return fmtDOING(value)
  return fmtWHAT(value)
}

// --- Card validation ---
export function validateCard(cardId: string, step: StepConfig): ValidationResult {
  if (cardId === step.correctCardId) {
    return { accepted: true, isSemanticAlt: false, displayValue: fmt(step.role, cardId) }
  }
  return { accepted: false, isSemanticAlt: false, displayValue: '' }
}

// --- Typed text validation ---
export function validateTyped(raw: string, step: StepConfig): ValidationResult {
  if (!raw.trim()) return { accepted: false, isSemanticAlt: false, displayValue: '' }
  const n = normaliseText(raw)
  if (step.acceptedTyped.has(n)) {
    const isAlt = step.semanticAlts.has(n)
    return { accepted: true, isSemanticAlt: isAlt, displayValue: fmt(step.role, n) }
  }
  return { accepted: false, isSemanticAlt: false, displayValue: '' }
}

// ================================================================
// EXERCISE STEP CONFIGURATIONS
// ================================================================

// --- Exercise 1: Pirate reading a map ---

export const EX1_WHO: StepConfig = {
  role: 'WHO',
  correctCardId: 'pirate',
  acceptedTyped: new Set([
    'pirate', 'the pirate', 'a pirate',
    'captain', 'the captain', 'a captain',
    'pirate captain', 'the pirate captain', 'a pirate captain',
  ]),
  semanticAlts: new Set(['captain', 'the captain', 'a captain', 'pirate captain', 'the pirate captain', 'a pirate captain']),
  incorrectFeedback: 'Good try. Who can you see in the picture?',
  hintL1: 'Who is holding the treasure map?',
  hintL2: 'Look for the character wearing a pirate hat.',
}

export const EX1_DOING: StepConfig = {
  role: 'DOING',
  correctCardId: 'reading',
  acceptedTyped: new Set([
    'reading', 'is reading',
    'looking at the map', 'looking at a map',
    'studying the map', 'studying a map',
    'checking the map', 'checking a map',
  ]),
  semanticAlts: new Set([
    'looking at the map', 'looking at a map',
    'studying the map', 'studying a map',
    'checking the map', 'checking a map',
  ]),
  incorrectFeedback: 'Good try. Look at what the pirate is doing.',
  hintL1: 'What is the pirate doing with the map?',
  hintL2: 'The pirate is looking at the map very carefully — what do we call that?',
}

export const EX1_WHAT: StepConfig = {
  role: 'WHAT',
  correctCardId: 'map',
  acceptedTyped: new Set([
    'map', 'a map', 'the map',
    'treasure map', 'a treasure map', 'the treasure map',
  ]),
  semanticAlts: new Set(['treasure map', 'a treasure map', 'the treasure map']),
  incorrectFeedback: 'Good try. Look at what the pirate is reading.',
  hintL1: 'It shows places and directions. What is it?',
  hintL2: 'Pirates use it to find treasure — it shows where to go.',
}

// --- Exercise 2: Same pirate/map context — demonstrates semantic alternatives ---
// Validation identical to Exercise 1 but WHO encourages typing

export const EX2_WHO: StepConfig = { ...EX1_WHO }
export const EX2_DOING: StepConfig = {
  ...EX1_DOING,
  incorrectFeedback: 'Good try. Look at what they are doing with the map.',
  hintL1: 'What are they doing with the map?',
}
export const EX2_WHAT: StepConfig = {
  ...EX1_WHAT,
  incorrectFeedback: 'Good try. Look at what they are reading.',
}

// --- Exercise 3: Girl eating a cookie ---

export const EX3_WHO: StepConfig = {
  role: 'WHO',
  correctCardId: 'girl',
  acceptedTyped: new Set(['girl', 'the girl', 'a girl']),
  semanticAlts: new Set([]),
  incorrectFeedback: 'Good try. Who is eating?',
  hintL1: 'Who is eating in the picture?',
  hintL2: 'Look for the character eating the food.',
}

export const EX3_DOING: StepConfig = {
  role: 'DOING',
  correctCardId: 'eating',
  acceptedTyped: new Set([
    'eating', 'is eating',
    'eating a cookie', 'eating a biscuit',
    'having a cookie', 'having a biscuit',
    'munching', 'munching a cookie', 'munching a biscuit',
  ]),
  semanticAlts: new Set([
    'eating a cookie', 'eating a biscuit',
    'having a cookie', 'having a biscuit',
    'munching', 'munching a cookie', 'munching a biscuit',
  ]),
  incorrectFeedback: 'Good try. What is she doing?',
  hintL1: 'Look at what she is doing with the food.',
  hintL2: 'She has something in her hand near her mouth — what is she doing?',
}

export const EX3_WHAT: StepConfig = {
  role: 'WHAT',
  correctCardId: 'cookie',
  acceptedTyped: new Set([
    'cookie', 'a cookie', 'the cookie', 'cookies',
    'biscuit', 'a biscuit', 'the biscuit', 'biscuits',
  ]),
  semanticAlts: new Set(['biscuit', 'a biscuit', 'the biscuit', 'biscuits']), // UK alternative
  incorrectFeedback: 'Good try. Think about something she can eat.',
  hintL1: 'Look at what she is holding near her mouth.',
  hintL2: 'It is round and you can eat it — a sweet snack.',
}
