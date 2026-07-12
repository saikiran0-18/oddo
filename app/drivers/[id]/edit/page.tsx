export const dynamic = 'force-dynamic';

import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { EditDriverForm } from '../../components/EditDriverForm'

export default async function EditDriverPage({ params }: { params: { id: string } }) {
  const driver = await prisma.driver.findUnique({
    where: { id: params.id }
  })

  if (!driver) {
    notFound()
  }

  return <EditDriverForm driver={driver} />
}
