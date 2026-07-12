'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createVehicle(formData: FormData) {
  const registrationNumber = formData.get('registrationNumber') as string
  const name = formData.get('name') as string
  const type = formData.get('type') as string
  const maxLoadCapacity = parseFloat(formData.get('maxLoadCapacity') as string)
  const acquisitionCost = parseFloat(formData.get('acquisitionCost') as string)

  if (!registrationNumber || !name || !type || isNaN(maxLoadCapacity) || isNaN(acquisitionCost)) {
    return { error: 'All fields are required and must be valid.' }
  }

  try {
    await prisma.vehicle.create({
      data: {
        registrationNumber,
        name,
        type,
        maxLoadCapacity,
        acquisitionCost
      }
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Registration number must be unique.' }
    }
    return { error: 'Failed to create vehicle.' }
  }

  redirect('/vehicles')
}
