import prisma from '@/lib/prisma_init';
import { PageBlock } from 'visio-cms';
import { cookies } from 'next/headers';

export async function getPageBlocks(blocks: PageBlock[], projectId: string) {
  let globals = await prisma.globalBlock.findMany({ where: { projectId } });

  //check if page block has an existing globalId
  blocks = await Promise.all(
    blocks.map(async (block) => {
      let pBlock = block;
      if (pBlock.globalId) {
        let globalBlock = globals.find((global) => global.id === pBlock.globalId);
        let gBlock = pBlock;
        if (globalBlock) {
          gBlock = globalBlock.block as PageBlock;
        }
        return {
          ...gBlock,
          globalId: globalBlock ? globalBlock.id : '',
        };
      } else {
        return {
          ...pBlock,
          globalId: '',
        };
      }
    }),
  );
  return blocks;
}

export const isValidUrl = (url: string) => {
  const urlRegex = /^(https?):\/\/[^\s/$.?#].[^\s]*$/;
  return urlRegex.test(url);
};

export const isValidImageUrl = (url: string) => {
  const urlRegex = /^(https?|data:image\/[a-z]+;base64,)/i;
  return urlRegex.test(url);
};

export function generateUniqueNumbers(): string {
  let numbers: number[] = [];
  while (numbers.length < 4) {
    let randomNumber = Math.floor(Math.random() * 10);
    if (!numbers.includes(randomNumber)) {
      numbers.push(randomNumber);
    }
  }
  return numbers.join('');
}
