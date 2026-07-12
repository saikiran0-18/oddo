'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, UserX } from 'lucide-react'
import { suspendDriver } from '../actions'

export function DriverActions({ id, status }: { id: string, status: string }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSuspend = async () => {
    if (status === 'On Trip') {
      alert(`Cannot suspend a driver who is currently On Trip.`)
      return
    }
    
    if (!confirm('Are you sure you want to suspend this driver? They will not be able to be assigned to new trips.')) return
    
    setIsProcessing(true)
    try {
      await suspendDriver(id)
    } catch (e: any) {
      alert(e.message)
    }
    setIsProcessing(false)
  }

  return (
    <div className="flex gap-2">
      <Link href={`/drivers/${id}/edit`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} title="Edit Driver">
        <Edit size={16} />
      </Link>
      <button 
        onClick={handleSuspend} 
        disabled={isProcessing || status === 'Suspended'} 
        className="btn" 
        style={{ 
          padding: '0.25rem 0.5rem', 
          background: status === 'Suspended' ? 'var(--bg-tertiary)' : 'rgba(239, 68, 68, 0.1)', 
          color: status === 'Suspended' ? 'var(--text-secondary)' : 'var(--danger)' 
        }} 
        title={status === 'Suspended' ? 'Already Suspended' : 'Suspend Driver'}
      >
        <UserX size={16} />
      </button>
    </div>
  )
}
