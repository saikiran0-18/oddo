export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { DriverListClient } from './components/DriverListClient'

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

      <DriverListClient initialDrivers={drivers} />
    </div>
  )
}
