import { create } from 'zustand';
import { BuilderStateProps, PageBlock } from './types';

export const useBuilderState = create<BuilderStateProps>((set) => ({
  showPageSideBar: false,
  viewPort: 'Desktop',
  pageBlocks: [],
  togglePageSideBar: () => {
    set((state) => ({ showPageSideBar: !state.showPageSideBar }));
  },
  setViewPort: (viewPort) => {
    set(() => ({ viewPort: viewPort }));
  },
  setPageBlocks: (blocks) => {
    set(() => ({ pageBlocks: blocks as PageBlock[] }));
  },
}));
