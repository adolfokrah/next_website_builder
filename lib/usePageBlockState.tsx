import { create } from 'zustand';
import { BuilderStateProps, PageBlock } from './types';
import registerBlocks from '../components/blocks/blocks_registery';

export const usePageBlocksState = create<Pick<BuilderStateProps, 'pageBlocks' | 'setPageBlocks'>>((set) => ({
  pageBlocks: [],
  setPageBlocks: (blocks) => {
    set(() => ({
      pageBlocks: blocks.map((block) => ({
        ...block,
        props: registerBlocks.find((foundBlock) => foundBlock.key === block.key)?.props || [],
      })) as PageBlock[],
    }));
  },
}));
