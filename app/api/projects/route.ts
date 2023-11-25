import prisma from '@/lib/prisma_init';

export async function POST(req: Request) {
  const { name, ownerId } = await req.json();

  try {
    const createdProject = await prisma.project.create({
      data: {
        name,
        owner: {
          connect: { id: ownerId },
        },
      },
    });
    prisma.$disconnect();
    return Response.json(createdProject);
  } catch (error) {
    console.log(error);
    return Response.json({ error: 'An error occurred' });
  }
}
