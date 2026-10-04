import { BVLogo } from './BVLogo'

interface Props {
  children: React.ReactNode
}

export function BVChildShell({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-[#f0f0f0]" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <header className="bg-[#1e3a28] flex items-center justify-between px-5 py-3 flex-shrink-0">
        <div className="flex items-center gap-4">
          <BVLogo />
          <span className="text-white font-bold text-base ml-2">Colorful Semantics</span>
        </div>
        <nav className="flex items-center gap-6 text-sm text-white">
          <button className="flex items-center gap-1.5 opacity-80 hover:opacity-100">🏠 Home</button>
          <button className="flex items-center gap-1.5 opacity-80 hover:opacity-100">⚙ Settings</button>
          <button className="flex items-center gap-1.5 opacity-80 hover:opacity-100">? Help</button>
          <span className="text-white/40">|</span>
          <button className="opacity-80 hover:opacity-100">Sign Out</button>
        </nav>
      </header>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
