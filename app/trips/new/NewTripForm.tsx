'use client'

import { useActionState, useState, useEffect } from 'react'
import { createTrip } from '../actions'
import Link from 'next/link'
import { ArrowLeft, AlertTriangle } from 'lucide-react'

interface Vehicle {
  id: string
  registrationNumber: string
  name: string
  maxLoadCapacity: number
}

interface Driver {
  id: string
  name: string
  licenseCategory: string
}

const initialState = { error: '' }

export default function NewTripForm({ vehicles, drivers }: { vehicles: Vehicle[], drivers: Driver[] }) {
  const [state, formAction, isPending] = useActionState(createTrip, initialState)
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [cargoWeight, setCargoWeight] = useState('')
  const [capacityWarning, setCapacityWarning] = useState('')

  const selectedVehicle = vehicles.find(v => v.id === selectedVehicleId)
  const maxCapacity = selectedVehicle?.maxLoadCapacity || 0

  useEffect(() => {
    if (selectedVehicle && cargoWeight) {
      const weight = parseFloat(cargoWeight)
      if (weight > selectedVehicle.maxLoadCapacity) {
        setCapacityWarning(`Exceeds capacity! Max: ${selectedVehicle.maxLoadCapacity}kg`)
      } else {
        setCapacityWarning('')
      }
    } else {
      setCapacityWarning('')
    }
  }, [selectedVehicleId, cargoWeight, selectedVehicle])

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/trips" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Create Trip</h1>
          <p className="text-secondary">Plan a new delivery.</p>
        </div>
      </div>

      <div className="glass-card">
        {state?.error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--danger)',
            borderRadius: '8px',
            padding: '0.75rem 1rem',
            marginBottom: '1rem',
            color: 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <AlertTriangle size={18} />
            {state.error}
          </div>
        )}

        <form action={formAction} className="flex-col gap-4">
          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label" htmlFor="source">Source Location</label>
              <input className="input-field" type="text" id="source" name="source" placeholder="Warehouse A" required />
            </div>

            <div className="input-group w-full">
              <label className="input-label" htmlFor="destination">Destination</label>
              <input className="input-field" type="text" id="destination" name="destination" placeholder="Store B" required />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="vehicleId">Assign Vehicle</label>
            <select 
              className="input-field" 
              id="vehicleId" 
              name="vehicleId" 
              required
              value={selectedVehicleId}
              onChange={e => setSelectedVehicleId(e.target.value)}
            >
              <option value="">Select Available Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name} (Max {v.maxLoadCapacity}kg)</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label" htmlFor="cargoWeight">
                Cargo Weight (kg)
                {selectedVehicle && <span style={{ color: 'var(--text-secondary)', fontWeight: 400 }}> — Max: {selectedVehicle.maxLoadCapacity}kg</span>}
              </label>
              <input 
                className="input-field" 
                type="number" 
                id="cargoWeight" 
                name="cargoWeight" 
                placeholder="450" 
                required 
                min="0.1" 
                max={maxCapacity || undefined}
                step="0.1"
                value={cargoWeight}
                onChange={e => setCargoWeight(e.target.value)}
                style={capacityWarning ? { borderColor: 'var(--danger)' } : {}}
              />
              {capacityWarning && (
                <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <AlertTriangle size={14} /> {capacityWarning}
                </p>
              )}
            </div>

            <div className="input-group w-full">
              <label className="input-label" htmlFor="plannedDistance">Planned Distance (km)</label>
              <input className="input-field" type="number" id="plannedDistance" name="plannedDistance" placeholder="120" required min="0.1" step="0.1" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="driverId">Assign Driver</label>
            <select className="input-field" id="driverId" name="driverId" required>
              <option value="">Select Available Driver</option>
              {drivers.map(d => (
                <option key={d.id} value={d.id}>{d.name} ({d.licenseCategory})</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Link href="/trips" className="btn btn-secondary">Cancel</Link>
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isPending || !!capacityWarning}
            >
              {isPending ? 'Saving...' : 'Save Draft Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
