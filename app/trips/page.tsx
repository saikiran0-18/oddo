export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { TripActions } from './components/TripActions'

export default async function TripsPage() {
  const trips = await prisma.trip.findMany({
    include: {
      vehicle: true,
      driver: true
    },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Trips</h1>
          <p className="text-secondary">Dispatch and monitor active deliveries.</p>
        </div>
        <Link href="/trips/new" className="btn btn-primary">
          <Plus size={20} />
          Create Trip
        </Link>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Route</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Vehicle</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Driver</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Cargo</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trips.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No trips found. Create one to dispatch vehicles.
                  </td>
                </tr>
              ) : trips.map(trip => (
                <tr key={trip.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: 500 }}>{trip.source} &rarr; {trip.destination}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{trip.plannedDistance} km</div>
                  </td>
                  <td style={{ padding: '1rem' }}>{trip.vehicle.registrationNumber}</td>
                  <td style={{ padding: '1rem' }}>{trip.driver.name}</td>
                  <td style={{ padding: '1rem' }}>{trip.cargoWeight} kg</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${
                      trip.status === 'Completed' ? 'badge-success' :
                      trip.status === 'Dispatched' ? 'badge-warning' :
                      trip.status === 'Cancelled' ? 'badge-neutral' : 'badge-neutral'
                    }`} style={trip.status === 'Draft' ? { background: 'var(--border-color)', color: 'var(--text-primary)' } : {}}>
                      {trip.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <TripActions tripId={trip.id} status={trip.status} />
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
