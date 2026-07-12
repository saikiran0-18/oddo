'use server'

import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export async function createExpense(formData: FormData) {
  const category = formData.get('category') as string
  const description = formData.get('description') as string
  const amount = parseFloat(formData.get('amount') as string)

  if (!category || !description || isNaN(amount)) {
    return { error: 'All fields are required.' }
  }

  try {
    await prisma.expense.create({
      data: {
        category,
        description,
        amount
      }
    })
  } catch (error: any) {
    return { error: 'Failed to create expense.' }
  }

  redirect('/expenses')
}
