import { BVLogo } from './BVLogo'

interface Props {
  activeSidebarItem?: string
  children: React.ReactNode
  onNavigate?: (item: string) => void
  subtitle?: string
}

const sidebarItems = [
  { id: 'training', label: 'Training', icon: '▦' },
  { id: 'assessment', label: 'Assessment', icon: '☑' },
  { id: 'results', label: 'Results', icon: '↑' },
  { id: 'case-notes', label: 'Case Notes', icon: '☰' },
  { id: 'clients-view', label: "Client's View", icon: '◨' },
  { id: 'group-games', label: 'Group Games', icon: '⚂' },
  { id: 'goals', label: 'Goals', icon: '⊕' },
  { id: 'clients-settings', label: "Client's Settings", icon: '⚙' },
]

export function BVClinicianShell({ activeSidebarItem = 'training', children, onNavigate, subtitle }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Top nav */}
      <header className="bg-[#1e3a28] flex items-center justify-between px-5 py-3 flex-shrink-0">
        <BVLogo />
        {subtitle && (
          <span className="text-white font-semibold text-base ml-6">{subtitle}</span>
        )}
        <nav className="flex items-center gap-6 text-sm text-white ml-auto">
          <button className="flex items-center gap-1.5 opacity-80 hover:opacity-100">
            <span className="text-xs">☰</span> Client List
          </button>
          <button className="flex items-center gap-1.5 font-semibold border-b border-white pb-0.5">
            <span className="text-xs">◉</span> Client
          </button>
          <button className="flex items-center gap-1.5 opacity-80 hover:opacity-100">
            <span className="text-xs">⚙</span> Settings
          </button>
          <button className="flex items-center gap-1.5 opacity-80 hover:opacity-100">
            <span className="text-xs">?</span> Help
          </button>
          <button className="flex items-center gap-1.5 opacity-80 hover:opacity-100">
            <span className="text-xs">⎋</span> Sign out
          </button>
        </nav>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-[86px] bg-white border-r border-gray-200 flex flex-col items-center py-2 gap-1 flex-shrink-0">
          {sidebarItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`w-full flex flex-col items-center justify-center py-3 px-1 gap-1 text-center transition-colors cursor-pointer ${
                activeSidebarItem === item.id
                  ? 'bg-[#7c3aed] text-white'
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </button>
          ))}
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#1e3a28] text-white text-xs py-2 px-6 flex justify-between flex-shrink-0">
        <span>© 2026 BeautifulVoice. All rights reserved.</span>
        <div className="flex gap-4 opacity-70">
          <a href="#" className="hover:opacity-100">Company Information</a>
          <a href="#" className="hover:opacity-100">Terms of Use</a>
          <a href="#" className="hover:opacity-100">Privacy Policy</a>
          <a href="#" className="hover:opacity-100">Platform Info & Manual</a>
        </div>
      </footer>
    </div>
  )
}
