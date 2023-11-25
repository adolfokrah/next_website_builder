import prisma from '@/lib/prisma_init';
export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  try {
    let data = await prisma.file.findMany({
      select: { id: true, width: true, height: true, url: true, name: true, cloudinaryImageId: true, bytes: true },
      orderBy: { createdAt: 'desc' },
      where: { projectId: params.projectId },
    });
    prisma.$disconnect();
    return Response.json({ data });
  } catch (error) {
    return Response.json({ error: 'Oops, something happened' });
  }
}


