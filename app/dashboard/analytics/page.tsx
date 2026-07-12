import { prisma } from '@/lib/prisma';
import { ChartWrapper } from '@/components/ChartWrapper';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const [nonRetiredVehicles, onTripVehicles, completedTrips, fuelLogs, activeTrips] = await Promise.all([
    prisma.vehicle.count({ where: { status: { not: 'Retired' } } }),
    prisma.vehicle.count({ where: { status: 'On Trip' } }),
    prisma.trip.findMany({ where: { status: 'Completed' } }),
    prisma.fuelLog.findMany(),
    prisma.trip.groupBy({
      by: ['vehicleId'],
      _count: { _all: true },
      where: { status: 'Dispatched' }
    })
  ]);

  const utilization = nonRetiredVehicles > 0 ? (onTripVehicles / nonRetiredVehicles) * 100 : 0;
  
  const totalDistance = completedTrips.reduce((sum, t) => sum + (t.actualDistance || 0), 0);
  const totalFuel = fuelLogs.reduce((sum, f) => sum + f.liters, 0);
  const fuelEff = totalFuel > 0 ? totalDistance / totalFuel : 0;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      <h1 className="mb-6">Analytics Dashboard</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<div>Loading Utilization...</div>}>
          <ChartWrapper type="pie" title="Fleet Utilization" data={{
            labels: ['Utilized', 'Available'],
            datasets: [{
              data: [utilization, 100 - utilization],
              backgroundColor: ['#4f46e5', '#10b981'],
            }]
          }} />
        </Suspense>
        <Suspense fallback={<div>Loading Fuel Efficiency...</div>}>
          <ChartWrapper type="line" title="Fuel Efficiency (km/L)" data={{
            labels: ['Average'],
            datasets: [{
              label: 'km/L',
              data: [Number(fuelEff.toFixed(2))],
              borderColor: '#ef4444',
              fill: false,
            }]
          }} />
        </Suspense>
        <Suspense fallback={<div>Loading Active Trips...</div>}>
          <ChartWrapper type="bar" title="Active Trips per Vehicle" data={{
            labels: activeTrips.map(t => t.vehicleId.slice(0, 8)),
            datasets: [{
              label: 'Active Trips',
              data: activeTrips.map(t => t._count._all),
              backgroundColor: '#f59e0b',
            }]
          }} />
        </Suspense>
      </div>
    </div>
  );
}
