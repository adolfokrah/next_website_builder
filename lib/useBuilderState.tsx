import { create } from 'zustand';

type ViewPorts = 'Desktop' | 'Mobile' | 'Tablet';
type BuilderStateProps = {
  showPageSideBar: boolean;
  viewPort: ViewPorts;
  togglePageSideBar: () => void;
  setViewPort: (viewPort: ViewPorts) => void;
};
export const useBuilderState = create<BuilderStateProps>((set) => ({
  showPageSideBar: false,
  viewPort: 'Desktop',
  togglePageSideBar: () => {
    set((state) => ({ showPageSideBar: !state.showPageSideBar }));
  },
  setViewPort: (viewPort) => {
    set(() => ({ viewPort: viewPort }));
  },
}));
