import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function DriversPage() {
  const drivers = await prisma.driver.findMany({
    orderBy: { name: 'asc' }
  })

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Drivers</h1>
          <p className="text-secondary">Manage your transport personnel.</p>
        </div>
        <Link href="/drivers/new" className="btn btn-primary">
          <Plus size={20} />
          Add Driver
        </Link>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Name</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>License No.</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Category</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Contact</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Safety Score</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {drivers.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No drivers found. Add one to get started.
                  </td>
                </tr>
              ) : drivers.map(driver => (
                <tr key={driver.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{driver.name}</td>
                  <td style={{ padding: '1rem' }}>{driver.licenseNumber}</td>
                  <td style={{ padding: '1rem' }}>{driver.licenseCategory}</td>
                  <td style={{ padding: '1rem' }}>{driver.contactNumber}</td>
                  <td style={{ padding: '1rem' }}>{driver.safetyScore}/100</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${
                      driver.status === 'Available' ? 'badge-success' :
                      driver.status === 'On Trip' ? 'badge-warning' :
                      driver.status === 'Off Duty' ? 'badge-neutral' : 'badge-danger'
                    }`}>
                      {driver.status}
                    </span>
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
