export const dynamic = 'force-dynamic';
'use client'

import { useActionState } from 'react'
import { createDriver } from '../actions'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

const initialState = {
  error: ''
}

export default function NewDriverPage() {
  const [state, formAction, isPending] = useActionState(createDriver, initialState)

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/drivers" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Add New Driver</h1>
          <p className="text-secondary">Register a new driver to the platform.</p>
        </div>
      </div>

      <div className="glass-card">
        <form action={formAction} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="name">Full Name</label>
            <input className="input-field" type="text" id="name" name="name" placeholder="John Doe" required />
          </div>

          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label" htmlFor="licenseNumber">License Number</label>
              <input className="input-field" type="text" id="licenseNumber" name="licenseNumber" placeholder="DL-12345" required />
            </div>

            <div className="input-group w-full">
              <label className="input-label" htmlFor="licenseCategory">License Category</label>
              <select className="input-field" id="licenseCategory" name="licenseCategory" required>
                <option value="">Select Category</option>
                <option value="A">A (Motorcycle)</option>
                <option value="B">B (Car/Van)</option>
                <option value="C">C (Truck)</option>
                <option value="D">D (Bus)</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label" htmlFor="licenseExpiryDate">License Expiry Date</label>
              <input className="input-field" type="date" id="licenseExpiryDate" name="licenseExpiryDate" required />
            </div>

            <div className="input-group w-full">
              <label className="input-label" htmlFor="contactNumber">Contact Number</label>
              <input className="input-field" type="text" id="contactNumber" name="contactNumber" placeholder="+1 234 567 890" required />
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
              {isPending ? 'Saving...' : 'Save Driver'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
