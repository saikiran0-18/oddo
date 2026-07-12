'use client'

export default function PrintButton() {
  return (
    <button 
      className="btn btn-secondary" 
      onClick={() => window.print()} 
      style={{ background: 'var(--bg-tertiary)' }}
    >
      Export PDF
    </button>
  )
}
