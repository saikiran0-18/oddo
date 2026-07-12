export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createMaintenanceLog } from '../actions'

export default async function NewMaintenancePage() {
  // Only available vehicles can be put into maintenance
  const vehicles = await prisma.vehicle.findMany({ 
    where: { status: 'Available' } 
  })

  return (
    <div className="animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <div className="flex items-center gap-4 mb-6">
        <Link href="/maintenance" className="btn btn-secondary" style={{ padding: '0.5rem' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1>Record Maintenance</h1>
          <p className="text-secondary">Send a vehicle to the shop for repairs.</p>
        </div>
      </div>

      <div className="glass-card">
        <form action={createMaintenanceLog} className="flex-col gap-4">
          <div className="input-group">
            <label className="input-label" htmlFor="vehicleId">Select Vehicle</label>
            <select className="input-field" id="vehicleId" name="vehicleId" required>
              <option value="">Choose an available vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name}</option>
              ))}
            </select>
            <span className="text-secondary" style={{ fontSize: '0.8rem' }}>
              Note: This will change the vehicle status to "In Shop" and remove it from dispatch.
            </span>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="description">Issue / Maintenance Description</label>
            <input className="input-field" type="text" id="description" name="description" placeholder="e.g. Oil Change and Tire Rotation" required />
          </div>

          <div className="input-group w-full">
            <label className="input-label" htmlFor="cost">Estimated Cost ($)</label>
            <input className="input-field" type="number" id="cost" name="cost" placeholder="150" required min="0" step="0.01" />
          </div>

          <div className="flex justify-end gap-4 mt-4">
            <Link href="/maintenance" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary">Save Record</button>
          </div>
        </form>
      </div>
    </div>
  )
}
