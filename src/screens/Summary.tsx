import { BVClinicianShell } from '../components/BVClinicianShell'
import type { SessionResults, ExerciseResult, RoleData } from '../types/session'

interface Props {
  sessionResults: SessionResults
  onDone: () => void
}

function responseLabel(r: RoleData): string {
  if (r.responseMode === 'card') return 'Card'
  if (r.responseMode === 'typed' && r.isSemanticAlt) return 'Typed (semantic alt)'
  if (r.responseMode === 'typed') return 'Typed'
  return '—'
}

function outcomeLabel(ex: ExerciseResult): { text: string; color: string } {
  const roles = [ex.who, ex.doing, ex.what]
  const anyHint = roles.some(r => r.hintsUsed > 0)
  const anyRetry = roles.some(r => r.retrySucceeded)
  const anyAlt = roles.some(r => r.isSemanticAlt)
  const allIndependent = roles.every(r => r.wasIndependent)

  if (allIndependent) return { text: 'Independent', color: 'bg-green-100 text-green-700' }
  if (anyAlt) return { text: 'Semantic alt', color: 'bg-purple-100 text-purple-700' }
  if (anyHint && anyRetry) return { text: 'Hint + retry', color: 'bg-amber-100 text-amber-700' }
  if (anyHint) return { text: 'Hint used', color: 'bg-amber-100 text-amber-700' }
  if (anyRetry) return { text: 'Retry success', color: 'bg-blue-100 text-blue-700' }
  return { text: 'Completed', color: 'bg-gray-100 text-gray-600' }
}

