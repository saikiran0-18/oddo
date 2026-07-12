'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createMaintenanceLog(formData: FormData) {
  const vehicleId = formData.get('vehicleId') as string
  const description = formData.get('description') as string
  const cost = parseFloat(formData.get('cost') as string)

  if (!vehicleId || !description || isNaN(cost)) {
    throw new Error('All fields are required.')
  }

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } })
  if (!vehicle) throw new Error('Vehicle not found.')
  if (vehicle.status === 'On Trip') throw new Error('Vehicle is currently on a trip.')

  try {
    await prisma.$transaction([
      prisma.maintenanceLog.create({
        data: {
          description,
          cost,
          vehicleId,
          status: 'Active'
        }
      }),
      prisma.vehicle.update({
        where: { id: vehicleId },
        data: { status: 'In Shop' }
      })
    ])
  } catch (error: any) {
    throw new Error('Failed to create maintenance log.')
  }

  redirect('/maintenance')
}

export async function closeMaintenanceLog(logId: string) {
  const log = await prisma.maintenanceLog.findUnique({ 
    where: { id: logId },
    include: { vehicle: true } 
  })
  if (!log) throw new Error("Log not found")

  const newStatus = log.vehicle.status === 'Retired' ? 'Retired' : 'Available'

  await prisma.$transaction([
    prisma.maintenanceLog.update({
      where: { id: logId },
      data: { status: 'Closed' }
    }),
    prisma.vehicle.update({
      where: { id: log.vehicleId },
      data: { status: newStatus }
    })
  ])

  revalidatePath('/maintenance')
  revalidatePath('/dashboard')
}
