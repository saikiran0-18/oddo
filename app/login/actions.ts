'use server'

import { prisma } from '@/lib/prisma'
import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function login(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user) {
    return { error: 'Account does not exist. Please create an account.' }
  }

  if (user.password !== password) {
    return { error: 'Invalid credentials' }
  }

  await createSession({
    id: user.id,
    email: user.email,
    role: user.role
  })

  redirect('/dashboard')
}

export async function register(prevState: any, formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as string

  if (!email || !password || !role) {
    return { error: 'All fields are required' }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return { error: 'An account with this email already exists.' }
  }

  const newUser = await prisma.user.create({
    data: {
      email,
      password, // Note: In a real app, hash this password
      role
    }
  })

  await createSession({
    id: newUser.id,
    email: newUser.email,
    role: newUser.role
  })

  redirect('/dashboard')
}
