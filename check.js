const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const v = await prisma.vehicle.findMany()
  console.log("Vehicles in DB:", v.length)
}
main().catch(console.error).finally(() => prisma.$disconnect())
