import prisma from '@/lib/prisma_init';
import { getPageBlocks } from '@/lib/utils';
import { verifyJwtToken } from '@/lib/auth';
import { type NextRequest } from 'next/server';

export async function GET(request: NextRequest, { params }: { params: { slug: string, projectId: string } }) {
  const { slug , projectId} = params;
  const token = request.nextUrl.searchParams.get('token');
  let page = await prisma.page.findFirst({
    where: {
      slug: `/${slug}`,
      projectId
    },
    select: {
      blocks: true,
      status: true,
    },
  });
  prisma.$disconnect();

  if (!page || page.status === 'DRAFT') {
    return Response.json({ error: 'page not found' });
  }

  if (page?.blocks) {
    page.blocks =
      JSON.parse(JSON.stringify(await getPageBlocks(JSON.parse(JSON.stringify(page.blocks)), projectId))) ||
      JSON.parse(JSON.stringify(page?.blocks));
  }

  let isValidToken = await verifyJwtToken(token || '');

  return Response.json({ page, isValidToken, error: null });
}
