export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditVehicleForm } from '../../components/EditVehicleForm'

export default async function EditVehiclePage({ params }: { params: { id: string } }) {
  const vehicle = await prisma.vehicle.findUnique({
    where: { id: params.id }
  })

  if (!vehicle) {
    notFound()
  }

  return <EditVehicleForm vehicle={vehicle} />
}
