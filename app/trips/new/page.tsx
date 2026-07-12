export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createTrip } from '../actions'

export default async function NewTripPage() {
  const [vehicles, drivers] = await Promise.all([
    prisma.vehicle.findMany({ where: { status: 'Available' } }),
    prisma.driver.findMany({ where: { status: 'Available' } })
  ])

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
        <form action={createTrip} className="flex-col gap-4">
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

          <div className="flex gap-4">
            <div className="input-group w-full">
              <label className="input-label" htmlFor="cargoWeight">Cargo Weight (kg)</label>
              <input className="input-field" type="number" id="cargoWeight" name="cargoWeight" placeholder="450" required min="0" step="0.1" />
            </div>

            <div className="input-group w-full">
              <label className="input-label" htmlFor="plannedDistance">Planned Distance (km)</label>
              <input className="input-field" type="number" id="plannedDistance" name="plannedDistance" placeholder="120" required min="0" step="0.1" />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="vehicleId">Assign Vehicle</label>
            <select className="input-field" id="vehicleId" name="vehicleId" required>
              <option value="">Select Available Vehicle</option>
              {vehicles.map(v => (
                <option key={v.id} value={v.id}>{v.registrationNumber} - {v.name} (Max {v.maxLoadCapacity}kg)</option>
              ))}
            </select>
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
            <button type="submit" className="btn btn-primary">Save Draft Trip</button>
          </div>
        </form>
      </div>
    </div>
  )
}
