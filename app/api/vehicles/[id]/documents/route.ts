import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'vehicle-docs', params.id);
    await fs.mkdir(uploadDir, { recursive: true });
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filePath = path.join(uploadDir, file.name);
    await fs.writeFile(filePath, buffer);

    const docMeta = { name: file.name, url: `/uploads/vehicle-docs/${params.id}/${file.name}`, uploadedAt: new Date().toISOString() };
    await prisma.vehicle.update({
      where: { id: params.id },
      data: { documents: { push: docMeta } },
    });
    return NextResponse.json({ success: true, document: docMeta });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
