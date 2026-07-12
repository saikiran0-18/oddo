'use client'

import { useActionState } from 'react'
import { updateVehicle } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { VehicleDocumentUpload } from '../../../../components/VehicleDocumentUpload'

export function EditVehicleForm({ vehicle }: { vehicle: any }) {
  const updateVehicleWithId = updateVehicle.bind(null, vehicle.id)
  const [state, formAction, isPending] = useActionState(updateVehicleWithId, { error: '' })

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/vehicles" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Edit Vehicle</h1>
          <p className="text-secondary">Update details for {vehicle.registrationNumber}.</p>
        </div>
      </div>

      <div className="glass-card">
        <form action={formAction} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="registrationNumber">Registration Number</label>
            <input className="input-field" type="text" id="registrationNumber" name="registrationNumber" defaultValue={vehicle.registrationNumber} required />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="name">Vehicle Model / Name</label>
            <input className="input-field" type="text" id="name" name="name" defaultValue={vehicle.name} required />
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="type">Vehicle Type</label>
            <select className="input-field" id="type" name="type" defaultValue={vehicle.type} required>
              <option value="Van">Van</option>
              <option value="Light Truck">Light Truck</option>
              <option value="Heavy Truck">Heavy Truck</option>
              <option value="Refrigerated Truck">Refrigerated Truck</option>
            </select>
          </div>

          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label" htmlFor="maxLoadCapacity">Max Capacity (kg)</label>
              <input className="input-field" type="number" id="maxLoadCapacity" name="maxLoadCapacity" defaultValue={vehicle.maxLoadCapacity} required min="0" step="0.1" />
            </div>

            <div className="input-group w-full">
              <label className="input-label" htmlFor="acquisitionCost">Acquisition Cost (₹)</label>
              <input className="input-field" type="number" id="acquisitionCost" name="acquisitionCost" defaultValue={vehicle.acquisitionCost} required min="0" step="0.01" />
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
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      <VehicleDocumentUpload vehicleId={vehicle.id} existingDocuments={vehicle.documents} />
    </div>
  )
}
