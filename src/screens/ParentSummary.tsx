import { BVChildShell } from '../components/BVChildShell'
import type { SessionResults } from '../types/session'

interface Props {
  sessionResults: SessionResults
  onDone: () => void
}

export function ParentSummary({ sessionResults, onDone }: Props) {
  const { exercises, config } = sessionResults
  const completed = exercises.filter(e => e?.completed)
  const totalHints = completed.reduce((sum, e) =>
    sum + (e ? e.who.hintsUsed + e.doing.hintsUsed + e.what.hintsUsed : 0), 0)
  const semanticAlts = completed.reduce((sum, e) =>
    sum + (e ? [e.who, e.doing, e.what].filter(r => r.isSemanticAlt).length : 0), 0)

  return (
    <BVChildShell>
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-6">
        <div className="max-w-md w-full">
          <div className="text-5xl mb-4 text-center">👋</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-1 text-center">Practice complete</h1>
          <p className="text-gray-500 text-center mb-8">Here is what happened in this session.</p>

          {/* Quick facts */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Activities', value: `${completed.length} / ${config.exerciseCount}` },
              { label: 'Hints used', value: String(totalHints) },
              { label: 'Own words', value: String(semanticAlts) },
            ].map(stat => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
                <div className="text-xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500 mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Sentences */}
          <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">Sentences produced</h2>
            {completed.map((ex) => {
              if (!ex) return null
              return (
                <div key={ex.exerciseNumber} className="flex items-start gap-3 py-2 border-b border-gray-100 last:border-0">
                  <span className="w-5 h-5 bg-[#7c3aed] text-white rounded-full text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {ex.exerciseNumber}
                  </span>
                  <p className="text-sm font-medium text-gray-800">"{ex.sentenceProduced}"</p>
                </div>
              )
            })}
          </div>

          {/* Guidance note */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-sm text-blue-800 flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5">ℹ️</span>
            <span>
              If you have any questions about your child's practice or targets, please speak with their speech and language therapist.
            </span>
          </div>

          <button
            onClick={onDone}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-base py-3.5 rounded-2xl shadow-lg transition-all"
          >
            All done
          </button>
        </div>
      </div>
    </BVChildShell>
  )
}
