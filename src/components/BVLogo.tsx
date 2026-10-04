export function BVLogo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width="32" height="32" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="18" stroke="#4ade80" strokeWidth="2.5" fill="none" />
        <path
          d="M20 8 C20 8, 28 12, 28 20 C28 28, 20 32, 20 32"
          stroke="#4ade80" strokeWidth="2.5" fill="none" strokeLinecap="round"
        />
        <path
          d="M20 8 C20 8, 12 12, 12 20 C12 28, 20 32, 20 32"
          stroke="#22c55e" strokeWidth="2" fill="none" strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="3" fill="#4ade80" />
      </svg>
      <span className="text-white font-normal text-lg tracking-tight">
        Beautiful<span className="font-bold">Voice</span>
      </span>
    </div>
  )
}
