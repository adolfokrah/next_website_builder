import prisma from '@/lib/prisma_init';
import { getPageBlocks } from '@/lib/utils';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const {slug} = params
  
    let page = await prisma.page.findFirst({
    where: {
      slug: `/${slug}`,
    },
    select: {
      blocks: true,
    },
  });
  let globals = await prisma.globalBlock.findMany();

  if (page?.blocks) {
    page.blocks =
      JSON.parse(JSON.stringify(await getPageBlocks(JSON.parse(JSON.stringify(page.blocks))))) ||
      JSON.parse(JSON.stringify(page?.blocks));
  }

   return Response.json( { page, globals }) 
}