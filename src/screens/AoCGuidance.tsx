import { BVChildShell } from '../components/BVChildShell'

interface Props {
  onStart: () => void
}

export function AoCGuidance({ onStart }: Props) {
  return (
    <BVChildShell>
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)] p-6">
        <div className="max-w-lg w-full">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Before you start</h1>
          <p className="text-gray-500 mb-6 text-base">A few tips to help your child get the most from this practice.</p>

          <div className="space-y-3 mb-8">
            {[
              'Find a quiet place with no distractions.',
              'Sit with your child so you can both see the screen.',
              'Let your child make their own choices — you can encourage but try not to give the answer.',
            ].map((tip, i) => (
              <div key={i} className="flex items-start gap-3 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                <span className="w-7 h-7 bg-[#7c3aed] text-white text-sm font-bold rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-gray-700 text-sm leading-relaxed pt-0.5">{tip}</p>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-8 text-sm text-blue-800 flex items-start gap-2">
            <span className="flex-shrink-0 mt-0.5">ℹ️</span>
            <span>This practice follows targets selected by your child's speech and language therapist.</span>
          </div>

          <button
            onClick={onStart}
            className="w-full bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all hover:shadow-xl"
          >
            Start practice
          </button>
        </div>
      </div>
    </BVChildShell>
  )
}