export function Summary({ sessionResults, onDone }: Props) {
  const { config, exercises, sessionStart, sessionEnd } = sessionResults
  const completed = exercises.filter((e): e is ExerciseResult => e?.completed === true)
  const total = config.exerciseCount

  // Metrics
  const activitiesCompleted = completed.length
  const allRoles = completed.flatMap(e => [e.who, e.doing, e.what])
  const firstAttemptCorrect = allRoles.filter(r => r.totalAttempts === 1 && r.incorrectAttempts === 0).length
  const totalRoles = allRoles.length
  const firstAttemptPct = totalRoles > 0 ? Math.round((firstAttemptCorrect / totalRoles) * 100) : 0
  const independentResponses = completed.filter(e => [e.who, e.doing, e.what].every(r => r.wasIndependent)).length
  const semanticAlts = allRoles.filter(r => r.isSemanticAlt).length
  const hintsUsed = allRoles.reduce((s, r) => s + r.hintsUsed, 0)
  const retrySuccesses = allRoles.filter(r => r.retrySucceeded).length

  const metrics = [
    { icon: '✅', label: `Activities completed`, value: `${activitiesCompleted} / ${total}` },
    { icon: '🎯', label: 'First-attempt accuracy', value: `${firstAttemptPct}%` },
    { icon: '🃏', label: 'Independent exercises', value: String(independentResponses) },
    { icon: '✨', label: 'Semantic alternatives', value: String(semanticAlts) },
    { icon: '💡', label: 'Hints used', value: String(hintsUsed) },
    { icon: '🔄', label: 'Retry successes', value: String(retrySuccesses) },
  ]

  // Factual observations (generated from data, no clinical interpretation)
  const observations: string[] = []
  if (activitiesCompleted === total) {
    observations.push(`Child completed all ${total} ${total === 1 ? 'activity' : 'activities'} in the session.`)
  } else {
    observations.push(`Child completed ${activitiesCompleted} of ${total} activities.`)
  }
  if (semanticAlts > 0) {
    const alts = completed.flatMap(e => [e.who, e.doing, e.what]).filter(r => r.isSemanticAlt)
    const altWords = alts.map(r => `"${r.acceptedResponse}"`).join(', ')
    observations.push(`Semantic alternative(s) accepted for typed input: ${altWords}.`)
  }
  if (hintsUsed > 0) {
    observations.push(`${hintsUsed} hint(s) were used across the session.`)
  }
  if (retrySuccesses > 0) {
    observations.push(`${retrySuccesses} response(s) were corrected successfully after an initial incorrect attempt.`)
  }
  if (firstAttemptPct === 100 && totalRoles > 0) {
    observations.push('All responses were correct on the first attempt.')
  }

  // Duration
  const durationMs = sessionEnd ? sessionEnd.getTime() - sessionStart.getTime() : null
  const durationMin = durationMs ? Math.round(durationMs / 60000) : null

  return (
    <BVClinicianShell activeSidebarItem="results" subtitle="Session Summary">
      <div className="p-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Session Summary</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Colorful Semantics · Demo Patient ·{' '}
              {sessionStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              {durationMin !== null && ` · ${durationMin} min`}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Support level: <span className="capitalize font-medium text-gray-600">{config.supportLevel}</span>
              {' · '}Typed answers: <span className="font-medium text-gray-600">{config.typedAnswerEnabled ? 'Enabled' : 'Disabled'}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2.5 py-1 rounded-full">WHO</span>
            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">DOING</span>
            <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">WHAT</span>
          </div>
        </div>

        {/* Metrics row */}
        <div className="grid grid-cols-6 gap-3 mb-6">
          {metrics.map(m => (
            <div key={m.label} className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
              <div className="text-xl mb-1">{m.icon}</div>
              <div className="text-lg font-bold text-gray-800">{m.value}</div>
              <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Detailed breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm mb-5">
          <div className="bg-[#1e3a28] text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5">
            Detailed results breakdown
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs">
                <th className="text-left font-semibold text-gray-600 px-4 py-3">#</th>
                <th className="text-left font-semibold text-gray-600 px-4 py-3">Sentence produced</th>
                <th className="text-left font-semibold text-gray-600 px-4 py-3">WHO</th>
                <th className="text-left font-semibold text-gray-600 px-4 py-3">DOING</th>
                <th className="text-left font-semibold text-gray-600 px-4 py-3">WHAT</th>
                <th className="text-left font-semibold text-gray-600 px-4 py-3">Hints</th>
                <th className="text-left font-semibold text-gray-600 px-4 py-3">Outcome</th>
              </tr>
            </thead>
            <tbody>
              {completed.map(ex => {
                const badge = outcomeLabel(ex)
                return (
                  <tr key={ex.exerciseNumber} className="border-b border-gray-100 last:border-0">
                    <td className="px-4 py-3 font-bold text-gray-400 text-sm">{ex.exerciseNumber}</td>
                    <td className="px-4 py-3 text-gray-800 text-xs font-medium max-w-[180px]">
                      "{ex.sentenceProduced}"
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{responseLabel(ex.who)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{responseLabel(ex.doing)}</td>
                    <td className="px-4 py-3 text-xs text-gray-500">{responseLabel(ex.what)}</td>
                    <td className="px-4 py-3 text-xs">
                      {[ex.who, ex.doing, ex.what].reduce((s, r) => s + r.hintsUsed, 0) > 0
                        ? <span className="text-amber-600 font-medium">{[ex.who, ex.doing, ex.what].reduce((s, r) => s + r.hintsUsed, 0)}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                        {badge.text}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Session observations */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 shadow-sm">
          <h3 className="font-semibold text-sm text-gray-800 mb-2">Session observations</h3>
          <ul className="space-y-1.5">
            {observations.map((obs, i) => (
              <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="text-gray-400 flex-shrink-0 mt-0.5">·</span>
                <span>{obs}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-400 mt-3 italic">
            Observations are factual records of this session only. Clinical interpretation is the responsibility of the SLT.
          </p>
        </div>

        {/* Next steps */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5 shadow-sm">
          <h3 className="font-semibold text-sm text-gray-800 mb-1">Next steps</h3>
          <p className="text-xs text-gray-500 mb-3">Select any actions relevant to this session. No options are pre-selected.</p>
          <div className="space-y-2">
            {[
              'Continue current practice at the next session',
              'Adjust target or support settings before the next session',
              'Introduce a new picture for the same semantic structure',
              'Pause or end this practice period',
              'Discharge or transition to a different clinical plan',
              'Add clinician notes to client file',
              'Share appropriate session information with parent / carer',
            ].map(option => (
              <label key={option} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 accent-[#7c3aed]" />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Longitudinal metrics placeholder */}
        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 mb-6 text-center">
          <p className="text-sm text-gray-500 font-medium">📊 Longitudinal progress metrics</p>
          <p className="text-xs text-gray-400 mt-1">Requires multiple sessions with this module. Data will appear here once more sessions are recorded.</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDone}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium px-6 py-2.5 rounded-lg text-sm"
          >
            Return to health page
          </button>
          <button className="border border-gray-300 text-gray-600 hover:bg-gray-50 font-medium px-6 py-2.5 rounded-lg text-sm">
            Export / Print
          </button>
        </div>
      </div>
    </BVClinicianShell>
  )
}
