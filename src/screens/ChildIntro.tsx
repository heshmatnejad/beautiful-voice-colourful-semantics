import { BVChildShell } from '../components/BVChildShell'
import type { SessionConfig } from '../types/session'

interface Props {
  sessionConfig: SessionConfig
  onStart: () => void
}

export function ChildIntro({ sessionConfig, onStart }: Props) {
  const count = sessionConfig.exerciseCount
  return (
    <BVChildShell>
      <div className="flex items-center justify-center min-h-[calc(100vh-58px)] p-8 bg-gradient-to-b from-purple-50 to-white">
        <div className="max-w-2xl w-full text-center">

          <h1 className="text-5xl font-black text-gray-800 mb-3">Colorful Semantics</h1>
          <p className="text-2xl text-gray-500 mb-10 font-medium">Let's build some sentences!</p>

          {/* Role colour blocks */}
          <div className="flex justify-center gap-5 mb-10">
            {[
              { role: 'WHO',   bg: 'bg-orange-400', desc: 'Who is it?' },
              { role: 'DOING', bg: 'bg-yellow-400', desc: 'What are they doing?' },
              { role: 'WHAT',  bg: 'bg-green-500',  desc: 'What is it?' },
            ].map(r => (
              <div key={r.role} className="flex flex-col items-center gap-3">
                <div className={`${r.bg} text-white font-black text-2xl px-8 py-4 rounded-2xl shadow-md min-w-[120px]`}>
                  {r.role}
                </div>
                <span className="text-base text-gray-500 font-medium">{r.desc}</span>
              </div>
            ))}
          </div>

          {/* Neutral template — NO answer revealed */}
          <div className="bg-white border-2 border-gray-200 rounded-3xl px-8 py-5 mb-8 shadow-sm inline-flex items-center gap-3">
            <span className="bg-orange-100 text-orange-400 font-bold text-xl px-4 py-2 rounded-xl">WHO?</span>
            <span className="bg-yellow-100 text-yellow-500 font-bold text-xl px-4 py-2 rounded-xl">DOING?</span>
            <span className="bg-green-100 text-green-500 font-bold text-xl px-4 py-2 rounded-xl">WHAT?</span>
          </div>

          <p className="text-gray-600 mb-10 text-xl max-w-md mx-auto leading-relaxed font-medium">
            Look at the picture. Choose a card or type your answer.
          </p>

          {/* Activity count */}
          <div className="flex justify-center gap-4 mb-10">
            {Array.from({ length: count }, (_, i) => i + 1).map(n => (
              <div key={n} className="flex items-center gap-2 bg-gray-100 rounded-full px-5 py-2.5 text-base text-gray-600 font-medium">
                <span className="w-7 h-7 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-sm font-bold">{n}</span>
                Activity {n}
              </div>
            ))}
          </div>

          <button
            onClick={onStart}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-black text-2xl px-20 py-5 rounded-3xl shadow-xl transition-all hover:shadow-2xl hover:scale-[1.02] active:scale-100"
          >
            Start!
          </button>

          <p className="text-sm text-gray-400 mt-5">{count} {count === 1 ? 'activity' : 'activities'} · WHO + DOING + WHAT</p>
        </div>
      </div>
    </BVChildShell>
  )
}
