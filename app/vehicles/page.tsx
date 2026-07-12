export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { VehicleListClient } from './components/VehicleListClient'

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

      <VehicleListClient initialVehicles={vehicles} />
    </div>
  )
}
