export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function ExpensesPage() {
  const [fuelLogs, maintenanceLogs, otherExpenses] = await Promise.all([
    prisma.fuelLog.findMany({ include: { vehicle: true }, orderBy: { date: 'desc' } }),
    prisma.maintenanceLog.findMany({ include: { vehicle: true }, orderBy: { date: 'desc' } }),
    prisma.expense.findMany({ orderBy: { date: 'desc' } })
  ])

  // Combine into a single feed
  const allExpenses = [
    ...fuelLogs.map(f => ({ id: `fuel-${f.id}`, date: f.date, type: 'Fuel', description: `Fuel (${f.liters}L) - ${f.vehicle.registrationNumber}`, cost: f.cost })),
    ...maintenanceLogs.map(m => ({ id: `maint-${m.id}`, date: m.date, type: 'Maintenance', description: `Maintenance: ${m.description} - ${m.vehicle.registrationNumber}`, cost: m.cost })),
    ...otherExpenses.map(e => ({ id: `exp-${e.id}`, date: e.date, type: e.category, description: e.description, cost: e.amount }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime())

  const totalExpenses = allExpenses.reduce((sum, e) => sum + e.cost, 0)

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Expenses & Fuel</h1>
          <p className="text-secondary">Track operational costs and fuel consumption.</p>
        </div>
        <Link href="/expenses/new" className="btn btn-primary">
          <Plus size={20} />
          Add Expense
        </Link>
      </div>

      <div className="glass-card mb-6 flex justify-between items-center p-6">
        <div>
          <p className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>Total Operational Cost</p>
          <h2 style={{ fontSize: '2rem', color: 'var(--danger)', margin: 0 }}>₹{totalExpenses.toFixed(2)}</h2>
        </div>
      </div>

      <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Date</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Type</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Description</th>
                <th style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Cost (₹)</th>
              </tr>
            </thead>
            <tbody>
              {allExpenses.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No expenses found.
                  </td>
                </tr>
              ) : allExpenses.map(exp => (
                <tr key={exp.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '1rem' }}>{new Date(exp.date).toLocaleDateString()}</td>
                  <td style={{ padding: '1rem' }}>
                    <span className={`badge badge-neutral`}>{exp.type}</span>
                  </td>
                  <td style={{ padding: '1rem' }}>{exp.description}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>₹{exp.cost.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
