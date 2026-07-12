'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
import { retireVehicle } from '../actions'

export function VehicleActions({ id, status }: { id: string, status: string }) {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleRetire = async () => {
    if (status === 'On Trip' || status === 'In Shop') {
      alert(`Cannot retire a vehicle that is currently ${status}.`)
      return
    }
    
    if (!confirm('Are you sure you want to retire this vehicle? It will no longer be available for dispatch.')) return
    
    setIsProcessing(true)
    try {
      await retireVehicle(id)
    } catch (e: any) {
      alert(e.message)
    }
    setIsProcessing(false)
  }

  return (
    <div className="flex gap-2">
      <Link href={`/vehicles/${id}/edit`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }} title="Edit Vehicle">
        <Edit size={16} />
      </Link>
      <button 
        onClick={handleRetire} 
        disabled={isProcessing || status === 'Retired'} 
        className="btn" 
        style={{ 
          padding: '0.25rem 0.5rem', 
          background: status === 'Retired' ? 'var(--bg-tertiary)' : 'rgba(239, 68, 68, 0.1)', 
          color: status === 'Retired' ? 'var(--text-secondary)' : 'var(--danger)' 
        }} 
        title={status === 'Retired' ? 'Already Retired' : 'Retire Vehicle'}
      >
        <Trash2 size={16} />
      </button>
    </div>
  )
}
