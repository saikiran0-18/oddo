export const dynamic = 'force-dynamic';
import { prisma } from '@/lib/prisma'
import NewTripForm from './NewTripForm'

export default async function NewTripPage() {
  const [vehicles, drivers] = await Promise.all([
    prisma.vehicle.findMany({ 
      where: { status: 'Available' },
      select: { id: true, registrationNumber: true, name: true, maxLoadCapacity: true }
    }),
    prisma.driver.findMany({ 
      where: { 
        status: 'Available',
        licenseExpiryDate: { gt: new Date() }
      },
      select: { id: true, name: true, licenseCategory: true }
    })
  ])

  return <NewTripForm vehicles={vehicles} drivers={drivers} />
}
