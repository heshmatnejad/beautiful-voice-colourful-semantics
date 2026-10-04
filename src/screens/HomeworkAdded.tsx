import { BVClinicianShell } from '../components/BVClinicianShell'

interface Props {
  onStartFromList: () => void
  onBack: () => void
}

export function HomeworkAdded({ onStartFromList, onBack }: Props) {
  return (
    <BVClinicianShell activeSidebarItem="training">
      <div className="p-6 max-w-4xl">
        <h1 className="text-3xl font-light text-gray-800 mb-5">Health page for Demo Patient</h1>

        {/* Toast notification */}
        <div className="mb-5 bg-green-600 text-white rounded-lg px-4 py-3 flex items-start gap-3 shadow-lg max-w-xl">
          <span className="text-xl mt-0.5">✓</span>
          <div>
            <p className="font-semibold text-sm">Assignment added to home training list</p>
            <p className="text-sm opacity-90">Colorful Semantics has been added. Scroll down to send the assignment list.</p>
          </div>
          <button className="ml-auto opacity-70 hover:opacity-100 text-lg leading-none">×</button>
        </div>

        {/* Training categories (dimmed background context) */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 mb-6 opacity-60">
          <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 mb-4 bg-gray-50">
            <span className="text-gray-400">🔍</span>
            <span className="text-gray-400 text-sm">Search exercises...</span>
          </div>
          <p className="text-gray-400 text-sm text-center py-2">(Exercise categories)</p>
        </div>

        {/* Home Exercises panel */}
        <div className="bg-white rounded-lg border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Home Exercises</h2>

          <div className="flex border-b border-gray-200 mb-4">
            <button className="pb-2 text-sm font-semibold text-gray-800 border-b-2 border-gray-800 mr-5 -mb-px">
              List
            </button>
            <button className="pb-2 text-sm text-[#7c3aed]">History</button>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <button className="bg-[#7c3aed] text-white text-sm font-medium px-4 py-2.5 rounded-lg flex items-center gap-2">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              Send list to client
            </button>
            <button className="bg-gray-100 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-gray-200">
              Save list
            </button>
            <button className="bg-red-100 text-red-600 text-sm font-medium px-4 py-2.5 rounded-lg hover:bg-red-200">
              Clear all
            </button>
          </div>

          {/* Assignment table */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left font-semibold text-gray-600 pb-2 pr-4 w-8">#</th>
                <th className="text-left font-semibold text-gray-600 pb-2 pr-4">Name</th>
                <th className="text-left font-semibold text-gray-600 pb-2 pr-4">Key configuration</th>
                <th className="text-left font-semibold text-gray-600 pb-2 pr-10"># Exercises</th>
                <th className="pb-2"></th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 pr-4 text-gray-500">1</td>
                <td className="py-3 pr-4 font-medium text-gray-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                    Colorful Semantics
                    <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-0.5 ml-4">WHO + DOING + WHAT · Child / Paediatric</div>
                </td>
                <td className="py-3 pr-4">
                  <div className="flex gap-1">
                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full">WHO</span>
                    <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-0.5 rounded-full">DOING</span>
                    <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">WHAT</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-gray-700">3</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={onStartFromList}
                      className="bg-[#166534] hover:bg-[#15803d] text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors"
                    >
                      Start
                    </button>
                    <button className="text-gray-400 hover:text-red-500 text-lg leading-none px-1">🗑</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button
          onClick={onBack}
          className="mt-4 text-sm text-[#7c3aed] hover:underline"
        >
          ← Back to Semantics configuration
        </button>
      </div>
    </BVClinicianShell>
  )
}
