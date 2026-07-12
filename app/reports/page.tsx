export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import { Activity, Droplet, DollarSign, TrendingUp } from 'lucide-react'
import ExportCSV from './components/ExportCSV'

export default async function ReportsPage() {
  const [vehicles, completedTrips, fuelLogs, maintenanceLogs] = await Promise.all([
    prisma.vehicle.findMany(),
    prisma.trip.findMany({ where: { status: 'Completed' } }),
    prisma.fuelLog.findMany(),
    prisma.maintenanceLog.findMany()
  ])

  // Fleet Utilization = vehicles On Trip / total non-retired vehicles × 100
  const nonRetired = vehicles.filter(v => v.status !== 'Retired')
  const onTrip = vehicles.filter(v => v.status === 'On Trip').length
  const fleetUtilization = nonRetired.length > 0 ? (onTrip / nonRetired.length) * 100 : 0

  // Fuel Efficiency = (sum actualDistance from completed trips) / (sum fuel liters logged)
  const totalDistance = completedTrips.reduce((sum, t) => sum + (t.actualDistance || 0), 0)
  const totalFuel = fuelLogs.reduce((sum, f) => sum + f.liters, 0)
  const fuelEfficiencyValue = (totalDistance > 0 && totalFuel > 0) ? totalDistance / totalFuel : null
  const fuelEfficiencyDisplay = fuelEfficiencyValue !== null ? `${fuelEfficiencyValue.toFixed(2)} km/L` : 'N/A'

  // Operational Cost (Fuel + Maintenance)
  const totalFuelCost = fuelLogs.reduce((sum, f) => sum + f.cost, 0)
  const totalMaintenanceCost = maintenanceLogs.reduce((sum, m) => sum + m.cost, 0)
  const operationalCost = totalFuelCost + totalMaintenanceCost

  // Vehicle ROI (assuming a fixed revenue rate of ₹5 per km driven for this hackathon)
  const REVENUE_PER_KM = 5
  const totalRevenue = totalDistance * REVENUE_PER_KM
  const totalAcquisitionCost = vehicles.reduce((sum, v) => sum + v.acquisitionCost, 0)
  
  const roi = totalAcquisitionCost > 0 
    ? ((totalRevenue - operationalCost) / totalAcquisitionCost) * 100 
    : 0

  const metrics = [
    { label: 'Fleet Utilization', value: `${fleetUtilization.toFixed(1)}%`, icon: Activity, color: 'var(--accent-primary)' },
    { label: 'Fuel Efficiency', value: fuelEfficiencyDisplay, icon: Droplet, color: 'var(--success)' },
    { label: 'Operational Cost', value: `₹${operationalCost.toFixed(2)}`, icon: DollarSign, color: 'var(--warning)' },
    { label: 'Vehicle ROI', value: `${roi.toFixed(2)}%`, icon: TrendingUp, color: 'var(--accent-secondary)' },
  ]

  const csvData = vehicles.map(v => {
    const vehicleTrips = completedTrips.filter(t => t.vehicleId === v.id)
    const vehicleDistance = vehicleTrips.reduce((sum, t) => sum + (t.actualDistance || 0), 0)
    return {
      registrationNumber: v.registrationNumber,
      completedTrips: vehicleTrips.length,
      totalDistance: vehicleDistance,
      acquisitionCost: v.acquisitionCost,
      status: v.status
    }
  })

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-secondary">Key performance metrics and fleet insights.</p>
        </div>
        <ExportCSV data={csvData} />
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {metrics.map((metric, idx) => {
          const Icon = metric.icon
          return (
            <div key={idx} className="glass-card flex items-center gap-4">
              <div style={{
                background: `${metric.color}15`,
                color: metric.color,
                padding: '1rem',
                borderRadius: '12px'
              }}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-secondary" style={{ fontSize: '0.875rem', fontWeight: 500 }}>{metric.label}</p>
                <h2 style={{ fontSize: '1.75rem', margin: 0 }}>{metric.value}</h2>
              </div>
            </div>
          )
        })}
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem' }}>Per-Vehicle Breakdown</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ borderBottom: '1px solid var(--border-color)' }}>
              <tr>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Vehicle</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Completed Trips</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Total Distance</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Acq. Cost</th>
                <th style={{ padding: '1rem', color: 'var(--text-secondary)' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {vehicles.map(v => {
                const vehicleTrips = completedTrips.filter(t => t.vehicleId === v.id)
                const vehicleDistance = vehicleTrips.reduce((sum, t) => sum + (t.actualDistance || 0), 0)
                return (
                  <tr key={v.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem', fontWeight: 500 }}>{v.registrationNumber}</td>
                    <td style={{ padding: '1rem' }}>{vehicleTrips.length}</td>
                    <td style={{ padding: '1rem' }}>{vehicleDistance} km</td>
                    <td style={{ padding: '1rem' }}>₹{v.acquisitionCost.toFixed(2)}</td>
                    <td style={{ padding: '1rem' }}>
                      <span className="badge badge-neutral">{v.status}</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
