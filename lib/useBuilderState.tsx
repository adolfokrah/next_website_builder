import { create } from 'zustand';
import { BuilderStateProps, PageBlock } from './types';
import registerBlocks from '../components/blocks/blocks_registery';

export const useBuilderState = create<BuilderStateProps>((set) => ({
  showPageSideBar: false,
  viewPort: 'Desktop',
  pageBlocks: [],
  pages: [],
  pageId: '',
  buildStatus: 'saved',
  messageToIframe: 'build',
  togglePageSideBar: () => {
    set((state) => ({ showPageSideBar: !state.showPageSideBar }));
  },
  setViewPort: (viewPort) => {
    set(() => ({ viewPort: viewPort }));
  },
  setPageBlocks: (blocks) => {
    set(() => ({
      pageBlocks: blocks.map((block) => ({
        ...block,
        props: registerBlocks.find((foundBlock) => foundBlock.key === block.key)?.props || [],
      })) as PageBlock[],
    }));
  },
  setPageId: (id) => {
    set(() => ({ pageId: id }));
  },
  setMessageToIframe: (message) => {
    set(() => ({ messageToIframe: message }));
  },
  setBuildStatus: (status) => {
    set(() => ({ buildStatus: status }));
  },
  setPages: (pages) => {
    set(() => ({ pages }));
  },
}));
