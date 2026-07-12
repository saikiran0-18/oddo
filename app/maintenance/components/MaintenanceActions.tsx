'use client'

import { closeMaintenanceLog } from '../actions'
import { useState } from 'react'
import { Check } from 'lucide-react'

export function MaintenanceActions({ logId, status }: { logId: string, status: string }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClose = async () => {
    if (!confirm('Mark maintenance as closed and restore vehicle to Available?')) return
    setIsProcessing(true)
    try {
      await closeMaintenanceLog(logId)
    } catch (e: any) {
      alert(e.message)
    }
    setIsProcessing(false)
  }

  if (status !== 'Active') return null

  return (
    <button onClick={handleClose} disabled={isProcessing} className="btn" style={{ padding: '0.25rem 0.5rem', background: 'var(--success)', color: 'white' }} title="Close Maintenance">
      <Check size={16} />
    </button>
  )
}
