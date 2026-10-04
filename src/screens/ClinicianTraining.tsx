import { BVClinicianShell } from '../components/BVClinicianShell'

interface Props {
  onOpenColorfulSemantics: () => void
}

const modules = [
  { id: 'verbal', label: 'Verbal Expression', icon: '🔊', isNew: true },
  { id: 'auditory', label: 'Auditory Comprehension', icon: '👂', isNew: true },
  { id: 'written', label: 'Written Expression', icon: '✏️', isNew: true },
  { id: 'reading', label: 'Reading Comprehension', icon: '📖', isNew: true },
  { id: 'semantics', label: 'Semantics', icon: '🔗', isNew: false },
  { id: 'grammar', label: 'Grammar', icon: '🅰', isNew: true },
  { id: 'everyday', label: 'Everyday Skills', icon: '🎯', isNew: true },
]

const tabs = ['Packages', 'Voice', 'Speech', 'Language', 'Cognition', 'Dysphagia', 'Custom']

export function ClinicianTraining({ onOpenColorfulSemantics }: Props) {
  return (
    <BVClinicianShell activeSidebarItem="training">
      <div className="p-6 max-w-6xl">
        <h1 className="text-3xl font-light text-gray-800 mb-5">Health page for Demo Patient</h1>

        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6">
          {/* Search */}
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 mb-4 bg-gray-50">
            <span className="text-gray-400">🔍</span>
            <span className="text-gray-400 text-sm">Search exercises...</span>
          </div>

          {/* Tabs */}
          <div className="flex gap-5 border-b border-gray-200 mb-5 text-sm">
            {tabs.map(tab => (
              <button
                key={tab}
                className={`pb-2.5 font-medium flex items-center gap-1 ${
                  tab === 'Language'
                    ? 'text-gray-800 border-b-2 border-gray-800 -mb-px'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab === 'Voice' && <span className="w-2 h-2 bg-orange-500 rounded-full inline-block ml-0.5"></span>}
                {tab === 'Speech' && <span className="w-2 h-2 bg-orange-500 rounded-full inline-block ml-0.5"></span>}
                {tab === 'Language' && <span className="w-2 h-2 bg-orange-500 rounded-full inline-block ml-0.5"></span>}
                {tab === 'Cognition' && <span className="w-2 h-2 bg-orange-500 rounded-full inline-block ml-0.5"></span>}
                {tab}
              </button>
            ))}
          </div>

          {/* Module grid */}
          <div className="grid grid-cols-4 gap-3">
            {modules.map(mod => (
              <button
                key={mod.id}
                onClick={mod.id === 'semantics' ? onOpenColorfulSemantics : undefined}
                className={`relative flex items-center gap-3 bg-white border rounded-xl p-4 text-left transition-all ${
                  mod.id === 'semantics'
                    ? 'border-[#7c3aed] shadow-md hover:shadow-lg cursor-pointer ring-1 ring-[#7c3aed]/30'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm cursor-pointer'
                }`}
              >
                {mod.isNew && (
                  <span className="absolute top-2 left-2 bg-orange-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    NEW
                  </span>
                )}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 ${
                  mod.id === 'semantics' ? 'bg-[#7c3aed]' : 'bg-amber-400'
                }`}>
                  {mod.icon}
                </div>
                <span className="font-medium text-sm text-gray-800">{mod.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Home Exercises */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Home Exercises</h2>
          <div className="flex border-b border-gray-200 mb-4">
            <button className="pb-2 text-sm font-semibold text-gray-800 border-b-2 border-gray-800 mr-5 -mb-px">
              List
            </button>
            <button className="pb-2 text-sm text-[#7c3aed] hover:text-[#6d28d9]">History</button>
          </div>
          <button className="bg-[#7c3aed] text-white text-sm font-medium px-4 py-2.5 rounded-lg">
            Send list to client
          </button>
          <p className="text-sm text-gray-500 italic mt-4">
            Exercises added for home practice will appear here. Please add some exercises before sending to the client.
          </p>
        </div>

        {/* Hint to user */}
        <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
          <span>💡</span>
          <span>Click the <strong>Semantics</strong> card above to configure the new <strong>Colorful Semantics</strong> module.</span>
        </div>
      </div>
    </BVClinicianShell>
  )
}
