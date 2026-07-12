'use client'

import { useActionState } from 'react'
import { createVehicle } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const initialState = {
  error: ''
}

export default function NewVehiclePage() {
  const [state, formAction, isPending] = useActionState(createVehicle, initialState)

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/vehicles" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Add New Vehicle</h1>
          <p className="text-secondary">Register a new vehicle to the fleet.</p>
        </div>
      </div>

      <div className="glass-card">
        <form action={formAction} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="registrationNumber">Registration Number</label>
            <input className="input-field" type="text" id="registrationNumber" name="registrationNumber" placeholder="e.g. VAN-05" required />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="name">Vehicle Model / Name</label>
            <input className="input-field" type="text" id="name" name="name" placeholder="e.g. Ford Transit" required />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="type">Vehicle Type</label>
            <select className="input-field" id="type" name="type" required>
              <option value="">Select Type</option>
              <option value="Van">Van</option>
              <option value="Truck">Truck</option>
              <option value="Car">Car</option>
              <option value="Motorcycle">Motorcycle</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label" htmlFor="maxLoadCapacity">Max Capacity (kg)</label>
              <input className="input-field" type="number" id="maxLoadCapacity" name="maxLoadCapacity" placeholder="500" required min="0" step="0.1" />
            </div>

            <div className="input-group w-full">
              <label className="input-label" htmlFor="acquisitionCost">Acquisition Cost ($)</label>
              <input className="input-field" type="number" id="acquisitionCost" name="acquisitionCost" placeholder="45000" required min="0" step="0.01" />
            </div>
          </div>

          {state?.error && (
            <div className="badge badge-danger w-full justify-center p-2 mb-2" style={{ borderRadius: '8px' }}>
              {state.error}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <Link href="/vehicles" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
