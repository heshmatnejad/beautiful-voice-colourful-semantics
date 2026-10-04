import { useState } from 'react'
import { BVClinicianShell } from '../components/BVClinicianShell'
import { IMG } from '../assets/images'
import type { SupportLevel } from '../types/session'

interface ClinicConfig {
  typedAnswerEnabled: boolean
  supportLevel: SupportLevel
  exerciseCount: number
}

interface Props {
  onAddToHomework: (cfg: ClinicConfig) => void
  onStartTraining: (cfg: ClinicConfig) => void
  onBack: () => void
}

export function ColorfulSemanticsConfig({ onAddToHomework, onStartTraining, onBack }: Props) {
  const [typedEnabled, setTypedEnabled] = useState(true)
  const [supportLevel, setSupportLevel] = useState<SupportLevel>('standard')
  const [exerciseCount, setExerciseCount] = useState(3)

  const config: ClinicConfig = { typedAnswerEnabled: typedEnabled, supportLevel, exerciseCount }

  return (
    <BVClinicianShell activeSidebarItem="training">
      <div className="flex-1 flex flex-col" style={{ minHeight: 'calc(100vh - 112px)' }}>
        <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Semantics</h2>
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Left module nav */}
          <div className="w-56 bg-white border-r border-gray-200 pt-3 flex-shrink-0">
            <div className="px-4 py-2 text-xs text-gray-500 font-medium uppercase tracking-wide mb-1">Modules</div>
            {[
              { id: 'word', label: 'Word category' },
              { id: 'vnest', label: 'Verb Network (VNeST)' },
            ].map(item => (
              <button key={item.id} className="w-full text-left px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                {item.label}
              </button>
            ))}
            <button className="w-full text-left px-4 py-3 text-sm bg-[#7c3aed] text-white font-medium flex items-center justify-between">
              <span>Colorful Semantics</span>
              <span className="bg-white text-[#7c3aed] text-[9px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
            </button>
          </div>

          {/* Right config panel */}
          <div className="flex-1 overflow-auto p-6 pb-20 bg-[#f8f8f8]">
            <div className="text-center mb-6">
              <p className="text-gray-600 text-sm leading-relaxed max-w-xl mx-auto">
                Help children build simple sentences step by step using three semantic roles: <strong>WHO</strong> is doing something, <strong>DOING</strong> the action, and <strong>WHAT</strong> they are doing it with or to.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Left: Settings */}
              <div className="space-y-5">
                {/* Sentence structure */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">Sentence Structure</h3>
                  <div className="space-y-2">
                    {[
                      { role: 'WHO', color: 'bg-orange-100 border-orange-300 text-orange-800', desc: 'The person or character' },
                      { role: 'DOING', color: 'bg-yellow-100 border-yellow-300 text-yellow-800', desc: 'The action being performed' },
                      { role: 'WHAT', color: 'bg-green-100 border-green-300 text-green-800', desc: 'The object involved' },
                    ].map(({ role, color, desc }) => (
                      <div key={role} className={`flex items-center gap-3 rounded-lg border px-3 py-2 ${color}`}>
                        <span className="font-bold text-sm w-14">{role}</span>
                        <span className="text-xs">{desc}</span>
                        <span className="ml-auto text-green-600">✓</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">This version uses WHO + DOING + WHAT only.</p>
                </div>

                {/* Target & support settings (clinical) */}
                <div className="bg-white border border-[#7c3aed]/30 rounded-xl p-4 ring-1 ring-[#7c3aed]/10">
                  <h3 className="font-semibold text-sm text-gray-700 mb-3">Target &amp; support settings</h3>

                  {/* Exercise count */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <label className="text-sm text-gray-700 font-medium">Number of exercises</label>
                      <p className="text-xs text-gray-400 mt-0.5">1–3 exercises per session</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setExerciseCount(c => Math.max(1, c - 1))}
                        className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-sm"
                      >−</button>
                      <span className="w-8 text-center font-bold text-gray-800">{exerciseCount}</span>
                      <button
                        onClick={() => setExerciseCount(c => Math.min(3, c + 1))}
                        className="w-7 h-7 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 font-bold text-sm"
                      >+</button>
                    </div>
                  </div>

                  {/* Typed answer toggle */}
                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                    <div>
                      <label className="text-sm text-gray-700 font-medium">Allow typed answers</label>
                      <p className="text-xs text-gray-400 mt-0.5">Child can type as well as select cards</p>
                    </div>
                    <button
                      onClick={() => setTypedEnabled(v => !v)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${typedEnabled ? 'bg-[#7c3aed]' : 'bg-gray-300'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${typedEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Support level */}
                  <div>
                    <label className="text-sm text-gray-700 font-medium block mb-2">Support level</label>
                    <div className="space-y-2">
                      {([
                        { value: 'minimal', label: 'Minimal', desc: 'No hint button — independent responses only' },
                        { value: 'standard', label: 'Standard', desc: 'Hint button available on request' },
                        { value: 'higher', label: 'Higher', desc: 'Hint shown automatically after first incorrect attempt' },
                      ] as { value: SupportLevel; label: string; desc: string }[]).map(opt => (
                        <label key={opt.value} className={`flex items-start gap-3 rounded-lg border px-3 py-2.5 cursor-pointer transition-colors ${supportLevel === opt.value ? 'bg-[#7c3aed]/5 border-[#7c3aed]/40' : 'bg-gray-50 border-gray-200 hover:border-gray-300'}`}>
                          <input
                            type="radio"
                            name="supportLevel"
                            value={opt.value}
                            checked={supportLevel === opt.value}
                            onChange={() => setSupportLevel(opt.value)}
                            className="mt-0.5 accent-[#7c3aed]"
                          />
                          <div>
                            <span className="text-sm font-medium text-gray-800">{opt.label}</span>
                            <p className="text-xs text-gray-500 mt-0.5">{opt.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* AI validation note */}
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-[#7c3aed] text-white text-xs flex items-center justify-center">✓</span>
                    <h3 className="font-semibold text-sm text-gray-700">Semantic validation — Enabled</h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Typed answers are checked against the SLT-defined target and a set of clinically appropriate alternatives. Only semantically valid responses are accepted. This does not change the target concept selected by the SLT.
                  </p>
                </div>
              </div>

              {/* Right: Preview */}
              <div>
                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                  <div className="bg-amber-500 text-white text-xs font-bold uppercase tracking-widest px-4 py-2.5 text-center">
                    Preview — Child Activity
                  </div>
                  <div className="bg-white p-4 space-y-3">
                    <div className="flex gap-2">
                      {[
                        { label: 'WHO', value: 'WHO?', bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' },
                        { label: 'DOING', value: 'DOING?', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700' },
                        { label: 'WHAT', value: 'WHAT?', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-700' },
                      ].map(slot => (
                        <div key={slot.label} className={`flex-1 ${slot.bg} border ${slot.border} rounded-lg px-2 py-2 text-center`}>
                          <div className={`text-[10px] font-bold uppercase ${slot.text}`}>{slot.label}</div>
                          <div className={`text-xs font-semibold mt-0.5 ${slot.text}`}>{slot.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-gray-50 rounded-lg px-3 py-2.5 text-center">
                      <p className="text-xs text-gray-500 mb-0.5">Child builds the sentence step by step</p>
                      <p className="font-semibold text-gray-400 text-sm italic">... to be revealed</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 mb-2 text-center">WHO — answer cards</p>
                      <div className="grid grid-cols-4 gap-1.5">
                        {[
                          { label: 'Pirate', img: IMG.pirate },
                          { label: 'Girl', img: IMG.girl },
                          { label: 'Monkey', img: IMG.monkey },
                          { label: 'Pig', img: IMG.pig },
                        ].map(card => (
                          <div key={card.label} className="bg-[#f5ede0] border border-orange-200 rounded-lg p-1.5 text-center">
                            <img src={card.img} alt={card.label} className="w-full h-12 object-contain" />
                            <p className="text-[9px] font-semibold text-gray-700 mt-0.5">{card.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-xs text-gray-500 pt-1 border-t border-gray-100">
                      <div className="text-center">
                        <div className="font-medium text-gray-700">{exerciseCount}</div>
                        <div>exercises</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700">{typedEnabled ? 'On' : 'Off'}</div>
                        <div>typed answers</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-700 capitalize">{supportLevel}</div>
                        <div>support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom action bar */}
        <div className="bg-white border-t border-gray-200 px-6 py-3 flex justify-end gap-3 flex-shrink-0">
          <button
            onClick={() => onAddToHomework(config)}
            className="bg-[#166534] hover:bg-[#15803d] text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Add to homework list
          </button>
          <button
            onClick={() => onStartTraining(config)}
            className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium px-5 py-2.5 rounded-lg text-sm transition-colors"
          >
            Start training
          </button>
        </div>
      </div>
    </BVClinicianShell>
  )
}
