import prisma from '@/lib/prisma_init';

export async function GET(request: Request, { params }: { params: { slug: string; projectId: string } }) {
  const { slug, projectId } = params;

  let data = await prisma.page.findFirst({
    where: {
      slug: `/${slug}`,
      projectId: projectId,
    },
    select: {
      metaTitle: true,
      metaDescription: true,
      metaKeyWords: true,
      name: true,
      featuredImage: true,
    },
  });
  prisma.$disconnect();
  return Response.json({
    title: data?.name,
    description: data?.metaDescription,
    keywords: data?.metaKeyWords,
  });
}
