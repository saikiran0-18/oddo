'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createDriver(formData: FormData) {
  const name = formData.get('name') as string
  const licenseNumber = formData.get('licenseNumber') as string
  const licenseCategory = formData.get('licenseCategory') as string
  const licenseExpiryDate = new Date(formData.get('licenseExpiryDate') as string)
  const contactNumber = formData.get('contactNumber') as string

  if (!name || !licenseNumber || !licenseCategory || !contactNumber || isNaN(licenseExpiryDate.getTime())) {
    return { error: 'All fields are required and must be valid.' }
  }

  try {
    await prisma.driver.create({
      data: {
        name,
        licenseNumber,
        licenseCategory,
        licenseExpiryDate,
        contactNumber
      }
    })
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'License number must be unique.' }
    }
    return { error: 'Failed to create driver.' }
  }

  redirect('/drivers')
}
