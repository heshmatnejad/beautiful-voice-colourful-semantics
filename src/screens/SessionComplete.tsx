import { BVChildShell } from '../components/BVChildShell'
import type { SessionResults } from '../types/session'

interface Props {
  sessionResults: SessionResults
  onShowParentSummary: () => void
  onSeeSummary: () => void
  onFinish: () => void
}

export function SessionComplete({ sessionResults, onShowParentSummary, onSeeSummary, onFinish }: Props) {
  const { config, exercises } = sessionResults
  const isHome = config.launchContext === 'home'
  const showDetails = config.showResultsToChild
  const completed = exercises.filter(e => e?.completed)
  const semanticAlts = completed.reduce((sum, e) =>
    sum + (e ? [e.who, e.doing, e.what].filter(r => r.isSemanticAlt).length : 0), 0)

  return (
    <BVChildShell>
      <div className="flex items-center justify-center min-h-[calc(100vh-58px)] p-6 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-xl w-full text-center">

          {/* Big star with animation */}
          <div className="text-9xl mb-4 animate-star-pop leading-none">🌟</div>

          <h1 className="text-5xl font-black text-gray-800 mb-3">You finished!</h1>
          <p className="text-2xl text-gray-500 mb-10 font-medium">Great job building sentences!</p>

          {/* Simple achievement */}
          <div className="bg-white border-2 border-purple-100 rounded-3xl p-6 mb-8 shadow-sm">
            <p className="text-2xl font-bold text-[#7c3aed] mb-1">
              You completed {completed.length} {completed.length === 1 ? 'activity' : 'activities'}.
            </p>
            {showDetails && semanticAlts > 0 && (
              <p className="text-lg text-purple-500 mt-2">
                ✨ You used your own words — amazing!
              </p>
            )}
          </div>

          {/* Sentence recap — simple, large */}
          {showDetails && <div className="bg-white border border-gray-200 rounded-3xl p-6 mb-10 shadow-sm text-left">
            <h2 className="font-bold text-gray-500 text-sm uppercase tracking-widest mb-4 text-center">Your sentences</h2>
            <div className="space-y-4">
              {completed.map(ex => {
                if (!ex) return null
                return (
                  <div key={ex.exerciseNumber} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
                    <span className="w-8 h-8 bg-[#7c3aed] text-white rounded-full text-base flex items-center justify-center flex-shrink-0 font-bold mt-0.5">
                      {ex.exerciseNumber}
                    </span>
                    <p className="text-xl font-semibold text-gray-800">"{ex.sentenceProduced}"</p>
                  </div>
                )
              })}
            </div>
          </div>}

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            {isHome ? (
              <>
                {showDetails && <button
                  onClick={onShowParentSummary}
                  className="border-2 border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white font-bold px-8 py-4 rounded-2xl transition-colors text-lg"
                >
                  Show grown-up
                </button>}
                <button
                  onClick={onFinish}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-8 py-4 rounded-2xl transition-colors text-lg shadow-md"
                >
                  All done! ✓
                </button>
              </>
            ) : (
              <>
                {showDetails && <button
                  onClick={onSeeSummary}
                  className="border-2 border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed] hover:text-white font-bold px-8 py-4 rounded-2xl transition-colors text-lg"
                >
                  See session summary
                </button>}
                <button
                  onClick={onFinish}
                  className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold px-8 py-4 rounded-2xl transition-colors text-lg shadow-md"
                >
                  Done ✓
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </BVChildShell>
  )
}
