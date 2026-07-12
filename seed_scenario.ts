import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Starting simulation scenario...")

  // Clean DB (Optional but good for a fresh scenario)
  await prisma.maintenanceLog.deleteMany()
  await prisma.fuelLog.deleteMany()
  await prisma.trip.deleteMany()
  await prisma.driver.deleteMany()
  // await prisma.vehicleDocument.deleteMany()
  await prisma.vehicle.deleteMany()

  // Step 1: Register a vehicle 'Van-05' with a maximum capacity of 500 kg. Status = Available.
  console.log("Step 1: Registering Van-05...")
  const vehicle = await prisma.vehicle.create({
    data: {
      registrationNumber: 'MH-12-VAN-05',
      name: 'Van-05',
      type: 'Van',
      maxLoadCapacity: 500,
      acquisitionCost: 15000,
      status: 'Available',
      odometer: 10000
    }
  })

  // Step 2: Register driver 'Alex' with a valid driving license.
  console.log("Step 2: Registering Driver Alex...")
  const driver = await prisma.driver.create({
    data: {
      name: 'Alex',
      licenseNumber: 'DL-ALEX-2026',
      licenseCategory: 'LMV',
      licenseExpiryDate: new Date('2030-01-01'), // Valid license
      contactNumber: '555-0101',
      status: 'Available'
    }
  })

  // Step 3: Create a trip with Cargo Weight = 450 kg.
  console.log("Step 3: Creating Trip (450kg)...")
  // Step 4 is implicit validation, we will just create it assuming it passed UI/Server action checks
  const trip = await prisma.trip.create({
    data: {
      source: 'Warehouse A',
      destination: 'Client B',
      cargoWeight: 450, // 450 <= 500
      plannedDistance: 120,
      vehicleId: vehicle.id,
      driverId: driver.id,
      status: 'Draft'
    }
  })

  // Step 5: Dispatch trip (Vehicle and Driver status automatically become On Trip)
  console.log("Step 5: Dispatching Trip...")
  await prisma.$transaction([
    prisma.trip.update({ where: { id: trip.id }, data: { status: 'Dispatched' } }),
    prisma.vehicle.update({ where: { id: vehicle.id }, data: { status: 'On Trip' } }),
    prisma.driver.update({ where: { id: driver.id }, data: { status: 'On Trip' } })
  ])

  // Step 6 & 7: Complete the trip (marks both Vehicle and Driver as Available)
  console.log("Step 6 & 7: Completing Trip (entering odometer and fuel)...")
  const actualDistance = 125 // 125 km driven
  const fuelConsumedLiters = 15 // 15 liters
  const fuelCost = 1500 // Cost of fuel

  await prisma.$transaction([
    prisma.trip.update({
      where: { id: trip.id },
      data: { status: 'Completed', actualDistance }
    }),
    prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { status: 'Available', odometer: { increment: actualDistance } }
    }),
    prisma.driver.update({
      where: { id: driver.id },
      data: { status: 'Available' }
    }),
    prisma.fuelLog.create({
      data: { liters: fuelConsumedLiters, cost: fuelCost, vehicleId: vehicle.id }
    })
  ])

  // Step 8: Create a maintenance record (e.g., Oil Change). Vehicle status automatically becomes In Shop
  console.log("Step 8: Creating Maintenance Record (Oil Change)...")
  await prisma.$transaction([
    prisma.maintenanceLog.create({
      data: {
        description: 'Oil Change',
        cost: 3500,
        vehicleId: vehicle.id,
        status: 'Active'
      }
    }),
    prisma.vehicle.update({
      where: { id: vehicle.id },
      data: { status: 'In Shop' }
    })
  ])

  // Step 9 is viewing the reports, which the user will do in the UI!
  console.log("Scenario completed successfully! Reports are now updated.")
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
