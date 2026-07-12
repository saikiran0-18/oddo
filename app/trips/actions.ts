'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createTrip(prevState: any, formData: FormData) {
  const source = formData.get('source') as string
  const destination = formData.get('destination') as string
  const cargoWeight = parseFloat(formData.get('cargoWeight') as string)
  const plannedDistance = parseFloat(formData.get('plannedDistance') as string)
  const vehicleId = formData.get('vehicleId') as string
  const driverId = formData.get('driverId') as string

  if (!source || !destination || isNaN(cargoWeight) || isNaN(plannedDistance) || !vehicleId || !driverId) {
    return { error: 'All fields are required.' }
  }

  // Business Rule: Cargo Weight must not exceed the vehicle's maximum load capacity
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } })
  if (!vehicle) return { error: 'Vehicle not found.' }
  if (vehicle.status !== 'Available') {
    return { error: `Vehicle ${vehicle.registrationNumber} is not available (currently ${vehicle.status}).` }
  }
  if (cargoWeight > vehicle.maxLoadCapacity) {
    return { error: `Cargo weight (${cargoWeight}kg) exceeds vehicle capacity (${vehicle.maxLoadCapacity}kg).` }
  }

  // Business Rule: Driver must be Available
  const driver = await prisma.driver.findUnique({ where: { id: driverId } })
  if (!driver) return { error: 'Driver not found.' }
  if (driver.status !== 'Available') {
    return { error: `Driver ${driver.name} is not available (currently ${driver.status}).` }
  }
  if (new Date(driver.licenseExpiryDate) < new Date()) {
    return { error: `Driver ${driver.name}'s license has expired.` }
  }

  try {
    await prisma.trip.create({
      data: {
        source,
        destination,
        cargoWeight,
        plannedDistance,
        vehicleId,
        driverId,
        status: 'Draft'
      }
    })
  } catch (error: any) {
    return { error: 'Failed to create trip.' }
  }

  redirect('/trips')
}

export async function dispatchTrip(tripId: string) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } })
  if (!trip) throw new Error("Trip not found")
  if (trip.status !== 'Draft') throw new Error("Only draft trips can be dispatched")

  // Update Trip, Vehicle, and Driver statuses in a transaction
  await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: { status: 'Dispatched' }
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicleId },
      data: { status: 'On Trip' }
    }),
    prisma.driver.update({
      where: { id: trip.driverId },
      data: { status: 'On Trip' }
    })
  ])

  revalidatePath('/trips')
  revalidatePath('/dashboard')
  revalidatePath('/reports')
}

export async function completeTrip(tripId: string, actualDistance: number, fuelConsumedLiters: number, fuelCost: number) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } })
  if (!trip) throw new Error("Trip not found")
  if (trip.status !== 'Dispatched') throw new Error("Only dispatched trips can be completed")

  // Transaction: Complete trip, restore statuses, update odometer, save actualDistance, record fuel
  await prisma.$transaction([
    prisma.trip.update({
      where: { id: tripId },
      data: { 
        status: 'Completed',
        actualDistance: actualDistance
      }
    }),
    prisma.vehicle.update({
      where: { id: trip.vehicleId },
      data: { 
        status: 'Available',
        odometer: { increment: actualDistance } 
      }
    }),
    prisma.driver.update({
      where: { id: trip.driverId },
      data: { status: 'Available' }
    }),
    prisma.fuelLog.create({
      data: {
        liters: fuelConsumedLiters,
        cost: fuelCost,
        vehicleId: trip.vehicleId
      }
    })
  ])

  revalidatePath('/trips')
  revalidatePath('/dashboard')
  revalidatePath('/reports')
}

export async function cancelTrip(tripId: string) {
  const trip = await prisma.trip.findUnique({ where: { id: tripId } })
  if (!trip) throw new Error("Trip not found")
  if (trip.status !== 'Draft' && trip.status !== 'Dispatched') {
    throw new Error("Only draft or dispatched trips can be cancelled")
  }
  
  // Transaction: Cancel trip, restore statuses if it was dispatched
  const actions: any[] = [
    prisma.trip.update({
      where: { id: tripId },
      data: { status: 'Cancelled' }
    })
  ]

  if (trip.status === 'Dispatched') {
    actions.push(
      prisma.vehicle.update({
        where: { id: trip.vehicleId },
        data: { status: 'Available' }
      }),
      prisma.driver.update({
        where: { id: trip.driverId },
        data: { status: 'Available' }
      })
    )
  }

  await prisma.$transaction(actions)

  revalidatePath('/trips')
  revalidatePath('/dashboard')
  revalidatePath('/reports')
}
