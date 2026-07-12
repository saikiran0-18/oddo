const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with demo data...')

  // Create default manager user if it doesn't exist
  await prisma.user.upsert({
    where: { email: 'manager@transitops.com' },
    update: {},
    create: {
      email: 'manager@transitops.com',
      password: 'password123',
      role: 'Fleet Manager'
    }
  })

  // Clear existing to avoid duplicates if run multiple times
  await prisma.trip.deleteMany()
  await prisma.fuelLog.deleteMany()
  await prisma.maintenanceLog.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.vehicle.deleteMany()
  await prisma.driver.deleteMany()

  // Seed Vehicles
  const v1 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'TX-1234-AB',
      name: 'Heavy Hauler 1',
      type: 'Heavy Truck',
      maxLoadCapacity: 15000,
      odometer: 45000,
      acquisitionCost: 120000,
      status: 'Available'
    }
  })

  const v2 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'NY-9876-CD',
      name: 'City Sprinter',
      type: 'Van',
      maxLoadCapacity: 2500,
      odometer: 12000,
      acquisitionCost: 45000,
      status: 'Available'
    }
  })

  const v3 = await prisma.vehicle.create({
    data: {
      registrationNumber: 'CA-5555-EF',
      name: 'Reefer Unit A',
      type: 'Refrigerated Truck',
      maxLoadCapacity: 12000,
      odometer: 85000,
      acquisitionCost: 150000,
      status: 'In Shop'
    }
  })

  // Seed Drivers
  const d1 = await prisma.driver.create({
    data: {
      name: 'John Doe',
      licenseNumber: 'DL-12345678',
      licenseCategory: 'CDL-A',
      licenseExpiryDate: new Date('2028-05-15'),
      contactNumber: '555-0101',
      safetyScore: 98,
      status: 'Available'
    }
  })

  const d2 = await prisma.driver.create({
    data: {
      name: 'Jane Smith',
      licenseNumber: 'DL-87654321',
      licenseCategory: 'Class B',
      licenseExpiryDate: new Date('2027-11-20'),
      contactNumber: '555-0202',
      safetyScore: 100,
      status: 'Available'
    }
  })

  // Seed Maintenance Log for v3
  await prisma.maintenanceLog.create({
    data: {
      description: 'Replace brake pads and rotors',
      cost: 450.00,
      status: 'Active',
      vehicleId: v3.id
    }
  })

  // Seed some Expenses and Fuel Logs
  await prisma.fuelLog.create({
    data: {
      liters: 150,
      cost: 450,
      vehicleId: v1.id,
      date: new Date(Date.now() - 86400000 * 2) // 2 days ago
    }
  })

  await prisma.expense.create({
    data: {
      description: 'Monthly Insurance Premium',
      amount: 1200,
      category: 'General'
    }
  })

  console.log('Seeding finished successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
