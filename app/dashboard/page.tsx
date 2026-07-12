export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import { Truck, Route, Wrench, Users, Percent, Activity } from 'lucide-react'
import DashboardFilters from './components/DashboardFilters'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ type?: string, status?: string }> }) {
  const { type, status } = await searchParams;

  const vehicleWhereClause: any = {};
  if (type) vehicleWhereClause.type = type;
  if (status) vehicleWhereClause.status = status;

  const [
    vehicles,
    activeTrips,
    pendingTrips,
    driversOnDuty,
    completedTrips,
    fuelLogs
  ] = await Promise.all([
    prisma.vehicle.findMany({ where: vehicleWhereClause }),
    prisma.trip.count({ where: { status: 'Dispatched' } }),
    prisma.trip.count({ where: { status: 'Draft' } }),
    prisma.driver.count({ where: { status: 'On Trip' } }),
    prisma.trip.findMany({ where: { status: 'Completed' } }),
    prisma.fuelLog.findMany()
  ])

  const nonRetired = vehicles.filter(v => v.status !== 'Retired')
  const onTrip = vehicles.filter(v => v.status === 'On Trip').length
  const inMaintenance = vehicles.filter(v => v.status === 'In Shop').length
  const available = vehicles.filter(v => v.status === 'Available').length

  // Fleet Utilization = vehicles On Trip / total non-retired vehicles × 100
  const fleetUtilization = nonRetired.length > 0
    ? Math.round((onTrip / nonRetired.length) * 100)
    : 0

  // Fuel Efficiency = total actualDistance from completed trips / total fuel liters
  const totalDistance = completedTrips.reduce((sum, t) => sum + (t.actualDistance || 0), 0)
  const totalFuel = fuelLogs.reduce((sum, f) => sum + f.liters, 0)
  const fuelEfficiency = (totalDistance > 0 && totalFuel > 0)
    ? (totalDistance / totalFuel).toFixed(2) + ' km/L'
    : 'N/A'

  const kpis = [
    { label: 'Available Vehicles', value: available, icon: Truck, color: 'var(--success)' },
    { label: 'In Maintenance', value: inMaintenance, icon: Wrench, color: 'var(--danger)' },
    { label: 'Active Trips', value: activeTrips, icon: Route, color: 'var(--accent-primary)' },
    { label: 'Pending Trips', value: pendingTrips, icon: Route, color: 'var(--warning)' },
    { label: 'Drivers On Duty', value: driversOnDuty, icon: Users, color: 'var(--accent-secondary)' },
    { label: 'Fleet Utilization', value: `${fleetUtilization}%`, icon: Percent, color: 'var(--text-primary)' },
    { label: 'Fuel Efficiency', value: fuelEfficiency, icon: Activity, color: 'var(--success)' },
  ]

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Dashboard</h1>
          <p className="text-secondary">Overview of your transport operations.</p>
        </div>
      </div>

      <div className="glass-card mb-6" style={{ padding: '1rem 1.5rem' }}>
        <DashboardFilters initialType={type || ''} initialStatus={status || ''} />
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
