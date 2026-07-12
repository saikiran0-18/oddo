export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma';
import { ChartWrapper } from '@/components/ChartWrapper';
import { Suspense } from 'react';

export default async function AnalyticsPage() {
  // Aggregated data for charts
  const [fleetUtil, fuelEfficiency, activeTrips] = await Promise.all([
    prisma.vehicle.aggregate({
      _count: { where: { status: { not: 'Retired' } }, _all: true },
      _sum: { onTrip: true }
    }),
    prisma.trip.aggregate({
      _sum: { distance: true, fuelConsumed: true },
      where: { status: 'Completed' }
    }),
    prisma.trip.groupBy({
      by: ['vehicleId'],
      _count: { _all: true },
      where: { status: 'Active' }
    })
  ]);

  const utilization =
    (fleetUtil._sum?.onTrip ?? 0) / (fleetUtil._count?._all ?? 1) * 100;
  const fuelEff =
    (fuelEfficiency._sum?.distance ?? 0) / (fuelEfficiency._sum?.fuelConsumed ?? 1);

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
              data: [fuelEff.toFixed(2)],
              borderColor: '#ef4444',
              fill: false,
            }]
          }} />
        </Suspense>
        <Suspense fallback={<div>Loading Active Trips...</div>}>
          <ChartWrapper type="bar" title="Active Trips per Vehicle" data={{{
            labels: activeTrips.map(t => t.vehicleId),
            datasets: [{
              label: 'Active Trips',
              data: activeTrips.map(t => t._count._all),
              backgroundColor: '#f59e0b',
            }]
          }}} />
        </Suspense>
      </div>
    </div>
  );
}
