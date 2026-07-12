export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { VehicleActions } from './components/VehicleActions'

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { registrationNumber: 'asc' }
  })

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Vehicles</h1>
          <p className="text-secondary">Manage your transport fleet.</p>
        </div>
        <Link href="/vehicles/new" className="btn btn-primary">
          <Plus size={20} />
          Add Vehicle
        </Link>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Reg. Number</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Model</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Type</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Capacity (kg)</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No vehicles found. Add one to get started.
                  </td>
                </tr>
              ) : vehicles.map(vehicle => (
                <tr key={vehicle.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{vehicle.registrationNumber}</td>
                  <td style={{ padding: '1rem' }}>{vehicle.name}</td>
                  <td style={{ padding: '1rem' }}>{vehicle.type}</td>
                  <td style={{ padding: '1rem' }}>{vehicle.maxLoadCapacity}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${
                      vehicle.status === 'Available' ? 'badge-success' :
                      vehicle.status === 'In Shop' ? 'badge-warning' :
                      vehicle.status === 'Retired' ? 'badge-neutral' : 'badge-danger'
                    }`}>
                      {vehicle.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <VehicleActions id={vehicle.id} status={vehicle.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
