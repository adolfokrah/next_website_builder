import prisma from '@/lib/prisma_init';
import {  getPageBlocks } from '@/lib/utils';
import { cookies } from 'next/headers';
import { verifyJwtToken } from '@/lib/auth';


export async function GET(request: Request, { params }: { params: { slug: string } }) {
    const {slug} = params

     let page = await prisma.page.findFirst({
        where: {
        slug: `/${slug}`,
        },
        select: {
        blocks: true,
        status: true,
        },
    });
    prisma.$disconnect()

    
    if(!page || page.status === "DRAFT"){
        return Response.json({error: 'page not found'}) 
    }

    if (page?.blocks) {
        page.blocks =
        JSON.parse(JSON.stringify(await getPageBlocks(JSON.parse(JSON.stringify(page.blocks))))) ||
        JSON.parse(JSON.stringify(page?.blocks));
    }

  const cookieStore = cookies();
  const { value: token } = cookieStore.get('token') ?? { value: '' };
  let isValidToken = await verifyJwtToken(token);
  return Response.json({page, isValidToken, error: null}) 
}