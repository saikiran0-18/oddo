'use client'

import { dispatchTrip, completeTrip, cancelTrip } from '../actions'
import { useState } from 'react'
import { Play, Check, X, FileText } from 'lucide-react'

export function TripActions({ tripId, status }: { tripId: string, status: string }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)

  // Complete Trip Form State
  const [odometer, setOdometer] = useState('')
  const [fuelLiters, setFuelLiters] = useState('')
  const [fuelCost, setFuelCost] = useState('')

  const handleDispatch = async () => {
    setIsProcessing(true)
    try {
      await dispatchTrip(tripId)
    } catch (e: any) {
      alert(e.message)
    }
    setIsProcessing(false)
  }

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this trip?')) return
    setIsProcessing(true)
    try {
      await cancelTrip(tripId)
    } catch (e: any) {
      alert(e.message)
    }
    setIsProcessing(false)
  }

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    try {
      await completeTrip(tripId, parseFloat(odometer), parseFloat(fuelLiters), parseFloat(fuelCost))
      setShowCompleteModal(false)
    } catch (e: any) {
      alert(e.message)
    }
    setIsProcessing(false)
  }

  return (
    <>
      <div className="flex gap-2">
        {status === 'Draft' && (
          <button onClick={handleDispatch} disabled={isProcessing} className="btn" style={{ padding: '0.25rem 0.5rem', background: 'var(--accent-primary)', color: 'white' }} title="Dispatch">
            <Play size={16} />
          </button>
        )}
        
        {status === 'Dispatched' && (
          <button onClick={() => setShowCompleteModal(true)} disabled={isProcessing} className="btn" style={{ padding: '0.25rem 0.5rem', background: 'var(--success)', color: 'white' }} title="Complete">
            <Check size={16} />
          </button>
        )}

        {(status === 'Draft' || status === 'Dispatched') && (
          <button onClick={handleCancel} disabled={isProcessing} className="btn" style={{ padding: '0.25rem 0.5rem', background: 'var(--danger)', color: 'white' }} title="Cancel">
            <X size={16} />
          </button>
        )}
      </div>

      {showCompleteModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div className="glass-card animate-fade-in" style={{ width: '400px', background: 'var(--bg-secondary)' }}>
            <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={20} /> Complete Trip
            </h3>
            <form onSubmit={handleComplete} className="flex-col gap-4">
              <div className="input-group">
                <label className="input-label">Distance Traveled (Odometer increase)</label>
                <input type="number" required min="0" step="0.1" className="input-field" value={odometer} onChange={e => setOdometer(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Fuel Consumed (Liters)</label>
                <input type="number" required min="0" step="0.1" className="input-field" value={fuelLiters} onChange={e => setFuelLiters(e.target.value)} />
              </div>
              <div className="input-group">
                <label className="input-label">Fuel Cost ($)</label>
                <input type="number" required min="0" step="0.01" className="input-field" value={fuelCost} onChange={e => setFuelCost(e.target.value)} />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setShowCompleteModal(false)} className="btn btn-secondary">Cancel</button>
                <button type="submit" disabled={isProcessing} className="btn btn-primary">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
