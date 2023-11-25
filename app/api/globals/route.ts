import { PageBlock } from 'visio-cms';
import { PageStatus } from '@prisma/client';
import prisma from '@/lib/prisma_init';

export async function POST(req: Request) {
  const { name, block, slug, blocks, projectId } = await req.json();

  try {
    const createdBlock = await prisma.globalBlock.create({
      data: {
        name,
        block: {
          id: block.id,
          key: block.key,
          inputs: block.inputs as object[],
        },
        projectId,
      },
    });
    prisma.$disconnect();

    let foundPage = await prisma.page.findFirst({
      where: {
        slug,
        projectId
      },
      select: {
        blocks: true,
        status: true,
        id: true,
      },
    });

    if (foundPage) {
     
      const page = await prisma.page.update({where: {id: foundPage.id}, data:{
         blocks: blocks
      }})

      let pageBlocks = page?.blocks
        .map((pageBlock: PageBlock) => {
          if (pageBlock) {
            let pBlock = pageBlock as Pick<PageBlock, 'id' | 'key' | 'inputs' | 'globalId'>;
            return {
              ...pBlock,
              globalId: block.id === pBlock.id ? createdBlock.id : pBlock?.globalId,
            };
          }
          return null;
        })
        .filter(Boolean) as PageBlock[];

      await prisma.page.update({where: {id: foundPage.id}, data:{
         blocks: pageBlocks
      }})
      return Response.json({ createdBlock });
    }
  } catch (error) {
    console.log(error)
    return Response.json({ error: 'Oops, something happened, make sure the global name does not exist' });
  }
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  try {
    const deletedBlock = await prisma.globalBlock.delete({
      where: { id },
    });
    prisma.$disconnect();

    return Response.json({ deletedBlock });
  } catch (error) {
    return Response.json({ error: 'Oops, something happened, make sure the global name does not exist' });
  }
}

export async function PATCH(req: Request) {
  const { id, block } = await req.json();
  try {
    let data = await prisma.globalBlock.update({ where: { id }, data: { block: JSON.parse(JSON.stringify(block)) } });
    return Response.json({ data, error: null });
  } catch (e) {
    return Response.json({ error: 'Oops, something happened, make sure the global name does not exist' });
  }
}
