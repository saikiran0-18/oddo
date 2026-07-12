export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { MaintenanceActions } from './components/MaintenanceActions'

export default async function MaintenancePage() {
  const logs = await prisma.maintenanceLog.findMany({
    include: {
      vehicle: true
    },
    orderBy: { date: 'desc' }
  })

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Maintenance</h1>
          <p className="text-secondary">Track vehicle maintenance and repairs.</p>
        </div>
        <Link href="/maintenance/new" className="btn btn-primary">
          <Plus size={20} />
          Record Maintenance
        </Link>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Vehicle</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Cost ($)</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Status</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No maintenance records found.
                  </td>
                </tr>
              ) : logs.map(log => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(log.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>{log.vehicle.registrationNumber}</td>
                  <td style={{ padding: '1rem' }}>{log.description}</td>
                  <td style={{ padding: '1rem' }}>${log.cost.toFixed(2)}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge ${
                      log.status === 'Active' ? 'badge-warning' : 'badge-success'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <MaintenanceActions logId={log.id} status={log.status} />
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
