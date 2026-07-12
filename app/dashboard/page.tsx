import { prisma } from '@/lib/prisma'
import { Truck, Route, Wrench, Users, Percent } from 'lucide-react'

export default async function DashboardPage() {
  const [
    totalVehicles,
    availableVehicles,
    maintenanceVehicles,
    activeTrips,
    pendingTrips,
    driversOnDuty
  ] = await Promise.all([
    prisma.vehicle.count(),
    prisma.vehicle.count({ where: { status: 'Available' } }),
    prisma.vehicle.count({ where: { status: 'In Shop' } }),
    prisma.trip.count({ where: { status: 'Dispatched' } }),
    prisma.trip.count({ where: { status: 'Draft' } }),
    prisma.driver.count({ where: { status: 'On Trip' } })
  ])

  const fleetUtilization = totalVehicles > 0 
    ? Math.round(((totalVehicles - availableVehicles - maintenanceVehicles) / totalVehicles) * 100) 
    : 0

  const kpis = [
    { label: 'Available Vehicles', value: availableVehicles, icon: Truck, color: 'var(--success)' },
    { label: 'In Maintenance', value: maintenanceVehicles, icon: Wrench, color: 'var(--danger)' },
    { label: 'Active Trips', value: activeTrips, icon: Route, color: 'var(--accent-primary)' },
    { label: 'Pending Trips', value: pendingTrips, icon: Route, color: 'var(--warning)' },
    { label: 'Drivers On Duty', value: driversOnDuty, icon: Users, color: 'var(--accent-secondary)' },
    { label: 'Fleet Utilization', value: `${fleetUtilization}%`, icon: Percent, color: 'var(--text-primary)' },
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary">Overview of your transport operations.</p>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem'
      }}>
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon
          return (
            <div key={idx} className="glass-card flex items-center gap-4">
              <div style={{
                background: `${kpi.color}15`,
                color: kpi.color,
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{kpi.label}</p>
                <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{kpi.value}</h2>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
