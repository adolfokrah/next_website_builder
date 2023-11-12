'use server';

import prisma from '../prisma_init';
import { revalidatePath } from 'next/cache';
import { GlobalBlock, PageBlock } from '../types';
import { savePage } from './pageActions';

export const insertGlobalBlock = async ({ name, block, slug }: { name: string; block: PageBlock; slug: string }) => {
  try {
    const createdBlock = await prisma.globalBlock.create({
      data: {
        name,
        block: {
          id: block.id,
          key: block.key,
          inputs: block.inputs as object[],
        },
      },
    });
    prisma.$disconnect();

    let page = await prisma.page.findFirst({
      where: {
        slug,
      },
      select: {
        blocks: true,
        status: true,
        id: true,
      },
    });

    if (page) {
      let pageBlocks = page.blocks
        .map((pageBlock) => {
          if (pageBlock) {
            let pBlock = pageBlock as Pick<PageBlock, 'id' | 'key' | 'inputs' | 'globalId'>;
            return {
              ...pBlock,
              globalId: block.key === pBlock.key ? createdBlock.id : pBlock?.globalId,
            };
          }
          return null;
        })
        .filter(Boolean) as PageBlock[];
      let data = await savePage({ id: page.id, blocks: pageBlocks, status: page.status });
      revalidatePath('/');
    }
  } catch (error) {
    console.log(error);
    return { error: 'Oops, something happened, make sure the global name does not exist' };
  }
};

export const removeGlobalBlock = async ({ id }: { id: string }) => {
  try {
    const deletedBlock = await prisma.globalBlock.delete({
      where: { id },
    });
    prisma.$disconnect();

    revalidatePath('/');
  } catch (error) {
    return { error: 'Oops, something happened, make sure the global name does not exist' };
  }
};

export const updateGlobalBlock = async ({ id, block }: { id: string; block: GlobalBlock }) => {
  try {
    let data = await prisma.globalBlock.update({ where: { id }, data: { block: JSON.parse(JSON.stringify(block)) } });
    revalidatePath('/');
    return { data: data, error: null };
  } catch (e) {
    return { error: 'Oops, something happened, make sure the global name does not exist' };
  }
};
