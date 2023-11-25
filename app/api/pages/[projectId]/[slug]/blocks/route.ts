import prisma from '@/lib/prisma_init';
import { getPageBlocks } from '@/lib/utils';

export async function GET(request: Request, { params }: { params: { slug: string; projectId: string } }) {
  const { slug, projectId } = params;

  let page = await prisma.page.findFirst({
    where: {
      slug: `/${slug}`,
      projectId: projectId as string,
    },
    select: {
      blocks: true,
    },
  });
  let globals = await prisma.globalBlock.findMany({
    where: {
      projectId: projectId as string,
    },
  });

  if (page?.blocks) {
    page.blocks =
      JSON.parse(JSON.stringify(await getPageBlocks(JSON.parse(JSON.stringify(page.blocks)), projectId))) ||
      JSON.parse(JSON.stringify(page?.blocks));
  }

  return Response.json({ page, globals });
}
