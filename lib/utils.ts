import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import prisma from '@/lib/prisma_init';
import { GlobalBlock, PageBlock } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getPageBlocks (blocks: GlobalBlock[]):Promise<GlobalBlock[]>{
  let globals = await prisma.globalBlock.findMany();

  //check if page block has an existing globalId
   blocks = await Promise.all(
      blocks.map(async (block) => {
        let pBlock = block;
        if (pBlock.globalId) {
          let globalBlock = globals.find((global) => global.id === pBlock.globalId);
          let gBlock = pBlock;
          if (globalBlock) {
            gBlock = globalBlock.block as GlobalBlock;
          }
          return {
            ...gBlock,
            globalId: globalBlock ? globalBlock.id : null,
          };
        } else {
          return {
            ...pBlock,
            globalId: null,
          };
        }
      }),
    );
    return blocks
}

export  const isValidUrl = (url: string) => {
    const urlRegex = /^(https?):\/\/[^\s/$.?#].[^\s]*$/;
    return urlRegex.test(url);
  };

  export const isValidImageUrl=(url: string)=>{
    const urlRegex = /^(https?|data:image\/[a-z]+;base64,)/i;
    return urlRegex.test(url);
  }