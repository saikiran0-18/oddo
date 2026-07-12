'use client'

import { useActionState } from 'react'
import { updateDriver } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export function EditDriverForm({ driver }: { driver: any }) {
  const updateDriverWithId = updateDriver.bind(null, driver.id)
  const [state, formAction, isPending] = useActionState(updateDriverWithId, { error: '' })

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/drivers" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Edit Driver</h1>
          <p className="text-secondary">Update details for {driver.name}.</p>
        </div>
      </div>

      <div className="glass-card">
        <form action={formAction} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="name">Full Name</label>
            <input className="input-field" type="text" id="name" name="name" defaultValue={driver.name} required />
          </div>

          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label" htmlFor="licenseNumber">License Number</label>
              <input className="input-field" type="text" id="licenseNumber" name="licenseNumber" defaultValue={driver.licenseNumber} required />
            </div>

            <div className="input-group w-full">
              <label className="input-label" htmlFor="licenseCategory">License Category</label>
              <select className="input-field" id="licenseCategory" name="licenseCategory" defaultValue={driver.licenseCategory} required>
                <option value="Commercial">Commercial</option>
                <option value="Heavy">Heavy Duty</option>
                <option value="Standard">Standard</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label" htmlFor="licenseExpiryDate">License Expiry Date</label>
              <input className="input-field" type="date" id="licenseExpiryDate" name="licenseExpiryDate" defaultValue={new Date(driver.licenseExpiryDate).toISOString().split('T')[0]} required />
            </div>

            <div className="input-group w-full">
              <label className="input-label" htmlFor="contactNumber">Contact Number</label>
              <input className="input-field" type="tel" id="contactNumber" name="contactNumber" defaultValue={driver.contactNumber} required />
            </div>
          </div>

          {state?.error && (
            <div className="badge badge-danger w-full justify-center p-2 mb-2" style={{ borderRadius: '8px' }}>
              {state.error}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-4">
            <Link href="/drivers" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={isPending}>
              {isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
