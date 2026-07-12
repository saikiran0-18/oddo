'use client'

import { dispatchTrip, completeTrip, cancelTrip } from '../actions'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Play, Check, X, FileText } from 'lucide-react'

export function TripActions({ tripId, status }: { tripId: string, status: string }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Complete Trip Form State
  const [distance, setDistance] = useState('')
  const [fuelLiters, setFuelLiters] = useState('')
  const [fuelCost, setFuelCost] = useState('')

  useEffect(() => { setMounted(true) }, [])

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
      await completeTrip(tripId, parseFloat(distance), parseFloat(fuelLiters), parseFloat(fuelCost))
      setShowCompleteModal(false)
    } catch (e: any) {
      alert(e.message)
    }
    setIsProcessing(false)
  }

  const modal = showCompleteModal && mounted ? createPortal(
    <div 
      style={{
        position: 'fixed', 
        top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '1rem'
      }}
      onClick={() => setShowCompleteModal(false)}
    >
      <div 
        className="glass-card animate-fade-in" 
        style={{ 
          width: '100%',
          maxWidth: '440px', 
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
        }}
        onClick={e => e.stopPropagation()}
      >
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={20} /> Complete Trip
        </h3>
        <form onSubmit={handleComplete}>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Distance Traveled (km)</label>
            <input 
              type="number" required min="0.1" step="0.1" 
              className="input-field" 
              placeholder="e.g. 120"
              value={distance} 
              onChange={e => setDistance(e.target.value)} 
            />
          </div>
          <div className="input-group" style={{ marginBottom: '1rem' }}>
            <label className="input-label">Fuel Consumed (Liters)</label>
            <input 
              type="number" required min="0.1" step="0.1" 
              className="input-field" 
              placeholder="e.g. 15"
              value={fuelLiters} 
              onChange={e => setFuelLiters(e.target.value)} 
            />
          </div>
          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label">Fuel Cost (₹)</label>
            <input 
              type="number" required min="0.01" step="0.01" 
              className="input-field" 
              placeholder="e.g. 45.00"
              value={fuelCost} 
              onChange={e => setFuelCost(e.target.value)} 
            />
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowCompleteModal(false)} className="btn btn-secondary">Cancel</button>
            <button type="submit" disabled={isProcessing} className="btn btn-primary">
              {isProcessing ? 'Saving...' : 'Confirm Completion'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  ) : null

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

      {modal}
    </>
  )
}
